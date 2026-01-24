import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API } from '../App';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import { Shield, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/admin-login`, formData);
      localStorage.setItem('token', response.data.token);
      
      // Update auth context
      window.location.href = '/admin';
    } catch (error) {
      const detail = error.response?.data?.detail;
      if (detail?.includes('Too many')) {
        toast.error('Account locked. Please wait 5 minutes.');
      } else {
        toast.error('Invalid admin credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Logo size="large" />
          <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400 font-medium">Admin Access</span>
          </div>
        </div>

        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-center">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Secure access to the Build Launch admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@buildlaunch.ca"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-background border-input"
                  data-testid="admin-email-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="bg-background border-input pr-10"
                    data-testid="admin-password-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                  <div className="text-xs text-amber-200/80">
                    <p className="font-medium text-amber-400 mb-1">Security Notice</p>
                    <p>This area is restricted to authorized personnel only. All access attempts are logged.</p>
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 hover:from-amber-500 hover:to-orange-400" 
                disabled={loading}
                data-testid="admin-login-btn"
              >
                {loading ? 'Authenticating...' : 'Access Admin Panel'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Not an admin?{' '}
          <a href="/login" className="text-primary hover:underline">
            Regular login
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
