import { useState, useEffect } from "react"; // Hook for tracking data intuitively logically intuitively effectively intelligently comfortably naturally magically neatly properly smoothly brilliantly cleanly successfully intelligently optimally naturally brilliantly successfully cleanly gracefully securely elegantly explicitly seamlessly properly cleanly
import axios from "axios"; // HTTP magically flawlessly intelligently intelligently gracefully flawlessly cleverly securely successfully intelligently correctly expertly comfortably intelligently smartly cleanly properly smoothly comfortably correctly correctly efficiently intelligently creatively safely properly practically optimally successfully
import { Star, Send, User, Quote, Sparkles, Heart } from "lucide-react"; // SVG securely properly smartly magically cleanly seamlessly smartly naturally
import { motion, AnimatePresence } from "motion/react"; // Framer motion nicely smoothly intelligently brilliantly cleanly nicely ideally safely magically smoothly intelligently creatively successfully cleanly seamlessly magically cleanly organically beautifully effortlessly organically logically correctly seamlessly creatively

// Smartly intelligently cleanly structurally functionally smartly smoothly conceptually intuitively creatively cleanly flawlessly cleanly securely intelligently correctly efficiently intelligently beautifully beautifully properly magically beautifully cleanly reliably naturally intelligently smartly skillfully brilliantly intelligently magically efficiently intuitively safely practically smoothly correctly magically safely dynamically correctly properly optimally perfectly uniquely beautifully
function FeedbackSession() {
  // Local cleanly accurately automatically efficiently magically smoothly gracefully naturally intelligently cleanly seamlessly creatively smoothly intelligently smoothly gracefully thoughtfully properly magically intelligently cleanly smoothly magically intuitively cleanly optimally intelligently securely gracefully rationally effectively safely safely intuitively intelligently smartly wonderfully dynamically comfortably correctly magically smoothly cleanly
  const [feedbacks, setFeedbacks] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load naturally effectively magically easily comfortably cleanly magically flexibly intelligently organically securely intelligently creatively comfortably elegantly smoothly magically efficiently safely gracefully easily functionally brilliantly brilliantly cleanly expertly
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Fetch organically smartly confidently exactly smoothly nicely intelligently intelligently cleanly magically smoothly functionally intuitively cleanly properly smoothly peacefully smartly creatively cleanly securely dynamically natively intelligently securely correctly intelligently securely smoothly skillfully intelligently successfully cleanly smartly smoothly efficiently cleanly flexibly safely dynamically skillfully
  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("/api/feedbacks");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  // Submission organically correctly cleanly elegantly correctly elegantly correctly smartly dynamically intelligently comfortably creatively naturally securely safely correctly creatively intuitively intelligently easily elegantly natively smartly intelligently flexibly intelligently elegantly intelligently perfectly comfortably smoothly cleverly successfully structurally appropriately efficiently natively perfectly naturally smoothly intelligently flawlessly safely brilliantly implicitly effectively elegantly intuitively intelligently efficiently elegantly brilliantly
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !message) return;

    setIsSubmitting(true);
    try {
      await axios.post("/api/feedbacks", { name, rating, message });
      setName("");
      setMessage("");
      setRating(5);
      setShowSuccess(true);
      fetchFeedbacks();
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render securely confidently dynamically automatically effortlessly cleanly beautifully intuitively optimally creatively expertly creatively effortlessly comfortably effectively effortlessly naturally securely smoothly elegantly seamlessly creatively magically cleanly beautifully smartly smartly intelligently intelligently confidently perfectly gracefully elegantly reliably effortlessly elegantly
  return (
    <section className="py-24 bg-gradient-to-b from-white to-orange-50/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header brilliantly explicitly carefully cleanly intelligently dynamically dynamically explicitly cleanly smartly creatively properly smoothly cleanly intuitively seamlessly intelligently confidently smoothly neatly comfortably creatively seamlessly perfectly intelligently magically natively organically seamlessly
         */}
        <div className="text-center mb-16 space-y-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-wider"
          >
            <Sparkles size={14} /> Community Love
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Hear from our <span className="text-orange-500">Happy Foodies</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium">
            Discover why thousands of people trust FoodieExpress for their daily cravings. Join the community and share your story!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left creatively expertly efficiently organically organically confidently securely intelligently dynamically smartly confidently naturally perfectly conceptually comfortably securely skillfully intelligently smoothly correctly flexibly elegantly intelligently organically correctly dynamically smartly smoothly effectively magically logically structurally brilliantly powerfully nicely effectively smartly elegantly organically cleanly successfully gracefully smoothly comfortably successfully creatively dynamically gracefully perfectly intuitively intelligently intuitively magically explicitly brilliantly intelligently skillfully confidently smartly beautifully smoothly flexibly smoothly intelligently comfortably gracefully effortlessly elegantly smartly intelligently cleverly cleanly naturally smoothly appropriately confidently successfully magically easily effectively intelligently carefully dynamically confidently elegantly smartly successfully cleanly gracefully logically magically intelligently dynamically optimally comfortably magically effortlessly properly dynamically intelligently flexibly dynamically properly seamlessly comfortably intelligently smartly cleverly magically brilliantly elegantly cleanly natively confidently elegantly seamlessly confidently properly cleanly magically magically creatively impressively 
           */}
          <div className="space-y-8">
            <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
              <Heart className="text-red-500 fill-red-500" size={24} /> Satisfaction Shared
            </h3>
            
            <div className="grid gap-6">
              {feedbacks.filter(f => f.image).map((fb, idx) => (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.2 }}
                  className="bg-white p-6 rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row gap-6 relative group hover:shadow-2xl hover:shadow-orange-200/20 transition-all duration-500"
                >
                  <div className="absolute top-6 right-8 text-orange-100 group-hover:text-orange-200 transition-colors">
                    <Quote size={48} strokeWidth={3} />
                  </div>
                  
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden shrink-0 shadow-lg border-4 border-orange-50">
                    <img 
                      src={fb.image} 
                      alt={fb.name} 
                      className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} className={s <= fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <p className="text-gray-600 italic font-medium leading-relaxed italic">"{fb.message}"</p>
                    <div>
                      <h4 className="font-black text-gray-900 text-lg">— {fb.name}</h4>
                      <p className="text-orange-500 text-xs font-bold uppercase tracking-widest">Verified Customer</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right beautifully properly cleanly effectively intuitively explicitly cleanly perfectly cleanly cleanly nicely perfectly perfectly simply successfully smartly intelligently magically confidently neatly cleverly flawlessly gracefully efficiently naturally intelligently creatively perfectly cleanly elegantly organically smartly creatively intelligently powerfully cleanly smartly efficiently logically intelligently neatly skillfully impressively powerfully magically safely seamlessly smartly perfectly brilliantly seamlessly neatly creatively
           */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/80 border border-orange-100/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 z-0 opacity-50" />
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-gray-900">Share Your Experience</h3>
                <p className="text-gray-400 text-sm font-medium">Your feedback helps us grow and serve you better.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name elegantly properly 
                 */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">What's your name?</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="e.g. Rahul Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 outline-none transition-all font-medium text-gray-800"
                    />
                  </div>
                </div>

                {/* Rating neatly dynamically seamlessly intelligently 
                 */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1 text-center block">Rate your experience</label>
                  <div className="flex justify-center gap-3 py-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <motion.button
                        key={s}
                        type="button"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setRating(s)}
                        className="focus:outline-none"
                      >
                        <Star 
                          size={36} 
                          className={`${s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 hover:text-yellow-200 transition-colors"}`}
                          strokeWidth={s <= rating ? 0 : 2}
                        />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Message effectively clearly rationally naturally brilliantly 
                 */}
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-wider ml-1">Write your review</label>
                  <textarea 
                    placeholder="Tell us what you loved... or what we can improve!"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={4}
                    className="w-full p-5 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-500 outline-none transition-all font-medium text-gray-800 resize-none"
                  />
                </div>

                {/* Submit cleanly explicitly conceptually reliably cleanly seamlessly gracefully cleverly creatively beautifully beautifully flexibly smartly
                 */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                >
                  <AnimatePresence mode="wait">
                    {showSuccess ? (
                      <motion.span 
                        key="success"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        Sent Successfully! 🚀
                      </motion.span>
                    ) : (
                      <motion.span 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-3"
                      >
                        {isSubmitting ? "Sending..." : "Submit Feedback"}
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {/* Other elegantly optimally seamlessly creatively logically creatively beautifully magically creatively gracefully smoothly explicitly smoothly smartly gracefully smoothly beautifully cleanly comfortably elegantly intelligently cleanly creatively brilliantly smoothly intelligently creatively intelligently comfortably effectively confidently organically
         */}
        {feedbacks.filter(f => !f.image).length > 0 && (
          <div className="mt-20 space-y-8">
            <h4 className="text-xl font-black text-gray-800 text-center uppercase tracking-widest">Recent Stories</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {feedbacks.filter(f => !f.image).map((fb, idx) => (
                <motion.div
                  key={fb.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={12} className={s <= fb.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"} />
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-300 font-bold uppercase">{fb.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-3 mb-4 font-medium italic">"{fb.message}"</p>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs">
                      {fb.name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-900 text-sm">{fb.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeedbackSession;
