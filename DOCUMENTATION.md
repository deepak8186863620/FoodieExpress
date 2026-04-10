# FoodieExpress Technical Documentation

This document serves as a comprehensive reference for the architecture, file structure, state management, and all functions utilized across the `FoodieExpress` application.

## 1. Application Architecture Overview
- **Frontend Framework:** React 18 with Vite
- **Routing:** `react-router-dom` (BrowserRouter, Routes, Route, Navigate)
- **Styling:** Tailwind CSS + custom CSS animations + Lucide React icons
- **Backend:** Express.js (runs natively alongside Vite via middleware)
- **Database:** MongoDB Atlas via `mongoose` (schema-less dynamic wrapper)
- **Authentication:** Custom credential login + Firebase Google OAuth (`signInWithPopup`)
- **Payments:** Razorpay API Integration

---

## 2. Backend API (`server.js`)
The backend is an Express Node.js application that handles all frontend requests and database interactions.

### Initialization & Setup
- `startServer()`: Initializes Express. Loads the Vite middleware in dev or static files in production.

### API Routes & Endpoints
* **Restaurants & Foods**
  * `GET /api/restaurants` - Retrieves a list of restaurants. Accepts optional `search` and `cuisine` query filters.
  * `GET /api/restaurants/:id` - Retrieves a specific restaurant and merges its `foods` menu.
  * `GET /api/foods` - Retrieves a list of all foods available across all restaurants.
  * `POST /api/foods` - Creates a new food item (Admin only).
  * `DELETE /api/foods/:id` - Deletes a food item (Admin only).
* **Cart Management**
  * `GET /api/cart` - Retrieves all cart items and maps the respective food details to each item.
  * `POST /api/cart` - Adds a `foodId` to the cart or increments its quantity if it already exists.
  * `PUT /api/cart/:foodId` - Updates the exact quantity of a cart item.
  * `DELETE /api/cart/:foodId` - Removes an item from the cart entirely.
* **Authentication**
  * `POST /api/signup` - Checks if user exists, hashes/stores the user, assigns "Customer" or "Admin" roles.
  * `POST /api/login` - Validates email and password, returning user data.
  * `POST /api/google-login` - Receives Google OAuth profile data, automatically registers or logs in the user without a password.
* **Orders & Checkout**
  * `POST /api/razorpay/create-order` - Creates an order session using the Razorpay Node.js SDK.
  * `POST /api/razorpay/verify-payment` - Uses `crypto` HMAC to verify the payment signature. If valid, converts the cart into a permanent `Order` and clears the cart.
  * `POST /api/checkout` - Handles Cash on Delivery (COD) creating an order and emptying the cart.
  * `GET /api/orders` - Retrieves all historical orders (used in Admin & Dashboard).
  * `GET /api/track/:orderId` - Fetches the live tracking status of a specific order.
* **Feedback**
  * `GET /api/feedbacks` - Fetches global user feedback constraints.
  * `POST /api/feedbacks` - Submits a new customer feedback review.

---

## 3. Database Layer (`database.mongo.js`)
A custom Database ORM built on top of Mongoose to provide a flexible, schema-less API similar to Firebase Firestore.

### Core Methods
- `connectDB()`: Asynchronously connects to MongoDB Atlas using the provided URI. Forces Google DNS internally for stability.
- `getModel(collectionName)`: Dynamically generates a flexible `mongoose.Schema` (`strict: false`) for any string collection dynamically.
- `toPlain(doc)`: Utility function to convert MongoDB `BSON` documents into normal JSON objects while safely transforming `_id` to `id`.

### Abstracted DB Interface API (Used by `server.js`)
- `db.getCollection(collectionName)`: Returns all documents in a collection.
- `db.getDoc(collectionName, id)`: Fetches a single document via ID.
- `db.addDoc(collectionName, data)`: Generates a new `ObjectId` and inserts the data.
- `db.updateDoc(collectionName, id, data)`: Merges new data into an existing document.
- `db.deleteDoc(collectionName, id)`: Deletes a document by ID.
- `db.query(collectionName, field, operator, value)`: Simulates Firestore's query syntax (e.g., `==`, `>`, `<=`) using MongoDB operators (`$eq`, `$gt`, etc.).

---

## 4. Frontend Application (`src/`)

### Entry Protocol
- `main.jsx`: Mounts the React Dom tree inside the `<div id="root">`.
- `firebase.js`: Initializes Firebase `initializeApp`, exports `auth`, `db`, and `app`.

