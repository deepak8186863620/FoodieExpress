import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import Razorpay from "razorpay";
import bcrypt from "bcryptjs";
import db from "./database.mongo.js"; // ← MongoDB Atlas

// --- RAZORPAY SETUP ---
import dotenv from "dotenv";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON data from requests
  app.use(express.json());

  // --- API ROUTES ---

  /**
   * GET /api/restaurants
   * Purpose: Fetch all restaurants with optional search and category filters.
   */
  app.get("/api/restaurants", async (req, res) => {
    const { search, cuisine } = req.query;
    let restaurants = await db.getCollection("restaurants");

    if (search) {
      const query = search.toLowerCase();
      restaurants = restaurants.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.cuisine?.toLowerCase().includes(query)
      );
    }

    if (cuisine && cuisine !== "All") {
      restaurants = restaurants.filter(r => r.cuisine?.includes(cuisine));
    }

    res.json(restaurants);
  });

  /**
   * GET /api/restaurants/:id
   * Purpose: Fetch a specific restaurant and its menu.
   */
  app.get("/api/restaurants/:id", async (req, res) => {
    const restaurant = await db.getDoc("restaurants", req.params.id);
    if (restaurant) {
      const foods = await db.query("foods", "restaurantId", "==", req.params.id);
      res.json({ ...restaurant, menu: foods });
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  });

  /**
   * GET /api/foods
   * Purpose: Fetch all food items.
   */
  app.get("/api/foods", async (req, res) => {
    const foods = await db.getCollection("foods");
    res.json(foods);
  });

  /**
   * GET /api/cart
   * Purpose: Fetch cart items with full food details.
   */
  app.get("/api/cart", async (req, res) => {
    const cart = await db.getCollection("carts");
    const foods = await db.getCollection("foods");
    
    const cartWithDetails = cart.map((item) => {
      const food = foods.find((f) => f.id === item.foodId);
      return { ...item, food };
    });
    res.json(cartWithDetails);
  });

  /**
   * POST /api/cart
   * Purpose: Add a food item to the cart or increment its quantity.
   */
  app.post("/api/cart", async (req, res) => {
    const { foodId, quantity } = req.body;
    let cart = await db.getCollection("carts");
    
    const existingItem = cart.find((item) => item.foodId === foodId);
    if (existingItem) {
      await db.updateDoc("carts", existingItem.id, { quantity: existingItem.quantity + quantity });
    } else {
      await db.addDoc("carts", { foodId, quantity });
    }
    
    res.status(201).json({ success: true, message: "Item added to cart" });
  });

  /**
   * PUT /api/cart/:foodId
   * Purpose: Update the quantity of an item in the cart.
   */
  app.put("/api/cart/:foodId", async (req, res) => {
    const { foodId } = req.params;
    const { quantity } = req.body;
    const cartItems = await db.query("carts", "foodId", "==", foodId);
    
    if (cartItems.length > 0) {
      await db.updateDoc("carts", cartItems[0].id, { quantity: Math.max(1, quantity) });
      res.json({ success: true, message: "Quantity updated" });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  });

  /**
   * DELETE /api/cart/:foodId
   * Purpose: Remove an item from the cart.
   */
  app.delete("/api/cart/:foodId", async (req, res) => {
    const { foodId } = req.params;
    const cartItems = await db.query("carts", "foodId", "==", foodId);
    
    if (cartItems.length > 0) {
      await db.deleteDoc("carts", cartItems[0].id);
      res.json({ success: true, message: "Item removed from cart" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  });

  /**
   * POST /api/razorpay/create-order
   * Purpose: Create a Razorpay order.
   */
  app.post("/api/razorpay/create-order", async (req, res) => {
    const { amount } = req.body;
    try {
      const order = await razorpay.orders.create({
        amount: Math.round(amount * 100), // paise
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      });
      res.json({ success: true, order });
    } catch (err) {
      console.error("Razorpay order creation failed:", err);
      res.status(500).json({ success: false, message: "Could not create payment order" });
    }
  });

  /**
   * POST /api/razorpay/verify-payment
   * Purpose: Verify payment and save order.
   */
  app.post("/api/razorpay/verify-payment", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderData } = req.body;
    
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed." });
    }

    const newOrder = {
      orderNumber: "ORD" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString(),
      total: orderData.total,
      status: "Order Placed",
      paymentId: razorpay_payment_id,
      address: orderData.address,
      items: (orderData.items || []).map(item => item.food?.name || "Item"),
      tracking: [
        { step: "Order Placed", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { step: "Preparing", time: "Pending", completed: false },
        { step: "Out for Delivery", time: "Pending", completed: false },
        { step: "Delivered", time: "Pending", completed: false }
      ]
    };
    
    const savedOrder = await db.addDoc("orders", newOrder);
    
    // Clear cart (delete all docs in carts)
    const cartSnapshot = await db.getCollection("carts");
    for (const item of cartSnapshot) {
      await db.deleteDoc("carts", item.id);
    }
    
    res.json({ success: true, orderId: savedOrder.id });
  });

  /**
   * POST /api/checkout (COD)
   */
  app.post("/api/checkout", async (req, res) => {
    const { total, items } = req.body;
    
    const newOrder = {
      orderNumber: "ORD" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString(),
      total: total,
      status: "Order Placed",
      items: (items || []).map(item => item.food?.name || "Item"),
      tracking: [
        { step: "Order Placed", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true },
        { step: "Preparing", time: "Pending", completed: false },
        { step: "Out for Delivery", time: "Pending", completed: false },
        { step: "Delivered", time: "Pending", completed: false }
      ]
    };

    const savedOrder = await db.addDoc("orders", newOrder);
    
    const cartSnapshot = await db.getCollection("carts");
    for (const item of cartSnapshot) {
      await db.deleteDoc("carts", item.id);
    }

    res.json({ success: true, orderId: savedOrder.id });
  });

  /**
   * GET /api/track/:orderId
   */
  app.get("/api/track/:orderId", async (req, res) => {
    const order = await db.getDoc("orders", req.params.orderId);
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  });

  /**
   * POST /api/foods
   */
  app.post("/api/foods", async (req, res) => {
    const { restaurantId, name, price, image, category } = req.body;
    const newFood = {
      restaurantId,
      name,
      price: Number(price),
      image,
      category
    };

    const savedFood = await db.addDoc("foods", newFood);
    res.status(201).json({ success: true, food: savedFood });
  });

  /**
   * DELETE /api/foods/:id
   */
  app.delete("/api/foods/:id", async (req, res) => {
    await db.deleteDoc("foods", req.params.id);
    res.json({ success: true, message: "Food item removed" });
  });

  /**
   * POST /api/signup
   */
  app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;
    const existingUsers = await db.query("users", "email", "==", email);
    
    if (existingUsers.length > 0) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const role = email.includes("admin") ? "Admin" : "Customer";
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    };

    const savedUser = await db.addDoc("users", newUser);
    res.status(201).json({ success: true, user: savedUser });
  });

  /**
   * POST /api/google-login
   * Purpose: Create or fetch a user who signs in via Google OAuth.
   */
  app.post("/api/google-login", async (req, res) => {
    const { name, email, avatar } = req.body;
    if (!email) return res.status(400).json({ success: false, message: "Email is required." });

    try {
      const existingUsers = await db.query("users", "email", "==", email);

      if (existingUsers.length > 0) {
        // User already exists — return them
        return res.json({ success: true, user: existingUsers[0] });
      }

      // New Google user — auto-create account
      const newUser = {
        name: name || "Google User",
        email,
        avatar: avatar || "",
        password: null, // Google users don't have a password
        role: email.includes("admin") ? "Admin" : "Customer",
        joinDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        provider: "google",
      };

      const savedUser = await db.addDoc("users", newUser);
      res.status(201).json({ success: true, user: savedUser });
    } catch (err) {
      console.error("Google login error:", err);
      res.status(500).json({ success: false, message: "Server error during Google login." });
    }
  });

  /**
   * POST /api/login
   */
  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const users = await db.query("users", "email", "==", email);
    const user = users.find(u => u.password && bcrypt.compareSync(password, u.password));

    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password." });
    }
  });

  /**
   * GET /api/orders
   */
  app.get("/api/orders", async (req, res) => {
    const orders = await db.getCollection("orders");
    res.json(orders);
  });

  /**
   * GET /api/feedbacks
   */
  app.get("/api/feedbacks", async (req, res) => {
    const feedbacks = await db.getCollection("feedbacks");
    res.json(feedbacks);
  });

  /**
   * POST /api/feedbacks
   */
  app.post("/api/feedbacks", async (req, res) => {
    const { name, rating, message } = req.body;
    const newFeedback = {
      name,
      rating: Number(rating),
      message,
      date: new Date().toISOString().split('T')[0]
    };

    const saved = await db.addDoc("feedbacks", newFeedback);
    res.status(201).json({ success: true, feedback: saved });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
