import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import db from "./database.mongo.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  console.log("🚀 Starting MongoDB Migration from data.json...");
  
  try {
    const uri = process.env.MONGODB_URI;
    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,
      tls: true,
      tlsAllowInvalidCertificates: true,
      tlsAllowInvalidHostnames: true,
    });
    console.log("✅ Connected to MongoDB!");

    const data = JSON.parse(readFileSync(path.join(__dirname, "data.json"), "utf8"));
    
    // Abstract the process
    async function migrateCollection(name, items) {
      if (!items || items.length === 0) return;
      console.log(`📦 Migrating ${name}...`);
      for (const item of items) {
        const { id, ...rest } = item;
        // Use updateDoc which acts as an upsert, or addDoc but specifying the ID is better if we want to retain it.
        // It's safer to just let the adapter do logic, but updateDoc requires the _id.
        // Let's adapt our adapter logic for seeding since the IDs in data.json are strings:
        const schema = new mongoose.Schema({ _id: String }, { strict: false });
        const Model = mongoose.models[name] || mongoose.model(name, schema);
        await Model.findOneAndUpdate(
          { _id: id || new mongoose.Types.ObjectId().toString() },
          { $set: rest },
          { upsert: true }
        );
      }
    }

    await migrateCollection("restaurants", data.restaurants);
    await migrateCollection("foods", data.foods);
    await migrateCollection("users", data.users);
    await migrateCollection("feedbacks", data.feedbacks);
    await migrateCollection("orders", data.orders);

    console.log("✅ Migration Successful!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration Failed:", error);
    process.exit(1);
  }
}

seed();
