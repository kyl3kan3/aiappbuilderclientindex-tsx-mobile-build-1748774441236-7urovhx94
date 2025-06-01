import React from "react";
import { Code } from "lucide-react";
import { FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-accent text-white">
                <Code className="h-4 w-4" />
              </div>
              <span className="font-bold text-lg text-white">AppCraft AI</span>
            </div>
            <p className="text-gray-400 text-sm">
              Turn your app ideas into reality with the power of AI. No coding required.
            </p>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="text-lg" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaGithub className="text-lg" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Templates</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Showcase</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">API Reference</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} AppCraft AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
