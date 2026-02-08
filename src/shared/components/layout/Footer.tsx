import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, Clock } from "lucide-react";
import { Badge } from "@/shared/components/ui/badge";

const Footer = () => {
  return (
    <footer className="bg-[#333338] text-gray-300 mt-12">
      {/* Newsletter / Stay Updated Section */}
      <div className="bg-[#1a1a1c] border-b border-gray-700">
        <div className="container mx-auto px-4 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-white">book&watch</h3>
              <p className="text-sm text-gray-400 mt-1">
                Get the latest movie releases, events, and exclusive offers
              </p>
            </div>

            <div className="w-full md:w-auto flex-1 max-w-md">
              <form className="flex gap-2">
                <input
                  aria-label="Email address"
                  className="flex-1 rounded-md px-4 py-2 text-sm bg-[#2a2a2e] text-gray-300 placeholder:text-gray-500 border border-gray-600 focus:outline-none focus:border-gray-500"
                  placeholder="Enter your email address"
                  type="email"
                />
                <button
                  type="submit"
                  className="shrink-0 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Column Links Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 text-xs">
          {/* Column 1: MOVIES */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">MOVIES</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Now Showing</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Coming Soon</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Movies by Genre</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Movies by Language</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Top Cities</Link></li>
            </ul>
          </div>

          {/* Column 2: ENTERTAINMENT */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">ENTERTAINMENT</h4>
            <ul className="space-y-2">
              <li><Link to="/events/list" className="text-gray-300 hover:text-white transition-colors">Live Events</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Plays & Theatre</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Sports Events</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Activities</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Stream Online</Link></li>
            </ul>
          </div>

          {/* Column 3: QUICK LINKS */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">QUICK LINKS</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faqs" className="text-gray-300 hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/careers" className="text-gray-300 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/gift-cards" className="text-gray-300 hover:text-white transition-colors">Gift Cards</Link></li>
            </ul>
          </div>

          {/* Column 4: CONTACT */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">CONTACT</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href="mailto:support@bookwatch.com" className="text-gray-300 hover:text-white transition-colors">
                  support@bookwatch.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href="tel:+911800123456" className="text-gray-300 hover:text-white transition-colors">
                  +91 1800-123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">24/7 Customer Support</span>
              </li>
            </ul>
          </div>

          {/* Column 5: DOWNLOAD APP */}
          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">DOWNLOAD APP</h4>
            <div className="flex flex-col gap-3">
              <a 
                href="#" 
                className="inline-block rounded-md border border-gray-600 px-3 py-2 bg-[#2a2a2e] hover:bg-[#3a3a3e] text-sm text-gray-300 transition-colors"
              >
                App Store
              </a>
              <a 
                href="#" 
                className="inline-block rounded-md border border-gray-600 px-3 py-2 bg-[#2a2a2e] hover:bg-[#3a3a3e] text-sm text-gray-300 transition-colors"
              >
                Google Play
              </a>
              <div className="flex items-center gap-3 mt-3">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Facebook"
                  className="p-2 rounded-full bg-[#2a2a2e] hover:bg-[#3a3a3e] transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Twitter"
                  className="p-2 rounded-full bg-[#2a2a2e] hover:bg-[#3a3a3e] transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="Instagram"
                  className="p-2 rounded-full bg-[#2a2a2e] hover:bg-[#3a3a3e] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label="YouTube"
                  className="p-2 rounded-full bg-[#2a2a2e] hover:bg-[#3a3a3e] transition-colors"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-white mr-2">WE ACCEPT</span>
            <Badge variant="secondary" className="bg-[#2a2a2e] text-gray-300 border-gray-600 hover:bg-[#2a2a2e] cursor-default">VISA</Badge>
            <Badge variant="secondary" className="bg-[#2a2a2e] text-gray-300 border-gray-600 hover:bg-[#2a2a2e] cursor-default">MASTERCARD</Badge>
            <Badge variant="secondary" className="bg-[#2a2a2e] text-gray-300 border-gray-600 hover:bg-[#2a2a2e] cursor-default">AMEX</Badge>
            <Badge variant="secondary" className="bg-[#2a2a2e] text-gray-300 border-gray-600 hover:bg-[#2a2a2e] cursor-default">PAYPAL</Badge>
            <Badge variant="secondary" className="bg-[#2a2a2e] text-gray-300 border-gray-600 hover:bg-[#2a2a2e] cursor-default">UPI</Badge>
            <Badge variant="secondary" className="bg-[#2a2a2e] text-gray-300 border-gray-600 hover:bg-[#2a2a2e] cursor-default">NET BANKING</Badge>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="bg-[#2a2a2e] border-t border-gray-700">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-gray-400">
            © {new Date().getFullYear()} Book&Watch. All Rights Reserved.
          </div>

          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms & Conditions</Link>
            <Link to="/cookie" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link>
            <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
