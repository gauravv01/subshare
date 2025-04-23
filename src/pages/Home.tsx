import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/sections/Hero";
import Statistics from "../components/sections/Statistics";
import Services from "../components/sections/Services";
import HowItWorks from "../components/sections/HowItWorks";
import Calculator from "../components/sections/Calculator";
import Testimonials from "../components/sections/Testimonials";
import Faq from "../components/sections/Faq";
import Cta from "../components/sections/Cta";

export default function Home() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Header />
      <main>
        <Hero />
        <Statistics />
        <Services />
        <HowItWorks />
        <Calculator />
        <Testimonials />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </div>
  );
}
