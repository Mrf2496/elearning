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
} from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, cedula: string, email: string, password: string, role?: User['role'], empresaId?: string) => Promise<{ success: boolean; message: string }>;
  publicRegister?: (name: string, cedula: string, email: string, password: string, role: User['role']) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const demoUser: User = {
  uid: 'demo-user',
  name: 'Usuario Demo',
  email: 'demo@sarlaft.app',
  cedula: '123456789',
  role: 'USUARIO',
  isActive: true,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isFirebaseConfigured()) {
      const services = getFirebaseServices();
      if (!services) {
          console.error("Firebase services failed to initialize despite configuration being present.");
          setCurrentUser(demoUser); // Fallback to demo
          setLoading(false);
          return;
      }
      const { auth, db } = services;

      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
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
      // Firebase not configured, run in demo mode
      console.warn("Firebase no está configurado. Ejecutando en modo de demostración.");
      setCurrentUser(demoUser);
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured()) {
        return { success: false, message: 'La base de datos no está configurada. No se puede iniciar sesión.' };
    }
    const services = getFirebaseServices();
    if (!services) return { success: false, message: 'Error al inicializar los servicios de Firebase.' };
    const { auth, db } = services;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
          await signOut(auth);
          return { success: false, message: 'No se encontraron los datos del usuario.' };
      }
      
      const userData = userDocSnap.data() as User;
      
      if (!userData.isActive) {
        await signOut(auth);
        return { success: false, message: 'Esta cuenta ha sido desactivada. Contacte al administrador.' };
      }

      return { success: true, message: 'Inicio de sesión exitoso.' };
    } catch (error: any) {
       console.error("Login error:", error);
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential' || error.code === 'auth/invalid-email') {
        return { success: false, message: 'Correo electrónico o contraseña incorrecta.' };
      }
      return { success: false, message: 'Ocurrió un error al iniciar sesión.' };
    }
  };

  // For admin user creation
  const register = async (name: string, cedula: string, email: string, password: string, role?: User['role'], empresaId?: string): Promise<{ success: boolean; message: string }> => {
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
        
        const allUsersSnapshot = await getDocs(collection(db, 'users'));
        const isFirstUser = allUsersSnapshot.empty;
        
        const finalRole = role || (isFirstUser ? 'SUPERADMINISTRADOR' : 'USUARIO');

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        const newUser: Omit<User, 'uid' | 'password'> = {
            name,
            cedula,
            email,
            role: finalRole,
            isActive: true,
            empresaId: empresaId || '',
        };

        await setDoc(doc(db, "users", firebaseUser.uid), newUser);
        
        if (finalRole === 'ADMINISTRADOR' && empresaId) {
            const companyDocRef = doc(db, 'empresas', empresaId);
            await updateDoc(companyDocRef, { administradorId: firebaseUser.uid });
        }
        
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
  const publicRegister = async (name: string, cedula: string, email: string, password: string, role: User['role']): Promise<{ success: boolean; message: string }> => {
    if (!isFirebaseConfigured()) {
      return { success: false, message: 'El registro no está disponible.' };
    }
    const services = getFirebaseServices();
    if (!services) return { success: false, message: 'Error al inicializar los servicios de Firebase.' };
    const { auth, db } = services;

    let firebaseUser: FirebaseUser | null = null;
    try {
      // 1. Create Auth user to get permissions for subsequent checks
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      firebaseUser = userCredential.user;

      const usersRef = collection(db, 'users');
      
      // 2. Validate Cédula uniqueness
      const cedulaQuery = query(usersRef, where("cedula", "==", cedula));
      const cedulaSnapshot = await getDocs(cedulaQuery);
      if (!cedulaSnapshot.empty) {
        await deleteAuthUser(firebaseUser);
        return { success: false, message: 'La cédula ya está registrada en el sistema.' };
      }
      
      // 3. Handle role based on whether it's the first user
      const allUsersSnapshot = await getDocs(usersRef);
      const isFirstUser = allUsersSnapshot.empty;

      let finalRole: User['role'];
      if (isFirstUser) {
        if (role !== 'ADMINISTRADOR') {
          await deleteAuthUser(firebaseUser);
          return { success: false, message: 'El primer usuario del sistema debe registrarse con el rol de Administrador.' };
        }
        finalRole = 'SUPERADMINISTRADOR';
      } else {
        if (role === 'ADMINISTRADOR' || role === 'SUPERADMINISTRADOR') {
          await deleteAuthUser(firebaseUser);
          return { success: false, message: 'No puede registrarse como Administrador. Póngase en contacto con el administrador del sistema.' };
        }
        finalRole = 'USUARIO';
      }
      
      // 4. Create Firestore user document
      const newUser: Omit<User, 'uid' | 'password'> = {
        name,
        cedula,
        email,
        role: finalRole,
        isActive: true,
        empresaId: '', // Users created publicly are not assigned to a company initially
      };
      await setDoc(doc(db, "users", firebaseUser.uid), newUser);

      // 5. Logout user after registration to force login
      await signOut(auth);

      return { success: true, message: '¡Registro exitoso! Por favor, inicia sesión para continuar.' };

    } catch (error: any) {
      // If any step fails, try to clean up the created Auth user
      if (firebaseUser) {
        await deleteAuthUser(firebaseUser).catch(e => console.error("Failed to cleanup auth user on registration error:", e));
      }
      console.error("Public registration error:", error);
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, message: 'El correo electrónico ya está en uso.' };
      }
      if (error.code === 'auth/weak-password') {
        return { success: false, message: 'La contraseña debe tener al menos 6 caracteres.' };
      }
      return { success: false, message: 'Ocurrió un error inesperado durante el registro.' };
    }
  };

  const logout = async () => {
    if (!isFirebaseConfigured()) {
        alert("El cierre de sesión no está disponible en el modo de demostración. Por favor, configure Firebase para habilitar la autenticación de usuarios.");
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
