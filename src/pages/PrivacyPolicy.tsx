
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, FileText } from "lucide-react";
import { toast } from "sonner";

const PrivacyPolicy = () => {
  useEffect(() => {
    // Notify user when the page loads
    toast.info("Privacy is important to us!", {
      description: "Last updated April 11, 2025",
      duration: 5000,
    });
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const iconContainerVariants = {
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="max-w-4xl mx-auto py-8"
    >
      <motion.div 
        initial={{ y: -50, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="flex items-center justify-center mb-10"
      >
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="bg-blog-light-purple dark:bg-gray-800 p-4 rounded-full mr-4"
        >
          <Shield className="h-8 w-8 text-blog-purple" />
        </motion.div>
        <div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl mb-2 bg-gradient-to-r from-blog-purple to-blog-dark-purple text-transparent bg-clip-text"
          >
            Privacy Policy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg text-gray-700 dark:text-gray-300"
          >
            Last Updated: April 11, 2025
          </motion.p>
        </div>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="prose dark:prose-invert max-w-none"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center">
            <motion.div 
              variants={iconContainerVariants} 
              whileHover="hover"
              className="mr-4 flex-shrink-0 text-blog-purple"
            >
              <FileText size={24} />
            </motion.div>
            <h2 className="text-2xl font-serif">Introduction</h2>
          </div>
          <p>
            Welcome to our blog. We respect your privacy and are committed to protecting your personal data.
            This privacy policy will inform you about how we look after your personal data when you visit our website
            and tell you about your privacy rights and how the law protects you.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-8">
          <h2>The Data We Collect About You</h2>
          <p>
            Personal data, or personal information, means any information about an individual from which that person can be identified.
            It does not include data where the identity has been removed (anonymous data).
          </p>
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-blog-light-purple dark:bg-gray-800 p-6 rounded-lg my-6"
          >
            <p className="mb-3">We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:</p>
            <ul className="space-y-2">
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center"
              >
                <span className="h-2 w-2 rounded-full bg-blog-purple mr-2"></span>
                <strong>Identity Data</strong> includes first name, last name, username or similar identifier.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center"
              >
                <span className="h-2 w-2 rounded-full bg-blog-purple mr-2"></span>
                <strong>Contact Data</strong> includes email address and telephone numbers.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center"
              >
                <span className="h-2 w-2 rounded-full bg-blog-purple mr-2"></span>
                <strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting.
              </motion.li>
              <motion.li 
                whileHover={{ x: 5 }}
                className="flex items-center"
              >
                <span className="h-2 w-2 rounded-full bg-blog-purple mr-2"></span>
                <strong>Usage Data</strong> includes information about how you use our website, products and services.
              </motion.li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2>How We Collect Your Personal Data</h2>
          <p>We use different methods to collect data from and about you including through:</p>
          <ul>
            <li><strong>Direct interactions.</strong> You may give us your Identity and Contact Data by filling in forms or by corresponding with us by post, phone, email or otherwise.</li>
            <li><strong>Automated technologies or interactions.</strong> As you interact with our website, we may automatically collect Technical Data about your equipment, browsing actions and patterns.</li>
            <li><strong>Third parties or publicly available sources.</strong> We may receive personal data about you from various third parties and public sources as set out below Technical Data from analytics providers such as Google based outside the EU.</li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2>How We Use Your Personal Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal obligation.</li>
          </ul>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 my-8"
        >
          <div className="flex items-center mb-4">
            <motion.div whileHover={{ rotate: 15 }} className="mr-3 text-blog-purple">
              <Lock size={24} />
            </motion.div>
            <h2 className="m-0">Data Security</h2>
          </div>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know. They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
          </p>
          <p>
            We have put in place procedures to deal with any suspected personal data breach and will notify you and any applicable regulator of a breach where we are legally required to do so.
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h2>Your Legal Rights</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data. You have the right to:</p>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <strong>Request access</strong> to your personal data.
            </motion.div>
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <strong>Request correction</strong> of your personal data.
            </motion.div>
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <strong>Request erasure</strong> of your personal data.
            </motion.div>
            <motion.div 
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
            >
              <strong>Object to processing</strong> of your personal data.
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8"
        >
          <h2>Contact Us</h2>
          <motion.p
            whileHover={{ color: "#9b87f5" }}
            transition={{ duration: 0.3 }}
          >
            If you have any questions about this privacy policy or our privacy practices, please contact us using the details set out below.
          </motion.p>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="mt-4 p-5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700"
          >
            <p>
              Email address: <a href="mailto:privacy@yourblog.com" className="text-blog-purple">privacy@yourblog.com</a><br />
              Postal address: 123 Blog Street, San Francisco, CA 94107
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyPolicy;
