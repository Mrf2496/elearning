import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseServices } from '../firebase/config';

export const uploadLogo = async (file: File, companyId: string): Promise<string> => {
    const services = getFirebaseServices();
    if (!services) throw new Error("Firebase services not available.");
    
    // Create a storage reference
    const storageRef = ref(services.storage, `company-logos/${companyId}/${file.name}`);

    // 'file' comes from the Blob or File API
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
};
