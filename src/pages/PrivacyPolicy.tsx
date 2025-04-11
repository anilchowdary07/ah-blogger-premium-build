
import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl mb-6">Privacy Policy</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Last Updated: April 11, 2025
      </p>

      <div className="prose dark:prose-invert max-w-none">
        <h2>Introduction</h2>
        <p>
          Welcome to our blog. We respect your privacy and are committed to protecting your personal data.
          This privacy policy will inform you about how we look after your personal data when you visit our website
          and tell you about your privacy rights and how the law protects you.
        </p>

        <h2>The Data We Collect About You</h2>
        <p>
          Personal data, or personal information, means any information about an individual from which that person can be identified.
          It does not include data where the identity has been removed (anonymous data).
        </p>
        <p>We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
        <ul>
          <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
          <li><strong>Contact Data</strong> includes email address and telephone numbers.</li>
          <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access this website.</li>
          <li><strong>Usage Data</strong> includes information about how you use our website, products and services.</li>
          <li><strong>Marketing and Communications Data</strong> includes your preferences in receiving marketing from us and our third parties and your communication preferences.</li>
        </ul>

        <h2>How We Collect Your Personal Data</h2>
        <p>We use different methods to collect data from and about you including through:</p>
        <ul>
          <li><strong>Direct interactions.</strong> You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email or otherwise.</li>
          <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions and patterns.</li>
          <li><strong>Third parties or publicly available sources.</strong> We may receive personal data about you from various third parties and public sources as set out below Technical Data from analytics providers such as Google based outside the EU.</li>
        </ul>

        <h2>How We Use Your Personal Data</h2>
        <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
        <ul>
          <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
          <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          <li>Where we need to comply with a legal obligation.</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
        </p>
        <p>
          We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
        </p>

        <h2>Your Legal Rights</h2>
        <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to:</p>
        <ul>
          <li><strong>Request access</strong> to your personal data.</li>
          <li><strong>Request correction</strong> of your personal data.</li>
          <li><strong>Request erasure</strong> of your personal data.</li>
          <li><strong>Object to processing</strong> of your personal data.</li>
          <li><strong>Request restriction of processing</strong> your personal data.</li>
          <li><strong>Request transfer</strong> of your personal data.</li>
          <li><strong>Right to withdraw consent.</strong></li>
        </ul>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact us using the details set out below.
        </p>
        <p>
          Email address: privacy@yourblog.com<br />
          Postal address: 123 Blog Street, San Francisco, CA 94107
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
