// LoginPage.jsx
import { useState } from "react"; // Hook for managing local state specific to this form validation
import { useNavigate } from "react-router-dom"; // Hook to trigger redirects post login
import axios from "axios"; // HTTP client used to interact with backend authentication layer
import { motion } from "motion/react"; // Framer motion for seamless transition animations rendering the form
import { auth } from "../firebase"; // The Firebase Auth initialized instance
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Specific Firebase methods for OAuth popups

function LoginPage({ onLogin }) {
  // State boolean toggling between 'Login' and 'Sign Up' view variations 
  const [isLogin, setIsLogin] = useState(true);
  
  // Data State variables bound directly to form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI messaging states
  const [error, setError] = useState(""); // Captures and displays error text
  const [msg, setMsg] = useState(""); // Captures and displays success texts
  const [googleLoading, setGoogleLoading] = useState(false); // Controls loading spin on Google button
  
  // Method mapping to the React Router to push navigation entries
  const navigate = useNavigate();

  // Submission handler triggered by <form onSubmit>
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents the browser's default form submission reloading the tab
    setError(""); // Clears any pre-existing errors from previous submits
    setMsg(""); // Clears any existing success messages
    
    try {
      if (isLogin) {
        // If user is trying to log in, send email and password to the login endpoint
        const response = await axios.post("/api/login", { email, password });
        if (response.data.success) {
          onLogin(response.data.user); // Triggers the parent components login handler to set global user context
          navigate("/"); // Force redirect to Homepage upon success
        }
      } else {
        // If user is trying to sign up, send all required details
        const response = await axios.post("/api/signup", { name, email, password });
        if (response.data.success) {
          setMsg("Account created! You can now sign in."); // Show success message
          setIsLogin(true); // Automatically toggle the view to the login perspective
          setPassword(""); // Clear their password for security entering next attempt
        }
      }
    } catch (err) {
      // Safely check if backend provided specific message, fallback to generic messages
      setError(err.response?.data?.message || (isLogin ? "Invalid credentials. Please try again." : "Failed to sign up."));
    }
  };

  // Dedicated handler targeting Firebase OAuth provider
  const handleGoogleLogin = async () => {
    setError(""); // Wipe any previous errors
    setGoogleLoading(true); // Activate loading spinner
    try {
      const provider = new GoogleAuthProvider(); // Spin up a new authentication instance
      const result = await signInWithPopup(auth, provider); // Wait for user to complete Google's own popup flow
      const firebaseUser = result.user; // Extract underlying Google identity objects
      
      // Pass the obtained Google token identity down to our custom backend database to provision local records
      const response = await axios.post("/api/google-login", {
        name: firebaseUser.displayName,
        email: firebaseUser.email,
        avatar: firebaseUser.photoURL,
      });

      if (response.data.success) {
        onLogin(response.data.user); // Triggers global app context setting
        navigate("/"); // Redirect to Home
      }
    } catch (err) {
      // In case they closed popup manually or network failed
      setError("Google sign-in failed. Try again.");
    } finally {
      setGoogleLoading(false); // Stops loading animation regardless
    }
  };

  return (
    // Outer flexbox wrapper enforcing minimum dimensions relative to viewport and standardizing backgrounds
    <div className="min-h-[calc(100vh-80px)] flex bg-gray-50">
      
      {/* Left Side: Massive graphical presentation, only visible on screens lg and higher */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=1200&q=100"
          alt="Delicious Food"
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        {/* Shadow overlays assuring contrast for text on top */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white max-w-lg">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black mb-4 drop-shadow-lg"
          >
            Discover the best food & drinks in your city
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-200"
          >
             Join thousands of foodies and get your favorite meals delivered straight to your door.
          </motion.p>
        </div>
      </div>

      {/* Right Side - Dynamic Login Form elements center-aligned vertically/horizontally */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        
        {/* Backing decorative colored blobs */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        {/* Floating Box implementing Glassmorphism for the login unit itself */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/50 p-8 rounded-[2rem] shadow-2xl relative z-10"
        >
          <div className="text-center mb-8">
            {/* Conditional formatting based on state context */}
            <h2 className="text-3xl font-black text-gray-900">{isLogin ? "Welcome Back" : "Create an Account"}</h2>
            <p className="text-gray-500 mt-2">{isLogin ? "Sign in to continue your food journey" : "Join us to discover the best food in your city"}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Only renders Name input if the user toggles signup mode */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
                  placeholder="John Doe"
                  value={name} // binding input value attribute tightly with local React State
                  onChange={(e) => setName(e.target.value)} // On input update state natively
                />
              </div>
            )}
            
            {/* Standard Email input binding to email state */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
                placeholder="hello@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {/* Standard Password input mapped to password state along with 'forgot' utility string rendering conditionally */}
            <div>
              <div className="flex justify-between items-center mb-1.5 ml-1">
                <label className="block text-sm font-semibold text-gray-700">Password</label>
                {isLogin && <a href="#" className="text-sm text-orange-500 hover:text-orange-600 font-medium">Forgot password?</a>}
              </div>
              <input
                type="password"
                required
                className="w-full px-5 py-3.5 bg-white/50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all shadow-sm placeholder:text-gray-400"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Error messaging block triggers solely if string is explicitly populated */}
            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm font-medium text-center bg-red-50 p-2 rounded-lg">
                {error}
              </motion.p>
            )}
            
            {/* Success messaging block triggering on positive results */}
            {msg && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm font-medium text-center bg-green-50 p-2 rounded-lg">
                {msg}
              </motion.p>
            )}

            {/* Submit button acting on whatever context mode the component is locked to */}
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 flex justify-center items-center gap-2 mt-4"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* Social login visual demarcater separating custom DB from OAuth providers */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Or continue with</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {/* Button directly tied into initiating Google sign procedure via specific Firebase utility handlers */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-semibold text-gray-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {/* Spinner fallback if 'googleLoading' explicitly evaluates to true */}
              {googleLoading ? (
                <svg className="w-5 h-5 animate-spin text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              {googleLoading ? "Signing in..." : "Google"}
            </button>
            
            {/* Hardcoded mock button meant for additional scaling */}
            <button type="button" className="flex items-center justify-center gap-2 p-3 bg-black text-white border border-gray-900 rounded-xl hover:bg-gray-800 transition-colors shadow-sm font-semibold text-sm">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.26-.74 3.58-.82 1.5-.06 2.59.45 3.37 1.25-2.85 1.4-2.12 5.09.43 6.01-.73 2.15-1.47 4.19-2.46 5.73zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Apple
            </button>
          </div>

          {/* Context toggler triggering setIsLogin reversing logic parameters */}
          <p className="mt-8 text-center text-gray-500 text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"} <span onClick={() => setIsLogin(!isLogin)} className="text-orange-600 font-bold cursor-pointer hover:underline">{isLogin ? "Sign up for free" : "Sign in instead"}</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Ensure modular component structure correctly exports logic
export default LoginPage;
