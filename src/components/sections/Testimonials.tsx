import { motion } from "framer-motion";
import { testimonialData } from "@/lib/constants";

export default function Testimonials() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800">User Reviews</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Check out real experiences from our satisfied customers.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonialData.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="bg-gray-50 rounded-xl p-6 relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute -top-4 left-6 text-5xl text-primary opacity-20">"</div>
              <div className="relative z-10">
                <p className="text-gray-600 mb-6">
                  {testimonial.content}
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-300 mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
