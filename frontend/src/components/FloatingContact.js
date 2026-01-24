import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, X, Mail, HelpCircle } from 'lucide-react';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Expanded Menu */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-64 bg-card border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-fade-in mb-2">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-cyan-500">
            <h4 className="font-heading font-semibold text-white">Need Help?</h4>
            <p className="text-white/80 text-sm">We're here to assist you</p>
          </div>
          <div className="p-2">
            <a 
              href="tel:416-697-1728" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
              data-testid="floating-phone"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Call Us</p>
                <p className="text-cyan-400 font-mono text-sm">416-697-1728</p>
              </div>
            </a>
            <a 
              href="mailto:info@buildlaunch.ca" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Mail className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Email Us</p>
                <p className="text-muted-foreground text-xs">info@buildlaunch.ca</p>
              </div>
            </a>
            <Link 
              to="/contact" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center group-hover:bg-violet-500/30 transition-colors">
                <MessageCircle className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">Contact Form</p>
                <p className="text-muted-foreground text-xs">Send us a message</p>
              </div>
            </Link>
            <Link 
              to="/faq" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center group-hover:bg-amber-500/30 transition-colors">
                <HelpCircle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-white text-sm">FAQ</p>
                <p className="text-muted-foreground text-xs">Common questions</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          isOpen 
            ? 'bg-white/10 rotate-90' 
            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110'
        }`}
        data-testid="floating-contact-btn"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Phone className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Pulse animation when closed */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
      )}
    </div>
  );
};

export default FloatingContact;
