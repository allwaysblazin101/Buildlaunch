import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API } from '../App';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [status, setStatus] = useState('checking'); // checking, success, error
  const [jobId, setJobId] = useState(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId && token) {
      checkPaymentStatus();
    } else if (!sessionId) {
      setStatus('error');
    }
  }, [sessionId, token]);

  const checkPaymentStatus = async (attempts = 0) => {
    const maxAttempts = 5;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setStatus('error');
      return;
    }

    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 'paid') {
        setStatus('success');
        setJobId(response.data.job_id);
      } else if (response.data.status === 'expired') {
        setStatus('error');
      } else {
        // Still pending, poll again
        setTimeout(() => checkPaymentStatus(attempts + 1), pollInterval);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setTimeout(() => checkPaymentStatus(attempts + 1), pollInterval);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="bg-card border-white/10 max-w-md w-full">
        <CardContent className="p-8 text-center">
          {status === 'checking' && (
            <>
              <Loader2 className="w-16 h-16 text-primary mx-auto mb-4 animate-spin" />
              <h1 className="font-heading text-2xl font-bold text-white mb-2">
                Processing Payment
              </h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your payment...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-400" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white mb-2" data-testid="payment-success-title">
                Payment Successful!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your funds are now securely held in escrow. You can now accept bids from contractors.
              </p>
              <div className="space-y-3">
                {jobId && (
                  <Link to={`/jobs/${jobId}`}>
                    <Button className="w-full glow-blue" data-testid="view-job-btn">
                      View Job & Bids
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                )}
                <Link to="/dashboard">
                  <Button variant="outline" className="w-full">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-red-400" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-white mb-2">
                Payment Issue
              </h1>
              <p className="text-muted-foreground mb-6">
                We couldn't confirm your payment. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <Link to="/dashboard">
                  <Button className="w-full" data-testid="back-to-dashboard-btn">
                    Back to Dashboard
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
