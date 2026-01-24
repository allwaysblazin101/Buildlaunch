import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { 
  Briefcase, DollarSign, Star, MapPin, 
  CheckCircle, AlertCircle, Eye, TrendingUp, Award
} from 'lucide-react';

const ContractorDashboard = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [bids, setBids] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, bidsRes, statsRes] = await Promise.all([
        axios.get(`${API}/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/bids/my-bids`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/stats/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setJobs(jobsRes.data);
      setBids(bidsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      accepted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-white" data-testid="contractor-dashboard-title">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.verified ? (
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  Verified Contractor
                </span>
              ) : (
                <Link to="/profile" className="text-secondary hover:underline">
                  Complete verification to start bidding →
                </Link>
              )}
            </p>
          </div>
          <Link to="/browse-jobs">
            <Button className="glow-blue" data-testid="browse-jobs-btn">
              <Briefcase className="w-4 h-4 mr-2" />
              Browse All Jobs
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-primary/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-white">{stats.total_bids}</p>
                    <p className="text-sm text-muted-foreground">Total Bids</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-white">{stats.accepted_bids}</p>
                    <p className="text-sm text-muted-foreground">Jobs Won</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-green-500/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-white">
                      ${stats.total_earnings?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Earnings</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-yellow-500/20 flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-white">
                      {stats.average_rating?.toFixed(1) || 'N/A'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Rating ({stats.total_reviews || 0} reviews)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs defaultValue="available" className="space-y-4">
          <TabsList className="bg-card border border-white/10">
            <TabsTrigger value="available" data-testid="tab-available-jobs">Available Jobs</TabsTrigger>
            <TabsTrigger value="my-bids" data-testid="tab-my-bids">My Bids</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            {jobs.length === 0 ? (
              <Card className="bg-card border-white/10">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-white mb-2">
                    No available jobs
                  </h3>
                  <p className="text-muted-foreground">
                    Check back later for new renovation opportunities.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {jobs.slice(0, 5).map((job) => (
                  <Card 
                    key={job.id} 
                    className="bg-card border-white/10 hover:border-primary/30 transition-colors"
                    data-testid={`available-job-${job.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading text-lg font-semibold text-white">
                              {job.title}
                            </h3>
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                              {job.category}
                            </Badge>
                            {job.status === 'in_escrow' && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Funded
                              </Badge>
                            )}
                          </div>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {job.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <Link to={`/jobs/${job.id}`}>
                          <Button variant="outline" data-testid={`view-available-job-${job.id}`}>
                            <Eye className="w-4 h-4 mr-2" />
                            View & Bid
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {jobs.length > 5 && (
                  <div className="text-center">
                    <Link to="/browse-jobs">
                      <Button variant="outline">View All {jobs.length} Jobs</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="my-bids" className="space-y-4">
            {bids.length === 0 ? (
              <Card className="bg-card border-white/10">
                <CardContent className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-heading text-lg font-semibold text-white mb-2">
                    No bids yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start bidding on jobs to grow your business.
                  </p>
                  <Link to="/browse-jobs">
                    <Button className="glow-blue">Browse Available Jobs</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {bids.map((bid) => (
                  <Card 
                    key={bid.id} 
                    className="bg-card border-white/10"
                    data-testid={`bid-card-${bid.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-heading text-lg font-semibold text-white">
                              {bid.job_title}
                            </h3>
                            <Badge className={getStatusColor(bid.status)}>
                              {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {bid.job_location}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              Your bid: ${bid.amount.toLocaleString()}
                            </span>
                            <span className="text-xs">
                              {bid.estimated_days} days estimated
                            </span>
                          </div>
                        </div>
                        <Link to={`/jobs/${bid.job_id}`}>
                          <Button variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            View Job
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ContractorDashboard;
