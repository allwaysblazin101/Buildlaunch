import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  User, Star, MapPin, CheckCircle, Shield, Clock, 
  Briefcase, MessageSquare, Phone, Award, Calendar
} from 'lucide-react';

const ContractorProfile = () => {
  const { contractorId } = useParams();
  const [contractor, setContractor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContractorData();
  }, [contractorId]);

  const fetchContractorData = async () => {
    try {
      const [profileRes, reviewsRes] = await Promise.all([
        axios.get(`${API}/contractors/${contractorId}`),
        axios.get(`${API}/reviews/contractor/${contractorId}`)
      ]);
      setContractor(profileRes.data);
      setReviews(reviewsRes.data.reviews || []);
    } catch (error) {
      console.error('Failed to load contractor profile');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star 
        key={i} 
        className={`w-5 h-5 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-heading font-bold text-white mb-2">Contractor Not Found</h2>
            <p className="text-muted-foreground mb-4">This profile doesn't exist or has been removed.</p>
            <Link to="/browse-jobs">
              <Button>Browse Jobs</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="bg-card border-white/10 mb-6 overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600" />
          <CardContent className="relative pt-0 pb-6 px-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-4xl font-bold border-4 border-background shadow-xl">
                {contractor.full_name?.charAt(0)}
              </div>
              
              {/* Info */}
              <div className="flex-1 pt-4 md:pt-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="font-heading text-2xl font-bold text-white" data-testid="contractor-name">
                    {contractor.full_name}
                  </h1>
                  {contractor.verified && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                
                {contractor.verification?.company_name && (
                  <p className="text-muted-foreground mb-3">{contractor.verification.company_name}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    {renderStars(Math.round(contractor.average_rating || 0))}
                    <span className="ml-1 text-white font-medium">{contractor.average_rating?.toFixed(1) || 'N/A'}</span>
                    <span className="text-muted-foreground">({contractor.total_reviews || 0} reviews)</span>
                  </div>
                  <span className="text-white/20">|</span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Briefcase className="w-4 h-4" />
                    {contractor.completed_jobs || 0} jobs completed
                  </span>
                </div>
              </div>

              {/* Contact Button */}
              <Link to={`/messages/${contractor.id}`}>
                <Button className="bg-gradient-to-r from-blue-600 to-cyan-500">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            {contractor.verification && (
              <Card className="bg-card border-white/10">
                <CardHeader>
                  <CardTitle className="font-heading text-lg">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contractor.verification.specialties?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-white mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {contractor.verification.specialties.map((specialty, index) => (
                          <Badge key={index} variant="outline" className="border-white/20">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {contractor.verification.years_experience && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{contractor.verification.years_experience} years of experience</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Reviews ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No reviews yet</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-lg bg-background/50 border border-white/5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{review.homeowner_name}</p>
                              <div className="flex items-center gap-1">
                                {renderStars(review.rating)}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-white/80 text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Details */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {contractor.verified ? (
                  <>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Licensed Contractor</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Insurance Verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Identity Confirmed</span>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    This contractor has not completed verification yet.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Jobs Completed</span>
                  <span className="font-medium text-white">{contractor.completed_jobs || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average Rating</span>
                  <span className="font-medium text-white flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {contractor.average_rating?.toFixed(1) || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Reviews</span>
                  <span className="font-medium text-white">{contractor.total_reviews || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium text-white">
                    {new Date(contractor.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-white/10">
              <CardContent className="p-6">
                <h4 className="font-heading font-semibold text-white mb-4">Need Help?</h4>
                <p className="text-muted-foreground text-sm mb-4">
                  Contact Build Launch support for any questions about this contractor.
                </p>
                <a 
                  href="tel:416-697-1728" 
                  className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                  data-testid="contractor-profile-phone"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-mono">416-697-1728</span>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContractorProfile;
