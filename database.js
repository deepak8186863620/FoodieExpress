import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
const serviceAccount = JSON.parse(
  readFileSync(path.join(__dirname, "serviceAccountKey.json"), "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

// Support for named database in Firebase Admin v11+
const firestore = getFirestore("ai-studio-b5bdbaab-397b-4840-aee8-ce3b711d9e85");

/**
 * Firestore Database Utility
 * This utility replaces local JSON storage with Firebase Firestore.
 */
const db = {
  /**
   * Get all documents from a collection.
   * @param {string} collectionName 
   * @returns {Promise<Array>}
   */
  getCollection: async (collectionName) => {
    try {
      const snapshot = await firestore.collection(collectionName).get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error(`Error getting collection ${collectionName}:`, error);
      return [];
    }
  },

  /**
   * Get a single document by ID.
   * @param {string} collectionName 
   * @param {string} id 
   */
  getDoc: async (collectionName, id) => {
    const doc = await firestore.collection(collectionName).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  /**
   * Add a new document (auto-generated ID).
   */
  addDoc: async (collectionName, data) => {
    const res = await firestore.collection(collectionName).add(data);
    return { id: res.id, ...data };
  },

  /**
   * Set a document with a specific ID (or update).
   */
  updateDoc: async (collectionName, id, data) => {
    await firestore.collection(collectionName).doc(id).set(data, { merge: true });
  },

  /**
   * Delete a document.
   */
  deleteDoc: async (collectionName, id) => {
    await firestore.collection(collectionName).doc(id).delete();
  },

  /**
   * Query a collection.
   */
  query: async (collectionName, field, operator, value) => {
    const snapshot = await firestore.collection(collectionName).where(field, operator, value).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
};

export default db;
export { firestore };
