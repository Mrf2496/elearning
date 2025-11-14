
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { auth, db } from '../lib/firebase.config';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, cedula: string, email: string, password: string, role: 'user' | 'admin') => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_COLLECTION = 'users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data() as User;
           if (data.active === false) {
             // If user is inactive, sign them out.
             // This handles cases where an admin deactivates an active session.
             await signOut(auth);
             setCurrentUser(null);
           } else {
             const userWithDefaults: User = {
                 uid: firebaseUser.uid,
                 name: data.name || 'Usuario',
                 cedula: data.cedula || '',
                 email: data.email || firebaseUser.email || '',
                 role: data.role || 'user',
                 active: data.active !== undefined ? data.active : true,
                 progress: data.progress || { completedSubmodules: [], quizPassed: false }
             };
             setCurrentUser(userWithDefaults);
           }
        } else {
          // If no user document exists, something is wrong, so sign out.
          await signOut(auth);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (identifier: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const isEmail = identifier.includes('@');
      
      // 1. Find user data (by cedula or email) and check active status before attempting auth
      const usersRef = collection(db, USERS_COLLECTION);
      const fieldToQuery = isEmail ? 'email' : 'cedula';

      if (!isEmail && !/^\d+$/.test(identifier)) {
        return { success: false, message: 'La Cédula debe contener solo números.' };
      }
      
      const q = query(usersRef, where(fieldToQuery, '==', identifier));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return { success: false, message: 'Cédula/Correo o contraseña incorrectos.' };
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data() as User;
      
      if (userData.active === false) {
          return { success: false, message: 'Tu cuenta ha sido desactivada. Contacta al administrador.' };
      }

      const email = userData.email;

      // 2. Attempt to sign in
      await signInWithEmailAndPassword(auth, email, password);
      
      return { success: true, message: 'Inicio de sesión exitoso.' };

    } catch (error: any) {
      console.error("Login error:", error);
      if (error.code) {
        switch (error.code) {
          case 'auth/invalid-credential':
          case 'auth/user-not-found':
          case 'auth/wrong-password':
            return { success: false, message: 'Cédula/Correo o contraseña incorrectos. Por favor, verifica tus datos.' };
          case 'auth/too-many-requests':
            return { success: false, message: 'Acceso bloqueado temporalmente por demasiados intentos fallidos. Intenta más tarde.' };
          case 'auth/network-request-failed':
            return { success: false, message: 'Error de red. Por favor, comprueba tu conexión a internet.' };
          default:
            return { success: false, message: 'Ocurrió un error inesperado al iniciar sesión.' };
        }
      }
      
      return { success: false, message: 'Ocurrió un error inesperado al iniciar sesión.' };
    }
  };

  const register = async (name: string, cedula: string, email: string, password: string, role: 'user' | 'admin'): Promise<{ success: boolean; message: string }> => {
    try {
      // Check if cedula or email already exists in Firestore
      const cedulaQuery = query(collection(db, USERS_COLLECTION), where('cedula', '==', cedula));
      const cedulaSnapshot = await getDocs(cedulaQuery);
      if (!cedulaSnapshot.empty) {
        return { success: false, message: 'La cédula ya está registrada.' };
      }

      const emailQuery = query(collection(db, USERS_COLLECTION), where('email', '==', email));
      const emailSnapshot = await getDocs(emailQuery);
      if (!emailSnapshot.empty) {
          return { success: false, message: 'El correo electrónico ya está registrado.' };
      }
      
      // Implement Admin Limit
      if (role === 'admin') {
          const adminsQuery = query(collection(db, USERS_COLLECTION), where('role', '==', 'admin'));
          const adminsSnapshot = await getDocs(adminsQuery);
          if (adminsSnapshot.size >= 2) {
              return { success: false, message: 'Límite de administradores alcanzado (máximo 2)' };
          }
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      // Store additional user info in Firestore
      await setDoc(doc(db, USERS_COLLECTION, uid), {
        uid,
        name,
        cedula,
        email,
        role: role,
        active: true,
        progress: {
            completedSubmodules: [],
            quizPassed: false,
        }
      });

      // Create adminPermissions document if role is admin
      if (role === 'admin') {
          await setDoc(doc(db, 'adminPermissions', uid), {
              userId: uid,
              permissions: {
                  canManageUsers: false,
                  canManageCompanies: false,

                  canViewReports: false,
                  canEditCourses: false,
              }
          });
      }


      return { success: true, message: 'Registro exitoso. Ahora puedes iniciar sesión.' };
    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.code) {
          switch (error.code) {
            case 'auth/email-already-in-use':
              return { success: false, message: 'El correo electrónico ya está registrado por otro usuario.' };
            case 'auth/weak-password':
              return { success: false, message: 'La contraseña es demasiado débil. Debe tener al menos 6 caracteres.' };
            case 'auth/invalid-email':
              return { success: false, message: 'El correo electrónico proporcionado no es válido.' };
            case 'auth/network-request-failed':
              return { success: false, message: 'Error de red. Por favor, comprueba tu conexión a internet.' };
            default:
              return { success: false, message: 'Ocurrió un error inesperado durante el registro.' };
          }
        }
        return { success: false, message: 'Ocurrió un error inesperado durante el registro.' };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
        await sendPasswordResetEmail(auth, email);
        return { success: true, message: 'Se ha enviado un correo para restablecer tu contraseña.' };
    } catch (error: any) {
        console.error("Reset password error:", error);
        let message = 'Ocurrió un error al enviar el correo de restablecimiento.';
        if (error.code) {
            switch(error.code) {
                case 'auth/invalid-email':
                    message = 'El correo electrónico proporcionado no es válido.';
                    break;
                case 'auth/user-not-found':
                    message = 'No se encontró ningún usuario con este correo electrónico.';
                    break;
                case 'auth/network-request-failed':
                    message = 'Error de red. Por favor, comprueba tu conexión a internet.';
                    break;
                case 'auth/too-many-requests':
                    message = 'Demasiadas solicitudes. Intenta de nuevo más tarde.';
                    break;
            }
        }
        return { success: false, message };
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div>Cargando...</div></div>;
  }

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
