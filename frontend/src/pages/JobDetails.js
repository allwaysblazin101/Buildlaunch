import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { toast } from 'sonner';
import { 
  MapPin, DollarSign, Calendar, User, Clock, 
  CheckCircle, Shield, Send, MessageSquare, Star,
  AlertCircle, Lock, Unlock, Image, ChevronLeft, ChevronRight
} from 'lucide-react';

const JobDetails = () => {
  const { jobId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bidDialogOpen, setBidDialogOpen] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [bidForm, setBidForm] = useState({
    amount: '',
    message: '',
    estimated_days: '',
  });

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const jobRes = await axios.get(`${API}/jobs/${jobId}`);
      setJob(jobRes.data);

      if (user && token) {
        try {
          const bidsRes = await axios.get(`${API}/jobs/${jobId}/bids`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBids(bidsRes.data);
        } catch (err) {
          // User might not have access to bids
        }
      }
    } catch (error) {
      toast.error('Job not found');
      navigate('/browse-jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    setSubmittingBid(true);

    try {
      await axios.post(`${API}/jobs/${jobId}/bids`, {
        amount: parseFloat(bidForm.amount),
        message: bidForm.message,
        estimated_days: parseInt(bidForm.estimated_days),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Bid submitted successfully!');
      setBidDialogOpen(false);
      setBidForm({ amount: '', message: '', estimated_days: '' });
      fetchJobDetails();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit bid');
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleFundEscrow = async () => {
    setProcessingPayment(true);
    try {
      const response = await axios.post(`${API}/payments/escrow/create`, {
        job_id: jobId,
        origin_url: window.location.origin
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      window.location.href = response.data.checkout_url;
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to create payment');
      setProcessingPayment(false);
    }
  };

  const handleAcceptBid = async (bidId) => {
    try {
      await axios.put(`${API}/bids/${bidId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Bid accepted! The job has been awarded.');
      fetchJobDetails();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to accept bid');
    }
  };

  const handleReleasePayment = async () => {
    try {
      const response = await axios.post(`${API}/payments/release`, {
        job_id: jobId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(`Payment released! Contractor receives $${response.data.contractor_payout.toLocaleString()}`);
      fetchJobDetails();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to release payment');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      in_escrow: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      awarded: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const isOwner = user && job && user.id === job.homeowner_id;
  const isContractor = user && user.user_type === 'contractor';
  const hasAlreadyBid = bids.some(b => b.contractor_id === user?.id);
  const canBid = isContractor && user?.verified && ['open', 'in_escrow'].includes(job?.status) && !hasAlreadyBid;

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

  if (!job) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Info Card */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="font-heading text-2xl" data-testid="job-title">
                      {job.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(job.status)} data-testid="job-status">
                    {formatStatus(job.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo Gallery */}
                {job.images && job.images.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-heading font-semibold text-white flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      Project Photos
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {job.images.map((img, index) => (
                        <Dialog key={index} open={imageModalOpen && selectedImageIndex === index} onOpenChange={(open) => {
                          setImageModalOpen(open);
                          if (open) setSelectedImageIndex(index);
                        }}>
                          <DialogTrigger asChild>
                            <div 
                              className="aspect-square rounded-lg overflow-hidden cursor-pointer group"
                              data-testid={`job-image-${index}`}
                            >
                              <img 
                                src={img}
                                alt={`Project ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl bg-card border-white/10 p-2">
                            <div className="relative">
                              <img 
                                src={img.replace('w=400', 'w=1200')}
                                alt={`Project ${index + 1}`}
                                className="w-full rounded-lg"
                              />
                              {job.images.length > 1 && (
                                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-black/50 hover:bg-black/70 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImageIndex((prev) => (prev - 1 + job.images.length) % job.images.length);
                                    }}
                                  >
                                    <ChevronLeft className="w-6 h-6" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="bg-black/50 hover:bg-black/70 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedImageIndex((prev) => (prev + 1) % job.images.length);
                                    }}
                                  >
                                    <ChevronRight className="w-6 h-6" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="text-center text-sm text-muted-foreground mt-2">
                              {selectedImageIndex + 1} of {job.images.length}
                            </div>
                          </DialogContent>
                        </Dialog>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-heading font-semibold text-white mb-2">Description</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap" data-testid="job-description">
                    {job.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-medium text-white">{job.category}</p>
                  </div>
                  <div className="bg-background rounded-lg p-4 border border-white/10">
                    <p className="text-sm text-muted-foreground mb-1">Budget</p>
                    <p className="font-medium text-white" data-testid="job-budget">
                      ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()} CAD
                    </p>
                  </div>
                </div>

                {job.start_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Preferred start: {new Date(job.start_date).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bids Section (Visible to Owner) */}
            {isOwner && (
              <Card className="bg-card border-white/10">
                <CardHeader>
                  <CardTitle className="font-heading text-xl">
                    Bids ({bids.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bids.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No bids yet. Contractors will start bidding soon.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bids.map((bid) => (
                        <div 
                          key={bid.id} 
                          className="bg-background rounded-md p-4 border border-white/10"
                          data-testid={`bid-${bid.id}`}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                  <User className="w-4 h-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium text-white">{bid.contractor_name}</p>
                                  {bid.contractor_verified && (
                                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Verified
                                    </span>
                                  )}
                                </div>
                              </div>
                              <p className="text-muted-foreground text-sm mb-3">{bid.message}</p>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="text-white font-medium">
                                  <DollarSign className="w-4 h-4 inline" />
                                  {bid.amount.toLocaleString()} CAD
                                </span>
                                <span className="text-muted-foreground">
                                  <Clock className="w-4 h-4 inline mr-1" />
                                  {bid.estimated_days} days
                                </span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              {bid.status === 'pending' && job.status === 'in_escrow' && (
                                <Button 
                                  size="sm" 
                                  className="glow-blue"
                                  onClick={() => handleAcceptBid(bid.id)}
                                  data-testid={`accept-bid-${bid.id}`}
                                >
                                  Accept Bid
                                </Button>
                              )}
                              {bid.status === 'pending' && job.status === 'open' && (
                                <p className="text-xs text-muted-foreground">Fund escrow to accept</p>
                              )}
                              {bid.status === 'accepted' && (
                                <Badge className="bg-emerald-500/20 text-emerald-400">Accepted</Badge>
                              )}
                              <Link to={`/messages/${bid.contractor_id}`}>
                                <Button size="sm" variant="outline">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Message
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Posted By Card */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-heading text-lg">Posted By</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-white">{job.homeowner_name}</p>
                    <p className="text-sm text-muted-foreground">Homeowner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Escrow Status Card */}
            <Card className="bg-card border-white/10">
              <CardHeader>
                <CardTitle className="font-heading text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Escrow Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {job.escrow_amount ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Lock className="w-5 h-5" />
                      <span className="font-medium">Funds Secured</span>
                    </div>
                    <p className="text-2xl font-heading font-bold text-white">
                      ${job.escrow_amount.toLocaleString()} CAD
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Funds are held securely until job completion
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Unlock className="w-5 h-5" />
                      <span>Not Yet Funded</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Homeowner needs to fund escrow before accepting bids
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Card */}
            <Card className="bg-card border-white/10">
              <CardContent className="p-6">
                {/* Homeowner Actions */}
                {isOwner && (
                  <div className="space-y-4">
                    {job.status === 'open' && (
                      <Button 
                        className="w-full glow-blue" 
                        onClick={handleFundEscrow}
                        disabled={processingPayment}
                        data-testid="fund-escrow-btn"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        {processingPayment ? 'Processing...' : `Fund Escrow ($${job.budget_max.toLocaleString()})`}
                      </Button>
                    )}
                    {job.status === 'awarded' && (
                      <Button 
                        className="w-full bg-emerald-600 hover:bg-emerald-700" 
                        onClick={handleReleasePayment}
                        data-testid="release-payment-btn"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Release Payment
                      </Button>
                    )}
                    {job.status === 'completed' && (
                      <div className="text-center py-4">
                        <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-400 font-medium">Job Completed!</p>
                        <p className="text-sm text-muted-foreground">Payment has been released</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Contractor Actions */}
                {isContractor && (
                  <div className="space-y-4">
                    {canBid ? (
                      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="w-full glow-blue" data-testid="submit-bid-btn">
                            <Send className="w-4 h-4 mr-2" />
                            Submit Bid
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-white/10">
                          <DialogHeader>
                            <DialogTitle className="font-heading">Submit Your Bid</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmitBid} className="space-y-4">
                            <div className="space-y-2">
                              <Label>Your Bid Amount (CAD)</Label>
                              <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  placeholder="Enter your bid"
                                  value={bidForm.amount}
                                  onChange={(e) => setBidForm({ ...bidForm, amount: e.target.value })}
                                  required
                                  min="0"
                                  className="pl-9"
                                  data-testid="bid-amount-input"
                                />
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Budget: ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <Label>Estimated Days to Complete</Label>
                              <Input
                                type="number"
                                placeholder="e.g., 14"
                                value={bidForm.estimated_days}
                                onChange={(e) => setBidForm({ ...bidForm, estimated_days: e.target.value })}
                                required
                                min="1"
                                data-testid="bid-days-input"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Message to Homeowner</Label>
                              <Textarea
                                placeholder="Introduce yourself and explain why you're the best fit for this job..."
                                value={bidForm.message}
                                onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
                                required
                                rows={4}
                                data-testid="bid-message-input"
                              />
                            </div>

                            <Button 
                              type="submit" 
                              className="w-full glow-blue" 
                              disabled={submittingBid}
                              data-testid="confirm-bid-btn"
                            >
                              {submittingBid ? 'Submitting...' : 'Submit Bid'}
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                    ) : hasAlreadyBid ? (
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-primary mx-auto mb-2" />
                        <p className="text-muted-foreground">You've already submitted a bid</p>
                      </div>
                    ) : !user?.verified ? (
                      <div className="text-center py-4">
                        <AlertCircle className="w-8 h-8 text-secondary mx-auto mb-2" />
                        <p className="text-muted-foreground mb-2">Complete verification to bid</p>
                        <Link to="/profile">
                          <Button variant="outline" size="sm">Verify Account</Button>
                        </Link>
                      </div>
                    ) : null}

                    {job.homeowner_id && (
                      <Link to={`/messages/${job.homeowner_id}`}>
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Message Homeowner
                        </Button>
                      </Link>
                    )}
                  </div>
                )}

                {/* Not Logged In */}
                {!user && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">Sign in to bid on this job</p>
                    <Link to="/login">
                      <Button className="glow-blue">Sign In</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
              <h4 className="font-heading font-semibold text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Build Launch Protection
              </h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Funds held in secure escrow
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Only 10% fee on completion
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  Free to bid for contractors
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default JobDetails;
