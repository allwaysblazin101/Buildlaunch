import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { 
  Plus, Briefcase, DollarSign, Clock, MapPin, 
  Users, CheckCircle, AlertCircle, Eye 
} from 'lucide-react';

const HomeownerDashboard = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, statsRes] = await Promise.all([
        axios.get(`${API}/jobs/my-jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API}/stats/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setJobs(jobsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      in_escrow: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      awarded: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      in_progress: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filterJobs = (status) => {
    if (status === 'all') return jobs;
    if (status === 'active') return jobs.filter(j => ['open', 'in_escrow', 'awarded'].includes(j.status));
    return jobs.filter(j => j.status === status);
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
            <h1 className="font-heading text-3xl font-bold text-white" data-testid="homeowner-dashboard-title">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-muted-foreground mt-1">Manage your renovation projects</p>
          </div>
          <Link to="/post-job">
            <Button className="glow-blue" data-testid="post-job-btn">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
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
                    <Briefcase className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-white">{stats.total_jobs}</p>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-orange-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-white">{stats.active_jobs}</p>
                    <p className="text-sm text-muted-foreground">Active Jobs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-heading font-bold text-white">{stats.completed_jobs}</p>
                    <p className="text-sm text-muted-foreground">Completed</p>
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
                      ${stats.total_spent?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Jobs Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-card border border-white/10">
            <TabsTrigger value="all" data-testid="tab-all-jobs">All Jobs</TabsTrigger>
            <TabsTrigger value="active" data-testid="tab-active-jobs">Active</TabsTrigger>
            <TabsTrigger value="completed" data-testid="tab-completed-jobs">Completed</TabsTrigger>
          </TabsList>

          {['all', 'active', 'completed'].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-4">
              {filterJobs(tab).length === 0 ? (
                <Card className="bg-card border-white/10">
                  <CardContent className="p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-heading text-lg font-semibold text-white mb-2">
                      No jobs found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {tab === 'all' 
                        ? "You haven't posted any jobs yet." 
                        : `No ${tab} jobs at the moment.`}
                    </p>
                    {tab === 'all' && (
                      <Link to="/post-job">
                        <Button className="glow-blue">
                          <Plus className="w-4 h-4 mr-2" />
                          Post Your First Job
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {filterJobs(tab).map((job) => (
                    <Card 
                      key={job.id} 
                      className="bg-card border-white/10 hover:border-primary/30 transition-colors"
                      data-testid={`job-card-${job.id}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-heading text-lg font-semibold text-white">
                                {job.title}
                              </h3>
                              <Badge className={getStatusColor(job.status)}>
                                {formatStatus(job.status)}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {job.bid_count} bids
                              </span>
                              {job.escrow_amount && (
                                <span className="flex items-center gap-1 text-emerald-400">
                                  <CheckCircle className="w-4 h-4" />
                                  ${job.escrow_amount.toLocaleString()} in escrow
                                </span>
                              )}
                            </div>
                          </div>
                          <Link to={`/jobs/${job.id}`}>
                            <Button variant="outline" data-testid={`view-job-${job.id}`}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default HomeownerDashboard;
