import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth, API } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { 
  User, Shield, CheckCircle, AlertCircle, 
  Save, FileText, Building2 
} from 'lucide-react';

const Profile = () => {
  const { user, token, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
  });
  const [verificationData, setVerificationData] = useState({
    license_number: '',
    insurance_info: '',
    company_name: '',
    years_experience: '',
    specialties: '',
  });

  useEffect(() => {
    if (user?.verification) {
      setVerificationData({
        license_number: user.verification.license_number || '',
        insurance_info: user.verification.insurance_info || '',
        company_name: user.verification.company_name || '',
        years_experience: user.verification.years_experience || '',
        specialties: user.verification.specialties?.join(', ') || '',
      });
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.put(`${API}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      updateUser(response.data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...verificationData,
        years_experience: verificationData.years_experience ? parseInt(verificationData.years_experience) : null,
        specialties: verificationData.specialties ? verificationData.specialties.split(',').map(s => s.trim()) : [],
      };

      const response = await axios.put(`${API}/auth/contractor-verification`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      updateUser({ verified: response.data.verified, verification: payload });
      toast.success(response.data.verified ? 'Verification complete!' : 'Verification info saved');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update verification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-heading text-3xl font-bold text-white mb-8" data-testid="profile-title">
          Profile Settings
        </h1>

        {/* Account Info */}
        <Card className="bg-card border-white/10 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="font-heading">{user?.full_name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {user?.email}
                  <Badge variant="outline" className="ml-2">
                    {user?.user_type === 'homeowner' ? 'Homeowner' : 'Contractor'}
                  </Badge>
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="bg-background border-input"
                    data-testid="profile-name-input"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    placeholder="416-555-1234"
                    className="bg-background border-input"
                    data-testid="profile-phone-input"
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} data-testid="save-profile-btn">
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contractor Verification */}
        {user?.user_type === 'contractor' && (
          <Card className="bg-card border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-emerald-500" />
                  </div>
                  <div>
                    <CardTitle className="font-heading">Contractor Verification</CardTitle>
                    <CardDescription>
                      Verify your credentials to start bidding on jobs
                    </CardDescription>
                  </div>
                </div>
                {user?.verified ? (
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/10 border border-primary/30 rounded-md p-4 mb-6">
                <h4 className="font-medium text-white mb-2">Why verify?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Get a verified badge on your profile</li>
                  <li>• Build trust with homeowners</li>
                  <li>• Required to submit bids on jobs</li>
                </ul>
              </div>

              <form onSubmit={handleVerificationUpdate} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="license_number" className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      License Number *
                    </Label>
                    <Input
                      id="license_number"
                      value={verificationData.license_number}
                      onChange={(e) => setVerificationData({ ...verificationData, license_number: e.target.value })}
                      placeholder="e.g., ONT-123456"
                      className="bg-background border-input font-mono"
                      data-testid="license-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance_info" className="flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Insurance Policy Number *
                    </Label>
                    <Input
                      id="insurance_info"
                      value={verificationData.insurance_info}
                      onChange={(e) => setVerificationData({ ...verificationData, insurance_info: e.target.value })}
                      placeholder="e.g., INS-789012"
                      className="bg-background border-input font-mono"
                      data-testid="insurance-input"
                    />
                  </div>
                </div>

                <Separator className="bg-white/10" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name" className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company Name
                    </Label>
                    <Input
                      id="company_name"
                      value={verificationData.company_name}
                      onChange={(e) => setVerificationData({ ...verificationData, company_name: e.target.value })}
                      placeholder="Your company name"
                      className="bg-background border-input"
                      data-testid="company-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years_experience">Years of Experience</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={verificationData.years_experience}
                      onChange={(e) => setVerificationData({ ...verificationData, years_experience: e.target.value })}
                      placeholder="e.g., 10"
                      min="0"
                      className="bg-background border-input"
                      data-testid="experience-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialties">Specialties (comma-separated)</Label>
                  <Textarea
                    id="specialties"
                    value={verificationData.specialties}
                    onChange={(e) => setVerificationData({ ...verificationData, specialties: e.target.value })}
                    placeholder="e.g., Kitchen Renovation, Bathroom Remodeling, Flooring"
                    className="bg-background border-input resize-none"
                    rows={2}
                    data-testid="specialties-input"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  * Required for verification. License and Insurance information must be provided.
                </p>

                <Button type="submit" className="glow-blue" disabled={loading} data-testid="save-verification-btn">
                  <Shield className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Verification Info'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
