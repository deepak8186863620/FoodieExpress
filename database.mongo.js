import mongoose from "mongoose";
import dns from "dns";
import dotenv from "dotenv";
dotenv.config();

dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);

let isConnected = false;

async function connectDB() {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      family: 4,           
      tls: true,
      tlsAllowInvalidCertificates: true,   
      tlsAllowInvalidHostnames: true,
    });
    isConnected = true;
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err;
  }
}

const modelCache = {};

function getModel(collectionName) {
  if (modelCache[collectionName]) return modelCache[collectionName];

  const schema = new mongoose.Schema(
    { _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() } },
    { strict: false, timestamps: true }
  );

  const model = mongoose.models[collectionName] ||
    mongoose.model(collectionName, schema, collectionName);
  modelCache[collectionName] = model;
  return model;
}

function toPlain(doc) {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  obj.id = obj._id?.toString() || obj.id;
  delete obj.__v;
  return obj;
}

const db = {
  getCollection: async (collectionName) => {
    await connectDB();
    const Model = getModel(collectionName);
    const docs = await Model.find({}).lean();
    return docs.map((d) => ({ ...d, id: d._id?.toString() || d.id }));
  },

  getDoc: async (collectionName, id) => {
    await connectDB();
    const Model = getModel(collectionName);
    const doc = await Model.findOne({ _id: id }).lean();
    if (!doc) return null;
    return { ...doc, id: doc._id?.toString() || doc.id };
  },

  addDoc: async (collectionName, data) => {
    await connectDB();
    const Model = getModel(collectionName);
    const newId = new mongoose.Types.ObjectId().toString();
    const doc = new Model({ _id: newId, ...data });
    await doc.save();
    return { ...data, id: newId };
  },

  updateDoc: async (collectionName, id, data) => {
    await connectDB();
    const Model = getModel(collectionName);
    await Model.findOneAndUpdate({ _id: id }, { $set: data }, { upsert: true });
  },

  deleteDoc: async (collectionName, id) => {
    await connectDB();
    const Model = getModel(collectionName);
    await Model.findOneAndDelete({ _id: id });
  },

  query: async (collectionName, field, operator, value) => {
    await connectDB();
    const Model = getModel(collectionName);
    const operatorMap = {
      "==": "$eq",
      "!=": "$ne",
      ">":  "$gt",
      ">=": "$gte",
      "<":  "$lt",
      "<=": "$lte",
    };
    const mongoOp = operatorMap[operator] || "$eq";
    const docs = await Model.find({ [field]: { [mongoOp]: value } }).lean();
    return docs.map((d) => ({ ...d, id: d._id?.toString() || d.id }));
  },
};

export default db;
