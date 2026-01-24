import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Home, Search, Phone, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo size="large" />
        </div>

        {/* 404 */}
        <div className="relative mb-8">
          <h1 className="text-[150px] font-heading font-bold text-white/5 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Oops!
            </span>
          </div>
        </div>

        {/* Message */}
        <h2 className="font-heading text-2xl font-semibold text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link to="/">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <Link to="/browse-jobs">
            <Button variant="outline" className="w-full sm:w-auto border-white/20">
              <Search className="w-4 h-4 mr-2" />
              Browse Jobs
            </Button>
          </Link>
        </div>

        {/* Help */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-muted-foreground text-sm mb-2">Need help?</p>
          <a 
            href="tel:416-697-1728" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            data-testid="404-phone"
          >
            <Phone className="w-4 h-4" />
            <span className="font-mono">416-697-1728</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