### Core Application State (`App.jsx`)
- `App()`: The primary Router configuration wrapping the application.
  - **States**: `cartCount` (number), `user` (object from localStorage).
  - **Functions**: 
    - `updateCartCount()`: Contacts `/api/cart` and recalculates total items whenever triggered.
    - `handleLogin(userData)`: Authenticates user context and caches to `localStorage`.
    - `handleLogout()`: Discards session state.
    - `handleAddToCart(foodId)`: Posts a new cart request to the server and forces `updateCartCount()` to fire.

---

### Components (`src/components/`)
1. **`Navbar.jsx`**
   - Renders the global top navigation. Manages user dropdown options, displays live `cartCount`, and houses the interactive `handleLogout` flow.
2. **`Footer.jsx`**
   - Simple static presentational UI mapping social media and contact points.
3. **`BackButton.jsx`**
   - Uses `useNavigate()` to safely redirect the user backward in browser history `navigate(-1)` or to a fallback URL.
4. **`FeedbackSession.jsx`**
   - **Functions**:
     - `fetchFeedbacks()`: Retrieves list of reviews from the server.
     - `handleSubmit(e)`: Serializes form state (`rating`, `message`, `name`) to post a new feedback item.
   - **Visuals**: Incorporates Framer Motion sliders and Lucide-React `Star` components for rating input.

---

### Pages (`src/pages/`)

#### 1. `HomePage.jsx`
- **Functions**:
  - `fetchData()`: Loads `restaurants` and `foods` for population.
  - `AddToCartButton()`: Localized component managing an `idle`, `loading`, and `success` animation loop. Function `handleClick(e)` executes `onAddToCart`.
  - `FoodCard({ food })`: UI wrapper showing food, price, and cart button.
  - `RestaurantCard({ restaurant })`: UI wrapper showcasing dynamic search parameters.

#### 2. `RestaurantPage.jsx`
- Similar logic to `HomePage` but restricted specifically to a single restaurant ID using `useParams()`.
- **Functions**: `fetchRestaurantData()` to load single-source database docs.

#### 3. `LoginPage.jsx`
- Handles Identity authentication endpoints.
- **States**: `email`, `password`, `name`, `isLogin` (boolean toggling between sign-up and sign-in).
- **Functions**:
  - `handleSubmit(e)`: Directs the form output to either `/api/login` or `/api/signup`.
  - `handleGoogleLogin()`: Opens `signInWithPopup(auth, GoogleAuthProvider)` and passes credentials back to `/api/google-login` for synchronization.

#### 4. `CartPage.jsx`
- Detailed view of all cart items mapped internally to Food items.
- **Functions**:
  - `fetchCart()`: Loads cart JSON tree.
  - `updateQuantity(foodId, newQuantity)`: Modifies count directly via `PUT /api/cart/:id`.
  - `removeFromCart(foodId)`: Discards line item via `DELETE /api/cart/:id`.

#### 5. `CheckoutPage.jsx`
- Unified payment processing gate utilizing Razorpay.
- **Functions**:
  - `loadRazorpay()`: Dynamically injects Razorpay's script tag into the HTML head.
  - `fetchCart()`: Calculates total order value.
  - `handleSubmit(e)`: Forks action based on `paymentMethod`. If Cash, posts to `/api/checkout`. If Online, requests `/api/razorpay/create-order` and delegates to the `Razorpay` modal instance.
  - `verifyPayment(response, order)`: Callback handler checking Razorpay standard keys before finalizing database insertion through `/api/razorpay/verify-payment`.

#### 6. `TrackingPage.jsx`
- **Functions**:
  - `fetchOrder()`: Retrieves live timeline.
  - Automatically loops a `setInterval` function every 5 seconds to re-ping the server for updated tracking status. Progress bars calculate dynamic visual widths based on timestamps.

#### 7. `DashboardPage.jsx`
- Displays user order history parsed using `.filter` and `.sort` logic.
- **Functions**: 
  - `fetchOrders()` retrieves `orders`. Modifies data inline via sorting helper functions.

#### 8. `AdminPage.jsx`
- Authorized restricted route for uploading core database content.
- **Functions**:
  - `fetchData()`: Loads DB assets.
  - `handleAddFood(e)`: Maps complex `newFood` input dictionary directly into `/api/foods`.
  - `handleDeleteFood(id)`: Invokes browser `window.confirm` prior to sending a destructive `DELETE` web request.
