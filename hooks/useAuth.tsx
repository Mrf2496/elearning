import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (cedula: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, cedula: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'sarlaft_users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Check session storage for a logged-in user on initial load
    const loggedInCedula = sessionStorage.getItem('loggedInUser');
    if (loggedInCedula) {
      const users = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]') as User[];
      const user = users.find(u => u.cedula === loggedInCedula);
      if (user) {
        setCurrentUser(user);
      }
    }
  }, []);

  const getUsers = (): User[] => {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '[]') as User[];
  };

  const saveUsers = (users: User[]) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  };

  const login = async (cedula: string, password: string): Promise<{ success: boolean; message: string }> => {
    const users = getUsers();
    const user = users.find(u => u.cedula === cedula);

    if (!user) {
      return { success: false, message: 'Usuario no encontrado.' };
    }

    if (user.password !== password) { // Plain text comparison
      return { success: false, message: 'Contraseña incorrecta.' };
    }

    setCurrentUser(user);
    sessionStorage.setItem('loggedInUser', user.cedula);
    return { success: true, message: 'Inicio de sesión exitoso.' };
  };

  const register = async (name: string, cedula: string, password: string): Promise<{ success: boolean; message: string }> => {
    const users = getUsers();
    
    if (users.some(u => u.cedula === cedula)) {
      return { success: false, message: 'La cédula ya está registrada.' };
    }

    const newUser: User = { name, cedula, password };
    users.push(newUser);
    saveUsers(users);

    return { success: true, message: 'Registro exitoso. Ahora puedes iniciar sesión.' };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('loggedInUser');
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, register, logout }}>
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
