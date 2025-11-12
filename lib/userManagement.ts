import { User } from '../types';
import { getFirebaseServices } from '../firebase/config';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';

export const getUsersList = async (): Promise<User[]> => {
    const services = getFirebaseServices();
    if (!services) return [];
    
    try {
        const usersCollection = collection(services.db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
        return userList;
    } catch (error) {
        console.error("Error getting users list from Firestore", error);
        return [];
    }
};

export const getUsersByCompany = async (empresaId: string): Promise<User[]> => {
    const services = getFirebaseServices();
    if (!services || !empresaId) return [];
    
    try {
        const usersRef = collection(services.db, 'users');
        const q = query(usersRef, where("empresaId", "==", empresaId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as User));
    } catch (error) {
        console.error("Error getting users by company from Firestore", error);
        return [];
    }
};

export const editUser = async (uid: string, data: Partial<Pick<User, 'name' | 'empresaId'>>): Promise<boolean> => {
    const services = getFirebaseServices();
    if (!services) return false;

    try {
        const userDoc = doc(services.db, 'users', uid);
        await updateDoc(userDoc, data);
        return true;
    } catch (error) {
        console.error("Error editing user in Firestore", error);
        return false;
    }
};

export const toggleUserStatus = async (uid: string, currentStatus: boolean): Promise<boolean> => {
    const services = getFirebaseServices();
    if (!services) return false;

    try {
        const userDoc = doc(services.db, 'users', uid);
        await updateDoc(userDoc, { isActive: !currentStatus });
        return true;
    } catch (error) {
        console.error("Error toggling user status in Firestore", error);
        return false;
    }
};

export const resetUserPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    const services = getFirebaseServices();
    if (!services) return { success: false, message: 'La función de reseteo de contraseña no está disponible en modo demostración.' };

    try {
        await sendPasswordResetEmail(services.auth, email);
        return { success: true, message: `Se ha enviado un correo para restablecer la contraseña a la dirección ${email}.` };
    } catch (error: any) {
        console.error("Error sending password reset email", error);
        if (error.code === 'auth/user-not-found') {
            return { success: false, message: 'No se encontró ningún usuario con ese correo electrónico.' };
        }
        return { success: false, message: 'Ocurrió un error al intentar restablecer la contraseña.' };
    }
};

export const deleteUser = async (uid: string): Promise<boolean> => {
    const services = getFirebaseServices();
    if (!services) return false;

    try {
        const userDocRef = doc(services.db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            // If the user was an admin, clear the adminId from their company
            if (userData.empresaId) {
                const companyDocRef = doc(services.db, 'empresas', userData.empresaId);
                const companyDoc = await getDoc(companyDocRef);
                if (companyDoc.exists() && companyDoc.data().administradorId === uid) {
                   await updateDoc(companyDocRef, { administradorId: "" });
                }
            }
        }

        await deleteDoc(userDocRef);
        await restoreUserData(uid);
        return true;
    } catch (error) {
        console.error("Error deleting user from Firestore", error);
        return false;
    }
};

export const restoreUserData = async (uid: string): Promise<boolean> => {
    const services = getFirebaseServices();
    if (!services) return false;

    try {
        await deleteDoc(doc(services.db, 'userProgress', uid));
        return true;
    } catch (error) {
        console.error("Error restoring user data from Firestore", error);
        return false;
    }
};