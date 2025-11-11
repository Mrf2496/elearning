import { Company, User } from '../types';
import { getFirebaseServices } from '../firebase/config';
import { collection, getDocs, getDoc, doc, addDoc, updateDoc, serverTimestamp, query, where } from 'firebase/firestore';

export const getCompaniesList = async (): Promise<Company[]> => {
    const services = getFirebaseServices();
    if (!services) return [];
    
    try {
        const companiesCollection = collection(services.db, 'empresas');
        const companySnapshot = await getDocs(companiesCollection);
        const companyList = companySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
        return companyList;
    } catch (error) {
        console.error("Error getting companies list from Firestore", error);
        return [];
    }
};

export const getActiveCompaniesList = async (): Promise<Company[]> => {
    const services = getFirebaseServices();
    if (!services) return [];
    
    try {
        const companiesCollection = collection(services.db, 'empresas');
        const q = query(companiesCollection, where("activa", "==", true));
        const companySnapshot = await getDocs(q);
        const companyList = companySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Company));
        return companyList;
    } catch (error) {
        console.error("Error getting active companies list from Firestore", error);
        return [];
    }
};

export const getCompanyById = async (id: string): Promise<Company | null> => {
    const services = getFirebaseServices();
    if (!services || !id) return null;

    try {
        const companyDocRef = doc(services.db, 'empresas', id);
        const companyDoc = await getDoc(companyDocRef);
        if (companyDoc.exists()) {
            return { id: companyDoc.id, ...companyDoc.data() } as Company;
        }
        return null;
    } catch (error) {
        console.error("Error getting company by ID from Firestore", error);
        return null;
    }
};

export const createCompany = async (data: Partial<Omit<Company, 'id' | 'fechaCreacion' | 'activa' | 'administradorId'>>): Promise<string | null> => {
    const services = getFirebaseServices();
    if (!services) return null;
    
    try {
        const docRef = await addDoc(collection(services.db, 'empresas'), {
            ...data,
            activa: true,
            fechaCreacion: serverTimestamp(),
            administradorId: ''
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating company in Firestore", error);
        return null;
    }
};


export const editCompany = async (id: string, data: Partial<Omit<Company, 'id' | 'fechaCreacion'>>): Promise<boolean> => {
    const services = getFirebaseServices();
    if (!services) return false;

    try {
        const companyDoc = doc(services.db, 'empresas', id);
        await updateDoc(companyDoc, data);
        return true;
    } catch (error) {
        console.error("Error editing company in Firestore", error);
        return false;
    }
};

export const toggleCompanyStatus = async (id: string, currentStatus: boolean): Promise<boolean> => {
    const services = getFirebaseServices();
    if (!services) return false;

    try {
        const companyDoc = doc(services.db, 'empresas', id);
        await updateDoc(companyDoc, { activa: !currentStatus });
        return true;
    } catch (error) {
        console.error("Error toggling company status in Firestore", error);
        return false;
    }
};

export const checkCompanyHasAdmin = async (empresaId: string): Promise<boolean> => {
    const services = getFirebaseServices();
    if (!services) return false; // Default to false if services aren't available
    try {
        const companyDocRef = doc(services.db, 'empresas', empresaId);
        const companyDoc = await getDoc(companyDocRef);
        if (companyDoc.exists()) {
            const companyData = companyDoc.data();
            return !!companyData.administradorId;
        }
    } catch (error) {
        console.error("Error checking company admin:", error);
    }
    return false;
};

export const getAdminForCompany = async (administradorId: string): Promise<User | null> => {
    if (!administradorId) return null;
    const services = getFirebaseServices();
    if (!services) return null;

    try {
        const adminDocRef = doc(services.db, 'users', administradorId);
        const adminDoc = await getDoc(adminDocRef);
        if (adminDoc.exists()) {
            return { uid: adminDoc.id, ...adminDoc.data() } as User;
        }
        return null;
    } catch (error) {
        console.error("Error fetching admin for company:", error);
        return null;
    }
}

export const countUsersInCompany = async (companyId: string): Promise<number> => {
    const services = getFirebaseServices();
    if (!services) return 0;
    try {
        const usersRef = collection(services.db, 'users');
        const q = query(usersRef, where("empresaId", "==", companyId));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size;
    } catch (error) {
        console.error("Error counting users in company:", error);
        return 0;
    }
};