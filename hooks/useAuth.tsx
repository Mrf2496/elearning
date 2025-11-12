import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getFirebaseServices, isFirebaseConfigured } from '../firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  deleteUser as deleteAuthUser,
  signInAnonymously,
} from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (cedula: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, cedula: string, email: string, password: string, empresaId?: string) => Promise<{ success: boolean; message: string }>;
  publicRegister?: (name: string, cedula: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const services = getFirebaseServices();
      if (!services) {
          console.error("Firebase services failed to initialize despite configuration being present.");
          // No user will be set, so app will show LoginView
          setLoading(false);
          return;
      }
      const { auth, db } = services;

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser && !firebaseUser.isAnonymous) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setCurrentUser({ uid: firebaseUser.uid, ...userDocSnap.data() } as User);
          } else {
            // This can happen if a user is created in Auth but Firestore doc creation fails
            // and cleanup also fails. In this case, log them out.
            console.warn("User document not found for authenticated user. Logging out.");
            await signOut(auth);
            setCurrentUser(null);
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // If Firebase is not configured, show login screen, do not fallback to demo mode.
      setLoading(false);
    }
  }, []);

  const login = async (cedula: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured()) {
        return { success: false, message: 'La base de datos no está configurada. No se puede iniciar sesión.' };
    }
    const services = getFirebaseServices();
    if (!services) return { success: false, message: 'Error al inicializar los servicios de Firebase.' };
    const { auth, db } = services;
    
    try {
      // Use a temporary anonymous session to query Firestore securely
      await signInAnonymously(auth);
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("cedula", "==", cedula));
      const querySnapshot = await getDocs(q);

      // Sign out the anonymous user immediately after the query
      await signOut(auth);

      if (querySnapshot.empty) {
        return { success: false, message: 'Cédula no registrada.' };
      }
      
      const userDoc = querySnapshot.docs[0];
      const userData = { uid: userDoc.id, ...userDoc.data() } as User;
      
      if (!userData.isActive) {
        return { success: false, message: 'Esta cuenta ha sido desactivada. Contacte al administrador.' };
      }

      const email = userData.email;
      
      // Authenticate with the actual user credentials
      await signInWithEmailAndPassword(auth, email, password);

      return { success: true, message: 'Inicio de sesión exitoso.' };
    } catch (error: any) {
       // Ensure anonymous user is signed out on error
       if (auth.currentUser && auth.currentUser.isAnonymous) {
         await signOut(auth);
       }
       console.error("Login error:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        return { success: false, message: 'Contraseña incorrecta.' };
      }
      return { success: false, message: 'Ocurrió un error al iniciar sesión.' };
    }
  };

  // For admin user creation
  const register = async (name: string, cedula: string, email: string, password: string, empresaId?: string): Promise<{ success: boolean; message: string }> => {
     if (!isFirebaseConfigured()) {
        return { success: false, message: 'La base de datos no está configurada. No se puede registrar.' };
    }
    const services = getFirebaseServices();
    if (!services) return { success: false, message: 'Error al inicializar los servicios de Firebase.' };
    const { auth, db } = services;

     try {
        // This check is performed by an authenticated admin, so it should have permissions.
        if (cedula) {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where("cedula", "==", cedula));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                return { success: false, message: 'La cédula ya está registrada.' };
            }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUser: Omit<User, 'uid' | 'password'> = {
            name,
            cedula,
            email,
            isActive: true,
            empresaId: empresaId || '',
        };

        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
        
        return { success: true, message: 'Usuario creado exitosamente.' };
    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.code === 'auth/email-already-in-use') {
            return { success: false, message: 'El correo electrónico ya está registrado.' };
        }
        if (error.code === 'auth/weak-password') {
            return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
        }
        return { success: false, message: 'Ocurrió un error durante el registro.' };
    }
  };

  // For public user registration
  const publicRegister = async (name: string, cedula: string, email: string, password: string): Promise<{ success: boolean; message: string }> => {
    let firebaseUser: FirebaseUser | null = null;
    const services = getFirebaseServices();
    if (!services) {
      return { success: false, message: 'El registro no está disponible. No se pudo conectar a la base de datos.' };
    }
    const { auth, db } = services;

    try {
      // Step 1: Check uniqueness using a temporary anonymous session
      await signInAnonymously(auth);
      const usersRef = collection(db, 'users');
      const cedulaQuery = query(usersRef, where("cedula", "==", cedula));
      const cedulaSnapshot = await getDocs(cedulaQuery);
      await signOut(auth); // Clean up anonymous session immediately

      if (!cedulaSnapshot.empty) {
        return { success: false, message: 'La cédula ya está registrada en el sistema.' };
      }

      // Step 2. Create Auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;

      // Step 3. Create Firestore user document (user is now authenticated)
      const newUser: Omit<User, 'uid' | 'password'> = {
        name,
        cedula,
        email,
        isActive: true,
        empresaId: '',
      };
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);

      // Step 4. Logout user after registration to force login
      await signOut(auth);

      return { success: true, message: '¡Registro exitoso! Por favor, inicia sesión para continuar.' };

    } catch (error: any) {
      // If any step after auth user creation fails, try to clean it up.
      if (firebaseUser) {
        await deleteAuthUser(firebaseUser).catch(e => console.error("Failed to cleanup auth user on registration error:", e));
      }
      
      console.error("Public registration error:", error);
      
      // Handle known error codes from Firebase Auth
      if (error.code) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            return { success: false, message: 'El correo electrónico ya está en uso.' };
          case 'auth/weak-password':
            return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
          case 'auth/invalid-email':
            return { success: false, message: 'El correo electrónico no es válido.' };
        }
      }

      // Return the actual error message or a generic one
      return { success: false, message: error.message || 'Ocurrió un error inesperado durante el registro.' };
    }
  };


  const logout = async () => {
    if (!isFirebaseConfigured()) {
        console.error("Logout is not available when Firebase is not configured.");
        return;
    }
    const services = getFirebaseServices();
    if (!services) return;
    try {
      await signOut(services.auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, publicRegister, logout }}>
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
