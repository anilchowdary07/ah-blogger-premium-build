
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">About Our Blog</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover our story, our mission, and the team behind the content.
        </p>
      </header>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg mb-4">
          We believe in the power of sharing knowledge and ideas. Our mission is to create a space where 
          thoughtful content meets engaging discussions, bringing together diverse perspectives on technology, 
          science, culture, and business.
        </p>
        <p className="text-lg">
          Through our blog, we aim to inspire curiosity, foster learning, and build a community of 
          readers who value quality content and meaningful conversations.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Jane Smith</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Founder & Editor-in-Chief</p>
            <p>
              With over 15 years of experience in digital publishing, Jane leads our editorial 
              vision with passion and precision.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">John Reynolds</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Technology Editor</p>
            <p>
              A former software engineer turned writer, John brings technical expertise and 
              clear explanations to complex topics.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6">Our Story</h2>
        <p className="text-lg mb-4">
          Founded in 2023, our blog started as a small personal project that quickly grew into a 
          vibrant platform reaching thousands of readers monthly.
        </p>
        <p className="text-lg mb-4">
          What began as a passion for writing about technology has expanded to cover a wide range of 
          topics that reflect our growing interests and the diverse needs of our audience.
        </p>
        <p className="text-lg">
          Today, we're proud to be a trusted source of information, insights, and inspiration for 
          our community of readers and contributors.
        </p>
      </section>

      <div className="text-center mt-10">
        <Link to="/contact">
          <Button className="bg-blog-purple hover:bg-blog-dark-purple">
            Get In Touch
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default AboutUs;
