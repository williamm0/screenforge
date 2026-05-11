import { AppSettings } from '../components/ControlPanel';
import { DeviceId } from '../config/devices';

export type SavedMockup = {
  id: string;
  title: string;
  createdAt: string;
  deviceId: DeviceId;
  settings: AppSettings;
  imageDataUrl: string;
};

export type SavedMockupMetadata = Omit<SavedMockup, 'imageDataUrl'> & {
  thumbnailUrl: string;
};

const DB_NAME = 'screenforge-library';
const STORE_NAME = 'mockups';
const DB_VERSION = 1;

export const createSavedMockup = (
  input: Pick<SavedMockup, 'deviceId' | 'settings' | 'imageDataUrl'>,
  now = new Date(),
): SavedMockup => {
  const timestamp = now.toISOString();

  return {
    ...input,
    id: `mockup-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    title: `Screenforge ${now.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    createdAt: timestamp,
  };
};

const openDatabase = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

const withStore = async <T>(mode: IDBTransactionMode, callback: (store: IDBObjectStore) => IDBRequest<T>) => {
  const db = await openDatabase();

  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const request = callback(transaction.objectStore(STORE_NAME));

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

export const saveMockup = (mockup: SavedMockup) => withStore('readwrite', (store) => store.put(mockup));

export const getSavedMockups = async (): Promise<SavedMockup[]> => {
  const records = await withStore<SavedMockup[]>('readonly', (store) => store.getAll());
  return records.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
};

export const deleteSavedMockup = (id: string) => withStore('readwrite', (store) => store.delete(id));

export const clearSavedMockups = async () => withStore('readwrite', (store) => store.clear());
