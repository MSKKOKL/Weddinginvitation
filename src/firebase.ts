import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDoc, doc, setDoc, getDocs, query, where, orderBy, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase configuration from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyDcd3KeC7gBqK5W0DfjD3iKPy4nQN-h3Q4",
  authDomain: "vaulted-trainer-2q7jp.firebaseapp.com",
  projectId: "vaulted-trainer-2q7jp",
  storageBucket: "vaulted-trainer-2q7jp.firebasestorage.app",
  messagingSenderId: "402747382562",
  appId: "1:402747382562:web:83a9cab30756585e67237b",
  databaseURL: "https://ai-studio-weddinginvitatio-7d0b6ccd-7f81-446f-bfc3-5f88e32608f8.firebaseio.com" // Firestore DB ID used
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-weddinginvitatio-7d0b6ccd-7f81-446f-bfc3-5f88e32608f8");
export const auth = getAuth(app);
export const storage = getStorage(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  onSnapshot
};
