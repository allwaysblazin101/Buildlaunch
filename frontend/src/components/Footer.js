import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-card/50 border-t border-white/5 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Logo size="default" />
            <p className="text-muted-foreground text-sm max-w-md mt-4 leading-relaxed">
              The trusted renovation marketplace for homeowners in Mississauga, Toronto, and Brampton. 
              Connect with verified contractors through our secure escrow payment system.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <a href="tel:416-697-1728" className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors group" data-testid="footer-phone">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-cyan-500/30 transition-colors">
                  <Phone className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <span className="font-mono text-lg font-medium">416-697-1728</span>
                  <p className="text-xs text-muted-foreground">Call us anytime</p>
                </div>
              </a>
              <a href="mailto:info@buildlaunch.ca" className="flex items-center gap-3 text-muted-foreground hover:text-white transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <span>info@buildlaunch.ca</span>
              </a>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <span>Serving GTA: Mississauga, Toronto, Brampton</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Browse Jobs', to: '/browse-jobs' },
                { label: 'Post a Job', to: '/register' },
                { label: 'Become a Contractor', to: '/register' },
                { label: 'About Us', to: '/about' },
                { label: 'FAQ', to: '/faq' },
                { label: 'Contact Us', to: '/contact' },
              ].map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-muted-foreground hover:text-white transition-colors text-sm flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-white transition-colors cursor-default">Kitchen Renovation</li>
              <li className="hover:text-white transition-colors cursor-default">Bathroom Renovation</li>
              <li className="hover:text-white transition-colors cursor-default">Basement Finishing</li>
              <li className="hover:text-white transition-colors cursor-default">General Contracting</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Build Launch. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Secure Escrow</span>
            </div>
            <span className="text-white/20">|</span>
            <span className="text-muted-foreground">10% Platform Fee</span>
            <span className="text-white/20">|</span>
            <span className="text-cyan-400">Free to Bid</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
