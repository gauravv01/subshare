import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="font-sans text-gray-800 bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="space-y-6">
          <section>
            <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
            <p className="mb-2">
              Welcome to ShareSub. These Terms of Service govern your use of our platform and services. By accessing or using ShareSub, you agree to be bound by these terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">2. Account Sharing Rules</h2>
            <p className="mb-2">
              ShareSub is designed to connect users who wish to share subscription accounts legally and in accordance with the terms of service of the respective service providers.
            </p>
            <p className="mb-2">
              Users may only share accounts when such sharing is permitted by the service provider's terms. It is the user's responsibility to ensure compliance with the respective service's terms.
            </p>
            <p className="mb-2">
              Sharing is only permitted between users in the same country to ensure compliance with regional licensing agreements.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">3. User Accounts</h2>
            <p className="mb-2">
              You are responsible for maintaining the security of your account and password. ShareSub cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
            </p>
            <p className="mb-2">
              You must provide accurate, current, and complete information during the registration process and keep your account information updated.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">4. Payments and Refunds</h2>
            <p className="mb-2">
              All payments are processed securely through our payment provider. We do not store credit card information.
            </p>
            <p className="mb-2">
              Refunds may be provided in accordance with our refund policy, which is available upon request.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">5. User Conduct</h2>
            <p className="mb-2">
              Users are expected to behave respectfully and honestly when using the platform. Any fraudulent, abusive, or illegal behavior will not be tolerated and may result in termination of your account.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">6. Limitation of Liability</h2>
            <p className="mb-2">
              ShareSub is provided "as is" without warranties of any kind, either express or implied. In no event will ShareSub be liable for any damages, including without limitation, direct, indirect, incidental, special, consequential, or punitive damages arising out of the use of or inability to use ShareSub.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">7. Changes to Terms</h2>
            <p className="mb-2">
              ShareSub reserves the right to modify these terms at any time. We will provide notification of significant changes. Your continued use of the platform after such modifications constitutes your acceptance of the updated terms.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold mb-3">8. Contact Information</h2>
            <p className="mb-2">
              If you have any questions about these Terms, please contact us through our Contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}