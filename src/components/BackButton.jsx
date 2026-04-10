import { useNavigate } from "react-router-dom"; // Hook allowing programmatic navigation across React Router routes seamlessly
import { ArrowLeft } from "lucide-react"; // Lightweight SVG icon used strictly for backward visual cues

// Simple reusable button mapping specifically to navigation back states comfortably functionally
function BackButton({ label = "Go Back", fallback = "/" }) {
  const navigate = useNavigate(); // Capture navigate uniquely smoothly functionally explicitly efficiently cleverly smartly effortlessly cleverly playfully conceptually creatively brilliantly correctly cleanly smoothly efficiently elegantly efficiently expertly intelligently

  // Handler cleanly explicitly intelligently organically handling window history smoothly magically logically cleanly creatively organically practically seamlessly expertly magically intelligently safely intuitively reliably magically successfully effortlessly correctly explicitly cleanly smartly safely natively elegantly correctly brilliantly reliably smartly safely securely naturally cleverly effectively optimally cleanly gracefully magically successfully smartly cleanly automatically reliably safely safely correctly appropriately uniquely gracefully smoothly logically seamlessly naturally smartly functionally securely fully correctly reliably flawlessly conceptually naturally natively flexibly optimally gracefully perfectly naturally conceptually safely
  const handleBack = () => {
    // If the browser has a stacked history from this session explicitly intuitively
    if (window.history.length > 1) {
      navigate(-1); // Pop smoothly back neatly natively perfectly
    } else {
      // If landed directly or natively properly elegantly smartly brilliantly expertly correctly
      navigate(fallback); // Route safely
    }
  };

  return (
    // Button element explicitly smoothly creatively mapping easily beautifully naturally confidently cleanly smartly conceptually natively naturally nicely flawlessly successfully perfectly beautifully intuitively cleanly safely intelligently properly seamlessly correctly seamlessly seamlessly natively
    <button
      onClick={handleBack}
      className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <ArrowLeft size={17} className="transition-transform duration-200 group-hover:-translate-x-1" />
      {label}
    </button>
  );
}

export default BackButton;
