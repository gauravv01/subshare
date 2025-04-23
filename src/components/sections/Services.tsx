import { motion } from "framer-motion";
import { servicesData } from "@/lib/constants";

export default function Services() {
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-gray-800">Share Various Subscription Services</h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            From work tools to streaming services, discover a wide range of premium services at affordable prices.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service, index) => (
            <motion.div 
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg ${service.bgColor} flex items-center justify-center mb-4`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${service.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.iconPath} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {service.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex} 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${service.tagBgColor} ${service.tagTextColor}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
