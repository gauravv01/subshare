import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, User2, Hash } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {/* Company Info - stacked vertically */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-white text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
              CrypeeSolutions
            </div>
            <p className="text-gray-400 mb-6 text-base">
              A subscription sharing platform that makes premium services more affordable
            </p>
            <div className="space-y-3 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-primary" />
                <span className="font-semibold text-gray-300">Representative:</span>
                <span>Min Dong-seon</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-semibold text-gray-300">Email:</span>
                <a href="mailto:contact@crypee.io" className="hover:text-primary transition-colors">contact@crypee.io</a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span className="font-semibold text-gray-300">Address:</span>
                <span>
                  431 Teheran-ro S7018, Gangnam-gu<br />
                  Seoul, South Korea<br />
                  (Samsung-dong, Justco Tower)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                <span className="font-semibold text-gray-300">Business Registration:</span>
                <span>173-87-02739</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              {[
                { Icon: Facebook, href: "#", label: "Facebook" },
                { Icon: Twitter, href: "#", label: "Twitter" },
                { Icon: Instagram, href: "#", label: "Instagram" },
              ].map(({ Icon, href, label }, index) => (
                <motion.a
                  key={index}
                  href={href}
                  aria-label={label}
                  className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-800 rounded-full"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Legal Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h3 className="text-white font-bold text-lg mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <NavLink to="/terms" className="text-gray-400 hover:text-primary transition-colors">Terms of Service</NavLink>
              </li>
              <li>
                <NavLink to="/privacy" className="text-gray-400 hover:text-primary transition-colors">Privacy Policy</NavLink>
              </li>
              <li>
                <NavLink to="/cookies" className="text-gray-400 hover:text-primary transition-colors">Cookie Policy</NavLink>
              </li>
            </ul>
          </motion.div>

          {/* Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="#faq" className="text-gray-400 hover:text-primary transition-colors">FAQ</a>
              </li>
              <li>
                <NavLink to="/contact" className="text-gray-400 hover:text-primary transition-colors">Contact Us</NavLink>
              </li>
            </ul>
            <div className="mt-8 space-y-4">
              <a href="mailto:contact@crypee.io" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                contact@crypee.io
              </a>
              <a href="tel:+821012345678" className="flex items-center text-gray-400 hover:text-primary transition-colors">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                +82 10-1234-5678
              </a>
            </div>
          </motion.div>
        </div>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} CrypeeSolutions Co., Ltd. All rights reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
