import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API } from '../App';
import Navbar from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';
import { 
  Users, Briefcase, DollarSign, Shield, CheckCircle, 
  XCircle, Eye, UserCheck, UserX, Trash2, AlertTriangle,
  TrendingUp, Clock, MapPin
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState({ transactions: [], payouts: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.user_type !== 'admin') {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchAllData();
  }, [user]);

  const fetchAllData = async () => {
    try {
      const [statsRes, usersRes, jobsRes, paymentsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/jobs`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API}/admin/payments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setJobs(jobsRes.data.jobs);
      setPayments(paymentsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyContractor = async (userId) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Contractor verified');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to verify contractor');
    }
  };

  const handleSuspendUser = async (userId, suspend) => {
    try {
      await axios.put(`${API}/admin/users/${userId}/${suspend ? 'suspend' : 'unsuspend'}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(suspend ? 'User suspended' : 'User unsuspended');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await axios.delete(`${API}/admin/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job deleted');
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="font-heading text-3xl font-bold text-white" data-testid="admin-dashboard-title">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">Manage users, jobs, and platform operations</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-white">{stats.users.total}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span>{stats.users.homeowners} Homeowners</span>
                  <span>{stats.users.contractors} Contractors</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-white">{stats.jobs.total}</p>
                    <p className="text-sm text-muted-foreground">Total Jobs</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
                  <span>{stats.jobs.open} Open</span>
                  <span>{stats.jobs.completed} Completed</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-white">{stats.bids.total}</p>
                    <p className="text-sm text-muted-foreground">Total Bids</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-bold text-white">
                      ${stats.revenue.total_platform_fees?.toLocaleString() || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Platform Revenue</p>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  ${stats.revenue.total_escrow_processed?.toLocaleString() || 0} processed
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-card border border-white/10">
            <TabsTrigger value="users" data-testid="admin-tab-users">
              <Users className="w-4 h-4 mr-2" />
              Users ({users.length})
            </TabsTrigger>
            <TabsTrigger value="jobs" data-testid="admin-tab-jobs">
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs ({jobs.length})
            </TabsTrigger>
            <TabsTrigger value="payments" data-testid="admin-tab-payments">
              <DollarSign className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage homeowners and contractors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {users.map((u) => (
                    <div 
                      key={u.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-white/5"
                      data-testid={`admin-user-${u.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                          {u.full_name?.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white">{u.full_name}</p>
                            <Badge variant="outline" className="text-xs">
                              {u.user_type}
                            </Badge>
                            {u.verified && (
                              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            {u.suspended && (
                              <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
                                Suspended
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.user_type === 'contractor' && !u.verified && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleVerifyContractor(u.id)}
                            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                          >
                            <UserCheck className="w-4 h-4 mr-1" />
                            Verify
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSuspendUser(u.id, !u.suspended)}
                          className={u.suspended ? "border-emerald-500/30 text-emerald-400" : "border-red-500/30 text-red-400"}
                        >
                          {u.suspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                  {users.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No users found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs">
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle>Job Management</CardTitle>
                <CardDescription>Monitor and manage all jobs on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {jobs.map((job) => (
                    <div 
                      key={job.id} 
                      className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-white/5"
                      data-testid={`admin-job-${job.id}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-white">{job.title}</p>
                          <Badge className={`text-xs ${
                            job.status === 'open' ? 'bg-emerald-500/20 text-emerald-400' :
                            job.status === 'in_escrow' ? 'bg-blue-500/20 text-blue-400' :
                            job.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {job.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                          <span>${job.budget_min} - ${job.budget_max}</span>
                          {job.escrow_amount && (
                            <span className="text-emerald-400">
                              ${job.escrow_amount} in escrow
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/jobs/${job.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {job.status === 'open' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteJob(job.id)}
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <p className="text-center py-8 text-muted-foreground">No jobs found</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>All escrow transactions and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-3">Recent Transactions</h4>
                    <div className="space-y-2">
                      {payments.transactions.slice(0, 10).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5">
                          <div>
                            <p className="text-sm text-white">Escrow Payment</p>
                            <p className="text-xs text-muted-foreground">Job: {tx.job_id?.slice(0, 8)}...</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-white">${tx.amount} CAD</p>
                            <Badge className={tx.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400'}>
                              {tx.payment_status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                      {payments.transactions.length === 0 && (
                        <p className="text-center py-4 text-muted-foreground">No transactions yet</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-white mb-3">Recent Payouts</h4>
                    <div className="space-y-2">
                      {payments.payouts.slice(0, 10).map((payout) => (
                        <div key={payout.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/5">
                          <div>
                            <p className="text-sm text-white">Contractor Payout</p>
                            <p className="text-xs text-muted-foreground">
                              Platform fee: ${payout.platform_fee}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-emerald-400">${payout.contractor_payout}</p>
                            <Badge className="bg-emerald-500/20 text-emerald-400">Released</Badge>
                          </div>
                        </div>
                      ))}
                      {payments.payouts.length === 0 && (
                        <p className="text-center py-4 text-muted-foreground">No payouts yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
