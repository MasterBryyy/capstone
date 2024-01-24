// firestore.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; // Make sure to import getStorage
import firebaseConfig from './firebaseConfig';

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

console.log('Firestore instance:', db);

export { db, auth, storage };
