import React, { Suspense } from "react";
import { motion } from "framer-motion";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { Loader2 } from "lucide-react";

// Lazy load sections for better performance
const Hero = React.lazy(() => import("../components/sections/Hero"));
const Statistics = React.lazy(() => import("../components/sections/Statistics"));
const Services = React.lazy(() => import("../components/sections/Services"));
const HowItWorks = React.lazy(() => import("../components/sections/HowItWorks"));
const Calculator = React.lazy(() => import("../components/sections/Calculator"));
const Testimonials = React.lazy(() => import("../components/sections/Testimonials"));
const Faq = React.lazy(() => import("../components/sections/Faq"));
const Cta = React.lazy(() => import("../components/sections/Cta"));

// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

export default function Home() {
  return (
    <div className="font-sans text-gray-800 bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Suspense fallback={<SectionLoader />}>
          <Hero />
        </Suspense>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<SectionLoader />}>
            <Statistics />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<SectionLoader />}>
            <Services />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<SectionLoader />}>
            <HowItWorks />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<SectionLoader />}>
            <Calculator />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<SectionLoader />}>
            <Testimonials />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<SectionLoader />}>
            <Faq />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Suspense fallback={<SectionLoader />}>
            <Cta />
          </Suspense>
        </motion.div>
      </motion.main>
      <Footer />
    </div>
  );
}
