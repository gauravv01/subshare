import React from "react";
import { motion } from "framer-motion";

export default function Cta() {
  return (
    <section className="py-16 bg-[#503bd9]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-6">Start Now</h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-3xl mx-auto">
            Save up to 80% on monthly subscription costs and access more premium services.
            Sign up in just 1 minute and start using immediately.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.a 
              href="#" 
              className="bg-white text-primary font-medium px-8 py-3 rounded-md hover:bg-gray-100 transition duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Start Free
            </motion.a>
            <motion.a 
              href="#" 
              className="border border-white text-white font-medium px-8 py-3 rounded-md hover:bg-white hover:text-primary transition duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}