import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Menu, X, User, LogOut, MessageSquare, Settings, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardLink = () => {
    return user?.user_type === 'homeowner' ? '/dashboard' : '/contractor-dashboard';
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <span className="font-heading font-bold text-lg text-white">BL</span>
            </div>
            <span className="font-heading font-semibold text-xl text-white hidden sm:block">Build Launch</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/browse-jobs" className="text-muted-foreground hover:text-white transition-colors">
              Browse Jobs
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-white transition-colors">
              Contact
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/messages" className="text-muted-foreground hover:text-white transition-colors">
                  <MessageSquare className="w-5 h-5" />
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2" data-testid="user-menu-trigger">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">{user.full_name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardLink()} className="flex items-center gap-2 cursor-pointer" data-testid="dashboard-link">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center gap-2 cursor-pointer" data-testid="profile-link">
                        <Settings className="w-4 h-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer text-destructive" data-testid="logout-btn">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" data-testid="login-btn">Log In</Button>
                </Link>
                <Link to="/register">
                  <Button className="glow-blue" data-testid="register-btn">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 animate-fade-in">
            <div className="flex flex-col gap-4">
              <Link to="/browse-jobs" className="text-muted-foreground hover:text-white transition-colors py-2">
                Browse Jobs
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-white transition-colors py-2">
                Contact
              </Link>
              
              {user ? (
                <>
                  <Link to={getDashboardLink()} className="text-muted-foreground hover:text-white transition-colors py-2">
                    Dashboard
                  </Link>
                  <Link to="/messages" className="text-muted-foreground hover:text-white transition-colors py-2">
                    Messages
                  </Link>
                  <Link to="/profile" className="text-muted-foreground hover:text-white transition-colors py-2">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="text-destructive hover:text-destructive/80 transition-colors py-2 text-left">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to="/login">
                    <Button variant="outline" className="w-full">Log In</Button>
                  </Link>
                  <Link to="/register">
                    <Button className="w-full glow-blue">Get Started</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
