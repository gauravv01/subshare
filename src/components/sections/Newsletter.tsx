import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast({
        title: "Please enter your email",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest("POST", "/api/newsletter", { email });

      toast({
        title: "Subscription complete",
        description: "You will receive the latest news and benefits via email.",
      });

      setEmail("");
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Latest Updates & Benefits</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Be the first to receive news about new services and special benefits.
              </p>
            </div>

            <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
              <div className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-md border border-gray-300 focus:ring-primary focus:border-primary" 
                  required 
                />
                <button 
                  type="submit" 
                  className="bg-primary text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-300 whitespace-nowrap"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Subscribe"}
                </button>
              </div>
              <div className="text-center mt-4 text-sm text-gray-500">
                You can unsubscribe at any time. Your privacy is safe with us.
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}