const DB_NAME = 'SarlaftCourseDB';
const AUDIO_URL_STORE_NAME = 'userAudioUrls';
const VIDEO_URL_STORE_NAME = 'userVideoUrls';
const DB_VERSION = 3; // Increased from 2 to 3

let db: IDBDatabase;

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      return resolve(db);
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Error opening DB');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      const oldAudioStoreName = 'userAudios';
      const oldVideoStoreName = 'userVideos';

      if (dbInstance.objectStoreNames.contains(oldAudioStoreName)) {
        dbInstance.deleteObjectStore(oldAudioStoreName);
      }
      if (dbInstance.objectStoreNames.contains(oldVideoStoreName)) {
        dbInstance.deleteObjectStore(oldVideoStoreName);
      }

      if (!dbInstance.objectStoreNames.contains(AUDIO_URL_STORE_NAME)) {
        dbInstance.createObjectStore(AUDIO_URL_STORE_NAME, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(VIDEO_URL_STORE_NAME)) {
        dbInstance.createObjectStore(VIDEO_URL_STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveAudioUrl = async (id: string, url: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(AUDIO_URL_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(AUDIO_URL_STORE_NAME);
        if (url) {
            store.put({ id, url });
        } else {
            store.delete(id);
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getAudioUrl = async (id: string): Promise<string | null> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(AUDIO_URL_STORE_NAME, 'readonly');
        const store = transaction.objectStore(AUDIO_URL_STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.url as string);
            } else {
                resolve(null);
            }
        };
        request.onerror = () => reject(request.error);
    });
};

export const saveVideoUrl = async (id: string, url: string): Promise<void> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(VIDEO_URL_STORE_NAME, 'readwrite');
        const store = transaction.objectStore(VIDEO_URL_STORE_NAME);
        if (url) {
            store.put({ id, url });
        } else {
            store.delete(id);
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

export const getVideoUrl = async (id: string): Promise<string | null> => {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(VIDEO_URL_STORE_NAME, 'readonly');
        const store = transaction.objectStore(VIDEO_URL_STORE_NAME);
        const request = store.get(id);

        request.onsuccess = () => {
            if (request.result) {
                resolve(request.result.url as string);
            } else {
                resolve(null);
            }
        };
        request.onerror = () => reject(request.error);
    });
};
