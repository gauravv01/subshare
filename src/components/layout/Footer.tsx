import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-white text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              ShareSub
            </div>
            <p className="text-gray-400 mb-6">
              A subscription sharing platform that makes premium services more affordable
            </p>
            <div className="flex space-x-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Twitter, href: "#" },
                { Icon: Instagram, href: "#" },
              ].map(({ Icon, href }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  className="text-gray-400 hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-white font-bold mb-6">Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white">Entertainment</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Work & Productivity</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Education</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Music Streaming</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Cloud Storage</a></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-bold mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><NavLink to="/terms" className="text-gray-400 hover:text-white">Terms of Service</NavLink></li>
              <li><NavLink to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</NavLink></li>
              <li><NavLink to="/cookies" className="text-gray-400 hover:text-white">Cookie Policy</NavLink></li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-bold mb-6">Support</h3>
            <ul className="space-y-3">
              <li><a href="#faq" className="text-gray-400 hover:text-white">FAQ</a></li>
              <li><NavLink to="/contact" className="text-gray-400 hover:text-white">Contact Us</NavLink></li>
            </ul>
            <div className="mt-6 space-y-3">
              <a href="mailto:support@sharesub.com" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                support@sharesub.com
              </a>
              <a href="tel:+1234567890" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 mr-2" />
                +1 (234) 567-890
              </a>
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} ShareSub Platform. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
