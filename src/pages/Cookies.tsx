import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Cookies() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. What Are Cookies</h2>
            <p className="mb-2">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">2. How We Use Cookies</h2>
            <p className="mb-2">
              ShareSub uses cookies for various purposes, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-2">
              <li>Essential cookies: These are necessary for the website to function properly.</li>
              <li>Authentication cookies: These help us identify you when you log in and maintain your login session.</li>
              <li>Preference cookies: These remember your settings and preferences to enhance your experience.</li>
              <li>Analytics cookies: These help us understand how visitors interact with our website so we can improve it.</li>
              <li>Marketing cookies: These track your online activity to deliver more relevant advertisements.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">3. Third-Party Cookies</h2>
            <p className="mb-2">
              Some cookies are placed by third-party services that appear on our pages. We use third-party services for analytics, payment processing, and marketing purposes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">4. Managing Cookies</h2>
            <p className="mb-2">
              Most web browsers allow you to control cookies through their settings. You can typically delete existing cookies, allow or block all cookies, or block cookies from specific websites.
            </p>
            <p className="mb-2">
              Please note that restricting cookies may impact your experience on our website, and some features may not function properly.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">5. Specific Cookies We Use</h2>
            <p className="mb-2">
              <strong>Essential Cookies:</strong> Session cookies for maintaining your login status and securing your connection.
            </p>
            <p className="mb-2">
              <strong>Authentication Cookies:</strong> Used to recognize you when you log in and provide access to secured features.
            </p>
            <p className="mb-2">
              <strong>Preference Cookies:</strong> Remember your language, theme, and other preferences.
            </p>
            <p className="mb-2">
              <strong>Analytics Cookies:</strong> We use analytics tools to understand how visitors use our site.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">6. Updates to This Policy</h2>
            <p className="mb-2">
              We may update this Cookie Policy periodically to reflect changes in technology, regulation, or our business practices. Any significant changes will be communicated to you via our website or direct notification.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">7. Contact Information</h2>
            <p className="mb-2">
              If you have questions or concerns about our Cookie Policy, please contact us through our Contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}