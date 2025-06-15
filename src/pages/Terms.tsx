import React, { useEffect } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen flex flex-col">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12 flex-1">
        <h1 className="text-3xl font-bold mb-8 text-primary">Terms of Service</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>This Agreement governs the use of the service (hereinafter "Service") provided by the Company through the online platform 'chacha' (https://chacha.team), which aims to provide users with a platform to share subscription accounts for streaming services, software tools, and other digital subscriptions.</li>
              <li>This Agreement applies to all users accessing the Service through any device, including but not limited to PCs, mobile devices, and tablets.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Definitions</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>"Company" refers to the entity that operates the platform to provide subscription sharing services to users through the information and telecommunications network, and specifically refers to the operator of 'chacha' (https://chacha.team).</li>
              <li>"User" refers to any individual who agrees to this Agreement and uses the Service provided by the Company.</li>
              <li>"Member" refers to a person who has registered personal information with the Company and maintains an ongoing relationship to use the Company's Service.</li>
              <li>"Non-member" refers to a person who uses the Company's Service without registration.</li>
              <li>"Product" refers to content provided through the site that includes subscriptions to various services.</li>
              <li>"Purchaser" refers to a Member or Non-member who pays for the use of subscription services offered through the Product.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Scope and Amendments</h2>
            <p>Matters not stipulated in this Agreement shall be governed by relevant laws or commercial practices of the countries where the Service is provided. In case of conflict between this Agreement and local laws, local laws shall prevail.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Display and Modification of the Agreement</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company shall post the content of this Agreement, including the Company's name, address, phone number, fax number, email address, business registration number, and other relevant information, on the Company's homepage service screen so that Users can easily access it. The content of this Agreement can be viewed by Users if requested.</li>
              <li>The Company may add, delete, or modify some of the terms of this Agreement to the extent that it does not violate relevant laws including electronic commerce regulations, consumer protection laws, and terms of adhesion regulations, to ensure the User's agreement.</li>
              <li>The Company complies with applicable laws related to electronic commerce, consumer protection, terms of adhesion regulations, personal information protection, distribution of information, and other relevant laws across various jurisdictions.</li>
              <li>When the Company intends to modify this Agreement, it shall specify the current version and the effective date of the revised version, and announce it with the revised content 7 days prior to the effective date. However, for modifications that significantly affect Users' rights and obligations, the announcement period shall be at least 30 days.</li>
              <li>When the Company modifies this Agreement, the modified Agreement shall be applied to contracts concluded after the effective date. However, for Users who have already entered into contracts before the modification, if they request to apply the previous Agreement, the Company shall apply the previous Agreement.</li>
              <li>Matters not specified in this Agreement and the interpretation of this Agreement shall be governed by applicable local laws and commercial practices.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Services Provided</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Information and matchmaking for subscription sharing and cost distribution</li>
              <li>Completion of subscription sharing purchase or distribution arrangements</li>
              <li>Payment protection services, user dispute resolution, product purchase history, and other information provision</li>
              <li>Events and promotions provided directly or through partners</li>
              <li>Other services determined by the Company</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Service Interruption, etc.</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Service provided by the Company is available 24 hours a day, 365 days a year in principle. However, temporary service interruption may occur due to system inspection, maintenance, replacement, technical issues, or circumstances beyond the Company's control.</li>
              <li>The Company may suspend or restrict part or all of the Service when natural disasters, national emergencies, or other force majeure circumstances occur, or when infrastructure services provided by telecommunication service providers are disrupted.</li>
              <li>When a "Product" price is incorrectly displayed or the contents change, the Company may cancel the relevant contract according to the policy and immediately notify the changed product information and effective date.</li>
              <li>The Company shall not be liable to Users when it suspends or restricts the Service for reasons mentioned above without prior notice.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Membership</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company shall establish a membership when a User agrees to this Agreement and submits the required membership information.</li>
              <li>The Company classifies membership based on conditions and the following types of Users shall be classified as "Members":
                <ul className="list-disc pl-6">
                  <li>Users who have created accounts according to the registration procedure, except for cases where Company's payment system is not compatible</li>
                  <li>Users with specific payment methods, credit rating, or other requirements</li>
                  <li>Other cases deemed necessary for classification as Members for the efficient operation of the Company's service</li>
                </ul>
              </li>
              <li>Membership starts from the date of the Company's approval until the Member's withdrawal.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Membership Withdrawal and Account Suspension</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Members may request withdrawal at any time, and the Company shall immediately process the Member's withdrawal request. However, if there are pending transactions, the Agreement shall remain in effect until the transaction is completed.</li>
              <li>The Company may restrict a User's account in the following cases:
                <ul className="list-disc pl-6">
                  <li>If a Member provides false registration information</li>
                  <li>If a Member's usage significantly interferes with other Users' normal use</li>
                  <li>If a User violates this Agreement or applicable laws</li>
                  <li>If a User engages in behavior that disrupts public order and morals</li>
                  <li>Other cases deemed inappropriate for continued use as a Member</li>
                </ul>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Notification to Members</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company may notify Members using their registered contact information, including email address, phone number, etc.</li>
              <li>When the Company needs to notify all Members, it may substitute individual notifications by posting on the site's main page for at least one week. However, individual notification shall be made for matters important to the Member's transactions.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Purchase Application</h2>
            <p>Users can apply for purchases in various ways based on product type, and the Company must clearly indicate the following for Users:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Information about product names and specifications</li>
              <li>Information about price, shipping, delivery fee, installation, etc.</li>
              <li>Information about service providers, delivery methods, terms of use</li>
              <li>Purchase cancellation and refund procedures</li>
              <li>Payment methods and schedules</li>
              <li>Company's customer service information</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Contract Formation</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company may not accept purchase applications in the following cases:
                <ul className="list-disc pl-6">
                  <li>Cases involving false, missing, or incorrect information</li>
                  <li>Cases where the Member has violated previous subscription rules</li>
                  <li>Technical issues that make processing the purchase impossible</li>
                  <li>Other cases deemed necessary to refuse purchase applications for justifiable reasons</li>
                </ul>
              </li>
              <li>The contract shall be considered established when the Company's acceptance is delivered to the User.</li>
              <li>When the Company expresses its intention to accept, the User must be informed about purchase confirmation, cancellation availability, delivery status, shipping method, and other relevant information.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">12. Payment Methods and Use of Subscription Accounts</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company may process payments in the following ways:
                <ul className="list-disc pl-6">
                  <li>Payment through various methods including credit cards, debit cards, etc.</li>
                  <li>Payment through various prepaid cards, gift cards, point cards, etc.</li>
                  <li>Payment through ARS, mobile carrier billing, etc.</li>
                </ul>
              </li>
              <li>The Company shall maintain accurate records of Users' payment history and allow Users to confirm transaction details, as well as keeping records available for verification and providing them upon request.</li>
              <li>Depending on the Company's policy or payment processor's (PG) standards, the Company may verify whether Users hold valid payment credentials, and may retain or remove transaction records based on User confirmation.</li>
              <li>Monthly subscription payments may be automatically processed according to the Company's policy or payment processor's (PG) standards.</li>
              <li>The responsibility for entering accurate payment information lies solely with the purchaser.</li>
              <li>The Company may adjust service usage fees, subscription fees, or separate fees charged to Users based on usage volume, member status, or other criteria.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">13. Subscription Sharing, Changes, and Cancellations</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company provides subscription sharing documents to purchasers who have completed payment.</li>
              <li>After receiving subscription sharing documents, purchasers can request changes or cancellations if necessary, and the Company shall process such requests promptly if the request is reasonable. Specific details regarding refunds are stipulated in the "Refund Policy" section of this Agreement.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">14. Product Delivery</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Unless otherwise agreed, the Company shall deliver product access credentials to the purchaser within 7 days of payment by email, message, or other appropriate methods. However, if the Company has already received payment for the product or service, appropriate measures shall be taken within 3 business days.</li>
              <li>In the case of electronic delivery, the Company shall take appropriate measures to ensure that the purchaser can confirm receipt and usage status of products such as login credentials.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">15. Returns</h2>
            <p>The Company shall not provide refunds for "Products" that purchasers have successfully received, accessed, and can use or distribute, except as required by applicable law. If a purchaser has requested a refund for such products, the Company shall process the refund within 3 business days of the request if the request meets the refund criteria.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">16. Subscription Cancellation</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Purchasers who have entered into subscription contracts with the Company may cancel their subscription within 7 days of receiving subscription sharing credentials.</li>
              <li>In the following cases, refunds will be processed according to the Company's refund policy:
                <ul className="list-disc pl-6">
                  <li>When products provided to purchasers are defective or different from what was advertised (however, if the defect is caused by the purchaser's negligence, exceptions may apply)</li>
                  <li>When the product usage or consumption significantly differs from the advertised content</li>
                  <li>When there are other justifiable reasons for cancellation according to local consumer protection laws</li>
                  <li>When products delivered differ substantially from the advertisement or sample, constituting a breach of contract</li>
                  <li>When the purchaser has notified the Company about a contractual issue, but the Company has neither addressed the issue nor provided the products advertised</li>
                </ul>
              </li>
              <li>The Company shall not process subscription cancellations for products that purchasers have already used, or provide refunds for products that have already been utilized.</li>
              <li>Purchasers may cancel subscriptions regardless of the provisions above if the content is significantly different from the advertised or expected content, or if they cannot access or use the content within 30 days of notification.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">17. Effects of Subscription Cancellation</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company shall refund the amount paid by the purchaser within 3 business days of receiving the cancellation request. If the Company delays the refund, it shall pay a late fee based on applicable interest rates (e.g., 15% per annum) for the delayed period.</li>
              <li>When processing refunds, if the purchaser used a credit card or other payment method, the Company shall request the payment processor to cancel the payment without delay so that the purchaser will not be charged.</li>
              <li>In the case of subscription cancellation, the return shipping cost for physical products shall be borne by the purchaser. However, if the product content differs from what was advertised or the product is defective, the shipping cost shall be borne by the Company.</li>
              <li>The Company shall clearly inform the purchaser whether the Company or the purchaser bears the cost of returning the product.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">18. Personal Information Protection</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company collects the minimum necessary personal information for contract fulfillment, including:
                <ul className="list-disc pl-6">
                  <li>Name</li>
                  <li>Home or mobile phone number</li>
                  <li>Address</li>
                  <li>Payment method (including credit card information)</li>
                  <li>ID</li>
                  <li>Password</li>
                  <li>Email address</li>
                </ul>
              </li>
              <li>The Company shall follow all procedures in accordance with applicable personal information protection laws when collecting and processing personal information.</li>
              <li>The Company shall not provide personal information to third parties without the Member's explicit consent or legal obligation, and all responsibility for such actions lies with the Company. However, exceptions may apply in the following cases:
                <ul className="list-disc pl-6">
                  <li>When providing necessary information to delivery companies for shipping</li>
                  <li>When disclosure is necessary for statistical research, academic research, or market surveys where results are presented in a form that cannot identify specific individuals</li>
                  <li>When necessary for debt collection according to the transaction</li>
                  <li>When disclosure is required to prevent fraud</li>
                  <li>When required by applicable laws</li>
                </ul>
              </li>
              <li>Matters relating to the protection of personal information not specified in this Agreement shall be governed by the Company's Privacy Policy.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">19. Company's Obligations</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company shall not engage in behavior prohibited by this Agreement or applicable laws and shall make every effort to provide the Service stably and continuously according to the Agreement.</li>
              <li>The Company shall implement appropriate security systems to ensure that Users can use the internet service safely.</li>
              <li>If the Company becomes aware of false or misleading advertising regarding Products, it shall immediately bear the costs of the damage.</li>
              <li>The Company shall not transmit advertising emails, mobile messages, telemarketing calls, or other promotional materials without the User's consent.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">20. User and Member Obligations</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Users must provide accurate information during registration. In case of changes or if another person's information is used, they may hold the Company harmless, and the Company shall not be responsible for any problems arising from this.</li>
              <li>Users must comply with the matters specified in this Agreement and other regulations and notices provided by the Company. Users shall not engage in any behavior that interferes with the Company's business.</li>
              <li>Users must immediately notify the Company when information such as address, contact information, or payment method changes. The responsibility for problems arising from failure to update information lies with the User.</li>
              <li>Users shall not engage in the following behaviors:
                <ul className="list-disc pl-6">
                  <li>Modifying information posted by the Company</li>
                  <li>Transmitting or posting information other than that designated by the Company</li>
                  <li>Infringing on intellectual property rights of the Company or third parties</li>
                  <li>Damaging the reputation of the Company or third parties or interfering with business</li>
                  <li>Distributing obscene or violent messages, information, or other content that violates public order and morals or applicable laws</li>
                </ul>
              </li>
              <li>Members must manage their ID and password properly.</li>
              <li>If a Member discovers that their ID and password have been stolen or used by a third party, they must immediately report it to the Company.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">21. Intellectual Property Rights and Usage</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Copyright for services and related content provided by the Company belongs to the Company.</li>
              <li>Users may not use information provided by the Company that contains intellectual property rights for commercial purposes, nor may third parties use it.</li>
              <li>When Users upload text, usage information, or content ("content") within the Service, the copyright of such content belongs to the uploading User.</li>
              <li>Regardless of the provision above, the Company may use uploaded content for the purpose of service operation, publicity, promotion, and marketing within the scope of applicable laws as follows:
                <ul className="list-disc pl-6">
                  <li>Creation and use of secondary works based on User-uploaded content, including editing, sampling, translation, and adaptation of content for service promotion. However, if the User requests to exclude their content from such use, the Company shall respect this request and exclude the relevant content.</li>
                  <li>Use within the scope of applicable laws for service operation, maintenance, development, and new service creation</li>
                  <li>Use of media and promotional materials to promote content comprehensively</li>
                </ul>
              </li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">22. Dispute Resolution</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>The Company shall make every effort to address complaints and inquiries from Users promptly. However, if immediate processing is difficult, the Company shall immediately notify the User of the reason and processing schedule.</li>
              <li>In the event of a dispute between the Company and a User regarding electronic commerce, the User may file a petition for dispute resolution with relevant consumer protection agencies, electronic commerce mediation committees, or other appropriate regulatory bodies in their jurisdiction.</li>
              <li>Any litigation related to disputes arising from this Agreement shall be governed by the laws of the jurisdiction where the claim is filed, with courts having appropriate jurisdiction.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Addendum</h2>
            <p><strong>Article 1 (Effective Date)</strong><br />This Agreement shall be effective from May 1, 2025.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">Special Provisions for Account Sharing</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Account Sharing Authorization: By using our Service, Members explicitly authorize the sharing of their subscription credentials with other Users of our platform in exchange for compensation.</li>
              <li>Responsibility for Third-Party Terms: Members acknowledge that sharing subscription accounts may violate the terms of service of third-party service providers. Members accept all responsibility and potential consequences for such violations, and the Company makes no guarantees regarding the legality or permissibility of account sharing under third-party terms.</li>
              <li>Usage Limitations: The Company may implement reasonable limitations on the number of Users who can simultaneously access a shared account to maintain service quality and prevent abuse.</li>
              <li>Security Measures: Members must maintain reasonable security practices regarding their shared account information, including using secure passwords and not sharing account information outside of the Company's platform.</li>
              <li>Revenue Distribution: The Company will distribute subscription sharing revenue according to the agreed-upon terms with account owners, minus applicable service fees.</li>
              <li>Service Termination: The Company reserves the right to terminate access to shared accounts if it receives notification from third-party service providers that such sharing violates their terms of service or applicable laws.</li>
              <li>Global Availability: The Service is available worldwide, subject to local laws and restrictions. Users are responsible for ensuring their use of the Service complies with local laws in their jurisdiction.</li>
              <li>Currency and Pricing: Fees and payments will be processed in the currency specified by the Company, with conversion rates applied as applicable based on the User's location.</li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}