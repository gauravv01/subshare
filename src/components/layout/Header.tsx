import React, { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <NavLink to="/">
                <span className="text-primary text-2xl font-bold cursor-pointer">ShareSub</span>
              </NavLink>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <NavLink to="/services" className="text-gray-700 hover:text-primary font-medium">Services</NavLink>
              <NavLink to="/how-it-works" className="text-gray-700 hover:text-primary font-medium">How It Works</NavLink>
              <NavLink to="/pricing" className="text-gray-700 hover:text-primary font-medium">Pricing</NavLink>
              <NavLink to="/faq" className="text-gray-700 hover:text-primary font-medium">FAQ</NavLink>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <NavLink to="/login" className="text-gray-700 hover:text-primary font-medium hidden md:block">Login</NavLink>
            <NavLink to="/signup" className="bg-primary text-white rounded-md px-4 py-2 hover:bg-indigo-600 transition duration-300">Get Started</NavLink>
            <button 
              type="button" 
              className="md:hidden p-2 text-gray-600 hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/services" className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}>Services</NavLink>
              <NavLink to="/how-it-works" className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}>How It Works</NavLink>
              <NavLink to="/pricing" className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}>Pricing</NavLink>
              <NavLink to="/faq" className="text-gray-700 hover:text-primary font-medium"
                onClick={() => setMobileMenuOpen(false)}>FAQ</NavLink>
              <NavLink to="/login" className="text-gray-700 hover:text-primary font-medium">Login</NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
