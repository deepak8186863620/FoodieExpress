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
const db = getFirestore("ai-studio-b5bdbaab-397b-4840-aee8-ce3b711d9e85");

async function seed() {
  console.log("🚀 Starting Firebase Migration...");
  
  try {
    const data = JSON.parse(readFileSync(path.join(__dirname, "data.json"), "utf8"));
    
    // 1. Restaurants
    console.log("📦 Migrating Restaurants...");
    for (const restaurant of data.restaurants) {
      const { id, ...rest } = restaurant;
      await db.collection("restaurants").doc(id).set(rest);
    }

    // 2. Foods
    console.log("📦 Migrating Foods...");
    for (const food of data.foods) {
      const { id, ...rest } = food;
      await db.collection("foods").doc(id).set(rest);
    }

    // 3. Users
    console.log("📦 Migrating Users...");
    for (const user of data.users) {
      const { id, ...rest } = user;
      await db.collection("users").doc(id).set(rest);
    }

    // 4. Feedbacks
    if (data.feedbacks) {
      console.log("📦 Migrating Feedbacks...");
      for (const fb of data.feedbacks) {
        const { id, ...rest } = fb;
        await db.collection("feedbacks").doc(id).set(rest);
      }
    }

    // 5. Orders
    console.log("📦 Migrating Orders...");
    for (const order of data.orders) {
      const { id, ...rest } = order;
      await db.collection("orders").doc(id).set(rest);
    }

    console.log("✅ Migration Successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration Failed:", error);
    process.exit(1);
  }
}

seed();
