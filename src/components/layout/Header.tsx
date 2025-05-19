import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import logo  from "../../images/logo.jpg";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NavLink to="/" className="flex-shrink-0">
         
               <img src={logo} alt="Logo" className=" w-15 object-cover " />
            </NavLink>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {[
                { to: "/services", label: "Services" },
                { to: "/how-it-works", label: "How It Works" },
                { to: "/pricing", label: "Pricing" },
                { to: "/faq", label: "FAQ" },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `relative text-base font-medium transition-colors ${
                      isActive ? "text-primary" : "text-gray-700 hover:text-primary"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {label}
                      {isActive && (
                        <motion.div
                          className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-primary"
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </motion.div>

          <motion.div 
            className="flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <NavLink to="/login" className="hidden md:block">
              <Button variant="outline" className="cursor-pointer text-black">Login</Button>
            </NavLink>
            <NavLink to="/signup">
              <Button variant="outline" className="cursor-pointer text-black">
                Get Started
              </Button>
            </NavLink>
            <button 
              type="button" 
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
        
        {/* Enhanced Mobile menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden py-4 border-t border-gray-100"
            >
              <nav className="flex flex-col space-y-4">
                {[
                  { to: "/services", label: "Services" },
                  { to: "/how-it-works", label: "How It Works" },
                  { to: "/pricing", label: "Pricing" },
                  { to: "/faq", label: "FAQ" },
                  { to: "/login", label: "Login" },
                ].map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `text-base font-medium px-4 py-2 rounded-md transition-colors ${
                        isActive 
                          ? "bg-primary/10 text-primary" 
                          : "text-gray-700 hover:bg-gray-50"
                      }`
                    }
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
