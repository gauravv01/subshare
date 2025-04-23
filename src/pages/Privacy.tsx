import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Information We Collect</h2>
            <p className="mb-2">
              ShareSub collects information you provide directly, including account information, payment details, and communication preferences. We also collect usage information automatically when you interact with our services.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">2. How We Use Your Information</h2>
            <p className="mb-2">
              We use your information to provide and improve our services, process transactions, communicate with you, and ensure the security of our platform. We may also use anonymized data for analytical purposes.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">3. Information Sharing</h2>
            <p className="mb-2">
              We do not sell your personal information. We may share information with service providers who assist us in operating our platform, with your consent, or when required by law.
            </p>
            <p className="mb-2">
              When necessary for subscription sharing, we may share limited contact information between account holders and co-subscribers. This sharing is optional and requires your consent.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">4. Country-Based Matching</h2>
            <p className="mb-2">
              To comply with regional licensing requirements, we use your country information to ensure you are only matched with users in the same country for subscription sharing.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">5. Data Security</h2>
            <p className="mb-2">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">6. Your Rights</h2>
            <p className="mb-2">
              Depending on your location, you may have rights regarding your personal information, including the right to access, correct, delete, or restrict the processing of your data. You can exercise these rights by contacting us.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">7. Cookies and Similar Technologies</h2>
            <p className="mb-2">
              We use cookies and similar technologies to enhance your experience, understand usage patterns, and improve our services. For more information, please see our Cookie Policy.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">8. Updates to This Policy</h2>
            <p className="mb-2">
              We may update this Privacy Policy periodically. We will notify you of any significant changes through our website or direct communication.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">9. Contact Information</h2>
            <p className="mb-2">
              If you have questions or concerns about our Privacy Policy or practices, please contact us through our Contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}