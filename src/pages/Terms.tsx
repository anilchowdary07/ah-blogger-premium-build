
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Terms = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-6">Terms of Service</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and
              provisions of this agreement. If you do not agree to abide by the terms of this agreement,
              do not use or access our services.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Content Usage</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              All content published on this blog is for informational purposes only. We reserve
              the right to modify, update or remove any content at our discretion. The content
              provided is believed to be accurate but is not guaranteed to be error-free.
            </p>
            <p>
              You may not reproduce, distribute, or transmit any content from this website without
              our prior written permission, except for personal, non-commercial use.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Comments & Contributions</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              By submitting comments or content to this website, you grant us a non-exclusive,
              royalty-free, perpetual, and worldwide license to use, reproduce, modify, and
              distribute your content in connection with the service and our business.
            </p>
            <p>
              You are solely responsible for the content you post. Content that is abusive, threatening,
              defamatory, obscene, vulgar, or otherwise violating any law is prohibited.
            </p>
          </CardContent>
        </Card>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none">
            <p>
              Our privacy policy explains how we collect, use, and protect your personal information.
              By using this website, you consent to the terms of our privacy policy.
            </p>
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-8">
          <Link to="/">
            <Button size="lg">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Terms;
