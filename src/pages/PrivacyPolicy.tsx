
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto py-8"
    >
      <motion.h1 
        className="text-4xl font-serif font-bold mb-8 bg-gradient-to-r from-blog-purple to-blog-dark-purple bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Privacy Policy
      </motion.h1>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 text-gray-700 dark:text-gray-300"
      >
        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Introduction</h2>
          <p className="mb-4">
            Welcome to our Privacy Policy. Your privacy is critically important to us. This Privacy Policy document outlines the types of personal information that is received and collected and how it is used.
          </p>
          <p>
            We use your data to provide and improve our services. By using our website, you agree to the collection and use of information in accordance with this policy.
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Information Collection And Use</h2>
          <p className="mb-4">
            We collect several different types of information for various purposes to provide and improve our service to you.
          </p>
          <h3 className="text-xl font-medium mb-2">Types of Data Collected</h3>
          <h4 className="text-lg font-medium mb-1">Personal Data</h4>
          <p>
            While using our website, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). This may include, but is not limited to:
          </p>
          <ul className="list-disc ml-6 my-3">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Cookies and Usage Data</li>
          </ul>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Usage Data</h2>
          <p className="mb-4">
            We may also collect information on how the website is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our website that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Tracking & Cookies Data</h2>
          <p className="mb-4">
            We use cookies and similar tracking technologies to track the activity on our website and hold certain information.
          </p>
          <p className="mb-4">
            Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our website.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Security</h2>
          <p>
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Changes To This Privacy Policy</h2>
          <p className="mb-4">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </motion.div>

        <motion.div variants={item} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us through our contact page.
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyPolicy;
