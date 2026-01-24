import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-lg text-white">BL</span>
              </div>
              <span className="font-heading font-semibold text-xl text-white">Build Launch</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md mb-4">
              The trusted renovation marketplace for homeowners in Mississauga, Toronto, and Brampton. 
              Connect with verified contractors through our secure escrow payment system.
            </p>
            <div className="flex flex-col gap-2">
              <a href="tel:416-697-1728" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors" data-testid="footer-phone">
                <Phone className="w-4 h-4" />
                <span className="font-mono">416-697-1728</span>
              </a>
              <a href="mailto:info@buildlaunch.ca" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@buildlaunch.ca</span>
              </a>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Serving GTA: Mississauga, Toronto, Brampton</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/browse-jobs" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Become a Contractor
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Kitchen Renovation</li>
              <li>Bathroom Renovation</li>
              <li>Basement Finishing</li>
              <li>General Contracting</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Build Launch. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Secure Escrow Payments</span>
            <span className="text-primary">•</span>
            <span>10% Platform Fee</span>
            <span className="text-primary">•</span>
            <span>Free for Contractors to Bid</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
