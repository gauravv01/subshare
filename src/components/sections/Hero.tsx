import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import React from "react";

export default function Hero() {
  return (
    <section className="relative bg-[#503bd9] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Save <span className="text-accent">up to 80%</span> on subscription costs
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              Share your work, productivity, and entertainment service subscriptions with other users and split the costs. Access premium services at reasonable prices in a safe and convenient way.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <NavLink to="/connect" className="border border-white rounded-md px-6 py-3 text-center font-medium  hover:text-primary transition duration-300">
                Get Started
              </NavLink>
              <a href="#how-it-works" onClick={(e) => {
                e.preventDefault();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }} className="border border-white rounded-md px-6 py-3 text-center font-medium hover:text-primary transition duration-300">
                How It Works
              </a>
            </div>
          </motion.div>
          <motion.div 
            className="relative block mt-12 md:mt-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="absolute -top-6 -left-6 w-48 md:w-64 h-48 md:h-64 bg-secondary rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-36 md:w-48 h-36 md:h-48 bg-accent rounded-full opacity-20 animate-pulse"></div>
            <motion.div 
              className="relative bg-white rounded-xl shadow-2xl overflow-hidden p-4 md:p-6 transform rotate-2 mx-auto max-w-sm md:max-w-none"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-200 rounded-full h-8 md:h-10 w-8 md:w-10"></div>
                <div className="text-gray-800 font-bold text-base md:text-lg">Netflix Subscription Sharing</div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-100 h-6 md:h-8 rounded-md w-full"></div>
                <div className="bg-gray-100 h-6 md:h-8 rounded-md w-3/4"></div>
                <div className="flex space-x-2 mt-4 md:mt-6">
                  <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs md:text-sm">2/4 seats</div>
                  <div className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-xs md:text-sm">$3.99/month</div>
                </div>
              </div>
            </motion.div>
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-3/4 -translate-y-1/4 bg-white rounded-xl shadow-2xl overflow-hidden p-4 md:p-6 rotate-[-2deg] mx-auto max-w-sm md:max-w-none"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gray-200 rounded-full h-8 md:h-10 w-8 md:w-10"></div>
                <div className="text-gray-800 font-bold text-base md:text-lg">ChatGPT Plus Subscription Sharing</div>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-100 h-6 md:h-8 rounded-md w-full"></div>
                <div className="bg-gray-100 h-6 md:h-8 rounded-md w-3/4"></div>
                <div className="flex space-x-2 mt-4 md:mt-6">
                  <div className="bg-green-100 text-green-800 rounded-full px-3 py-1 text-xs md:text-sm">1/3 seats</div>
                  <div className="bg-indigo-100 text-indigo-800 rounded-full px-3 py-1 text-xs md:text-sm">$5.99/month</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
