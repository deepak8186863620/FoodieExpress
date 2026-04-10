import { Link } from "react-router-dom"; // React Router component for declarative client-side navigation without full page reloads

// The Footer component serves as the global bottom section of the application, providing navigation links, branding, and contact information.
function Footer() {
  return (
    // Main structural footer container. Uses a very dark gray background (bg-gray-900) for high contrast and white text for readability.
    // 'py-16' adds substantial vertical padding, and 'mt-20' pushes the footer down from the main content.
    <footer className="bg-gray-900 text-white py-16 mt-20">
      
      {/* 
        Container bounding the main content width. 
        'max-w-7xl mx-auto px-4' keeps content centered and readable on large screens while maintaining padding on mobile.
        'grid grid-cols-1 md:grid-cols-4 gap-12' creates a responsive 4-column layout on desktop, falling back to a single column on mobile.
      */}
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Column 1: Brand Identity and Description */}
        <div className="space-y-6">
          {/* Flex container aligning the logo and brand name horizontally */}
          <div className="flex items-center gap-3">
            {/* Logo icon container: A distinct orange square with rounded corners to establish brand color identity */}
            <div className="bg-orange-500 p-2 rounded-xl">
              <span className="text-white font-black">FE</span>
            </div>
            {/* Brand text styled with high contrast and tight letter spacing for a modern logo feel */}
            <span className="text-2xl font-black tracking-tighter uppercase">FoodieExpress</span>
          </div>
          {/* Subtitle paragraph explaining the core value proposition of the app. Text is slightly dimmed (text-gray-400) relative to headings. */}
          <p className="text-gray-400 text-sm leading-relaxed">
            Delivering happiness to your doorstep. The best food from the best restaurants in your city.
          </p>
        </div>

        {/* Column 2: Quick Links (Internal Navigation) */}
        <div>
          {/* Section heading clearly defining the group of links below */}
          <h4 className="text-lg font-bold mb-6">Quick Links</h4>
          {/* Unordered list managing the vertical flow of navigational links */}
          <ul className="space-y-4 text-gray-400 text-sm">
            {/* Link components connecting users to essential application routes. Hover effects (text-orange-500) provide interactive feedback. */}
            <li><Link to="/" className="hover:text-orange-500 transition-colors">Home</Link></li>
            <li><Link to="/cart" className="hover:text-orange-500 transition-colors">Cart</Link></li>
            <li><Link to="/dashboard" className="hover:text-orange-500 transition-colors">My Profile</Link></li>
          </ul>
        </div>

        {/* Column 3: Cuisine Categories (Exploration Links) */}
        <div>
          {/* Section heading summarizing the type of food links provided below */}
          <h4 className="text-lg font-bold mb-6">Cuisines</h4>
          {/* List grouping common food categories. Currently visual stubs, easily retrofitted with <Link> wrappers targeting filtered search pages later. */}
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-orange-500 cursor-pointer transition-colors">North Indian</li>
            <li className="hover:text-orange-500 cursor-pointer transition-colors">Italian</li>
            <li className="hover:text-orange-500 cursor-pointer transition-colors">Japanese</li>
            <li className="hover:text-orange-500 cursor-pointer transition-colors">Healthy Food</li>
          </ul>
        </div>

        {/* Column 4: Contact Information */}
        <div>
          {/* Section heading for customer support details */}
          <h4 className="text-lg font-bold mb-6">Contact Us</h4>
          {/* Listing static communication channels. Allows users to easily find support mechanisms off-platform. */}
          <ul className="space-y-4 text-gray-400 text-sm">
            <li>support@foodieexpress.com</li>
            <li>+91 98765 43210</li>
            <li>Mumbai, India</li>
          </ul>
        </div>

      </div>

      {/* 
        Bottom-most copyright section. 
        Separated from the main columns above by an extremely subtle top border (border-gray-800).
        Utilizes heavily dimmed, perfectly centered text (text-gray-500 text-xs) indicating secondary hierarchical importance.
      */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
        © 2026 FoodieExpress. All rights reserved. Built for Student Placement Prep.
      </div>
    </footer>
  );
}

// Export the component so it can be instantiated near the bottom of App.js layout contexts.
export default Footer;
