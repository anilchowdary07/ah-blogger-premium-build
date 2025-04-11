
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, Users2, Award, GraduationCap, Flag } from "lucide-react";

const Company = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <header className="mb-12 text-center">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Our Company</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Learn about the organization behind the blog, our values, and our approach.
        </p>
      </header>

      <section className="mb-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="font-serif text-3xl font-bold mb-6 flex items-center">
            <Building2 className="mr-3 text-blog-purple" />
            Company Overview
          </h2>
          <p className="text-lg mb-4">
            Our company was established to bridge the gap between complex subjects and everyday readers. 
            We believe that knowledge should be accessible, engaging, and actionable.
          </p>
          <p className="text-lg">
            With a team of dedicated writers, editors, and subject matter experts, we create content 
            that informs, educates, and inspires our growing audience across the globe.
          </p>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-8 flex items-center">
          <Flag className="mr-3 text-blog-purple" />
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Quality</h3>
            <p>
              We are committed to excellence in every piece of content we publish, ensuring accuracy, 
              clarity, and value for our readers.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Integrity</h3>
            <p>
              We uphold the highest standards of honesty and transparency in our content, relationships, 
              and business practices.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p>
              We embrace creativity and forward-thinking approaches to content creation and distribution.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-3">Community</h3>
            <p>
              We foster an inclusive environment where diverse perspectives are valued and discussions thrive.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-8 flex items-center">
          <Users2 className="mr-3 text-blog-purple" />
          Leadership Team
        </h2>
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-full mb-4 md:mb-0">
                {/* Placeholder for CEO image */}
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold">Sarah Johnson</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">CEO & Founder</p>
              <p>
                With a background in digital media and a passion for storytelling, Sarah founded the company 
                with a vision to create high-quality content that matters. She oversees strategic direction 
                and growth initiatives.
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6">
            <div className="md:w-1/4">
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-full mb-4 md:mb-0">
                {/* Placeholder for COO image */}
              </div>
            </div>
            <div className="md:w-3/4">
              <h3 className="text-xl font-bold">Michael Chen</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Chief Operating Officer</p>
              <p>
                Michael brings operational expertise from his years at leading media companies. He ensures 
                that our day-to-day operations run smoothly and our content reaches the right audience.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="font-serif text-3xl font-bold mb-6 flex items-center">
          <Award className="mr-3 text-blog-purple" />
          Achievements
        </h2>
        <ul className="space-y-4 list-disc pl-5">
          <li className="text-lg">Named "Best Technology Blog" by Digital Media Awards, 2024</li>
          <li className="text-lg">Featured in "Top 50 Educational Websites" by Education Weekly</li>
          <li className="text-lg">Over 1 million monthly active readers across all platforms</li>
          <li className="text-lg">Recognized for excellence in science communication by the Science Journalism Association</li>
        </ul>
      </section>

      <div className="text-center mt-10 space-x-4">
        <Link to="/careers">
          <Button variant="outline" className="border-blog-purple text-blog-purple hover:bg-blog-light-purple">
            Join Our Team
          </Button>
        </Link>
        <Link to="/contact">
          <Button className="bg-blog-purple hover:bg-blog-dark-purple">
            Contact Us
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Company;
