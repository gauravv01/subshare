import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-8 text-primary">Privacy Policy</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <p>This service (hereinafter referred to as "Service") is operated by the Company to provide users (hereinafter referred to as "User" or "Users") with a platform that facilitates the sharing of subscription accounts for various services including streaming platforms, software tools, and other digital subscription services. To protect Users' personal information (hereinafter referred to as "Personal Information"), the Company complies with relevant privacy laws and regulations across various jurisdictions and establishes the following privacy policy (hereinafter referred to as "Policy").</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Principles of Personal Information Processing</h2>
            <p>Users can view and modify their Personal Information according to relevant laws and this Policy. Collected Personal Information may be disclosed to third parties under certain circumstances. However, except when required by law or regulation, the Company will not share a User's Personal Information with third parties without the User's explicit consent.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Information Collected for Account Registration</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required information: Email address, password, username, date of birth, payment method details</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Information for Identity Verification</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required information: Phone number, email address, username, date of birth, gender, country/region of residence, transaction history, and payment information</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Information for Legal Guardian Consent</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required information: Guardian's name, guardian's date of birth, guardian's gender, guardian's country/region, guardian's phone number, guardian's verification information (ID), guardian's relationship to the minor</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Information for Service Provision</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required information: Card details, payment information, usage time, date of transaction (yy/mm/dd), bank account and payment details</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Information for Subscription Fee Processing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required information: Subscriber information, subscription period, subscription start date, subscriber address, subscription expiration details</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Information for Company Service Provision</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required information: User ID, email address, username, date of birth, and contact information</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Information for Service Usage and Revenue Distribution</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Required information: Service usage patterns, login records, session information, and device information</li>
              <li>Methods by which Users agree to share subscription accounts and consent to Personal Information collection</li>
              <li>Methods by which Users agree to the Company's terms when using services offered by the Company</li>
              <li>Information required for new service development</li>
              <li>Information required for marketing and advertising purposes</li>
              <li>Information required for technical support, service improvements, and usage optimization</li>
              <li>Information required for monitoring Personal Information security and user account security</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Restrictions on Marketing Information Collection</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company uses appropriate technical measures to collect marketing information considering the temporal circumstances of Users. However, in the following cases, no prior consent will be obtained:
                <ul className="list-disc pl-6">
                  <li>When the Company collects contact information directly from the User for contracts and processes it for marketing purposes related to similar products and services within 6 months</li>
                  <li>When collecting information as stipulated in laws related to marketing</li>
                </ul>
              </li>
              <li>The Company will not collect marketing information even if requested, and will not process User information, if the User or their legal representative has refused or withdrawn consent.</li>
              <li>The Company only uses technical means to collect marketing information between 9 AM and 8 PM and will not collect such information even with consent if the User has refused.</li>
              <li>The Company will include the following in marketing information when using technical means:
                <ul className="list-disc pl-6">
                  <li>Company name and contact information</li>
                  <li>Information regarding the User's right to refuse or withdraw consent</li>
                  <li>Methods to block marketing information using phone settings or email settings</li>
                  <li>Measures to allow marketing information recipients to easily unsubscribe</li>
                  <li>Measures to include links for easily unsubscribing when sending marketing information</li>
                </ul>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Review and Correction of Personal Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Users and their legal representatives can view information that has been collected and can request corrections to their Personal Information.</li>
              <li>Users and their legal representatives can contact the Personal Information Protection Officer or the person in charge when requesting corrections to Personal Information.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Personal Information Retention Period</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Users can request information about the retention period of their Personal Information from the Company.</li>
              <li>The Company will not use or provide Personal Information after the retention period expires. If Personal Information has already been provided to a third party, the Company will ensure that the third party does not continue to use the information.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">13. User Obligations</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Users must keep their Personal Information up-to-date, and the responsibility for problems arising from inaccurate information rests with the User.</li>
              <li>If a User uses another person's information, they may be subject to penalties under relevant laws.</li>
              <li>Users are responsible for protecting their account credentials and may share them as per the service agreement with other users.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">14. Measures for Personal Information Leaks</h2>
            <p>The Company will immediately report any leaks, theft, or loss of Personal Information to all relevant data protection authorities in affected jurisdictions.</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Types of Personal Information affected</li>
              <li>Time when the leak occurred</li>
              <li>Measures users can take</li>
              <li>Measures the Company's information services department is taking</li>
              <li>Contact information for users to get help</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">15. Exceptions to Measures for Personal Information Leaks</h2>
            <p>The Company may choose not to report and notify Users of certain minor data incidents if the Company's impact assessment determines that the risk to individuals is unlikely to result in a high risk to their rights and freedoms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">16. Protection of Cross-Border Personal Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company will not implement technical measures that would prevent cross-border transfers of Personal Information necessary for its global service operation.</li>
              <li>The Company will respect Users' rights to have their Personal Information transferred across borders. However, the Company will inform Users about:
                <ul className="list-disc pl-6">
                  <li>Types of Personal Information being transferred</li>
                  <li>Countries to which Personal Information is being transferred</li>
                  <li>Legal basis for transferring the Personal Information</li>
                  <li>Usage purpose and retention period for transferred Personal Information</li>
                </ul>
              </li>
              <li>The Company will inform Users about:
                <ul className="list-disc pl-6">
                  <li>Personal Information categories being transferred</li>
                  <li>Countries receiving the Personal Information</li>
                  <li>Transfer methods and relevant laws</li>
                  <li>Usage purposes and retention periods</li>
                </ul>
              </li>
              <li>The Company will take appropriate measures according to international data protection standards when transferring Personal Information cross-border.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">17. Personal Information Protection Officer</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company has appointed the following Personal Information Protection Officer to handle related inquiries:</li>
              <li>Name: [Name]</li>
              <li>Position: [Position]</li>
              <li>Phone: [Phone Number]</li>
              <li>Email: [Email Address]</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">18. Remedies for Rights Violations</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>For remedies related to Personal Information rights violations, Users can file complaints with relevant data protection authorities in their jurisdiction, including:</li>
              <li>Various national data protection authorities</li>
              <li>Consumer protection agencies</li>
              <li>Law enforcement agencies</li>
              <li>Courts and tribunals</li>
              <li>The Company has implemented a system to protect Personal Information and prevent violations, and will address complaints promptly when received.</li>
              <li>Users can seek remedies through administrative or judicial proceedings for violations of applicable data protection laws.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">19. Changes to This Privacy Policy</h2>
            <p>This Privacy Policy may be updated periodically to reflect changes in our practices or legal requirements. We will notify users of any significant changes by posting a notice on our website or by sending an email to the address provided by the user. The continued use of our service after such modifications constitutes acceptance of the updated Privacy Policy.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">20. International Users</h2>
            <p>Our services are available worldwide. By using our service, you acknowledge and agree that your information may be processed in countries where data protection laws may differ from those in your country of residence. We implement appropriate safeguards to protect your information regardless of location.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">21. Subscription Sharing Specific Provisions</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account Sharing: Our service facilitates the sharing of subscription accounts for streaming services, software tools, and other digital subscription services. By using our service, you acknowledge and consent to your account credentials being shared with other authorized users of our platform.</li>
              <li>Payment Processing: We collect and process payments from users who participate in subscription sharing. This includes processing fees for access to shared accounts and distributing appropriate portions to account owners.</li>
              <li>Account Security: While we implement reasonable security measures, users are responsible for maintaining the security of their shared account information and for any actions taken under their shared accounts.</li>
              <li>Third-Party Terms: Users must ensure that their use of our service does not violate the terms of service of any third-party subscription services. The Company does not guarantee that sharing accounts through our service complies with all third-party terms of service.</li>
              <li>Service Termination: We reserve the right to terminate access to shared accounts if we receive notice that such sharing violates third-party terms of service or applicable laws.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}