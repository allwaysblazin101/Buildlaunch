import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth, API } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { ArrowRight, MapPin, DollarSign, Calendar } from 'lucide-react';

const PostJob = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    budget_min: '',
    budget_max: '',
    start_date: '',
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const [catRes, locRes] = await Promise.all([
        axios.get(`${API}/categories`),
        axios.get(`${API}/locations`)
      ]);
      setCategories(catRes.data.categories);
      setLocations(locRes.data.locations);
    } catch (error) {
      console.error('Failed to fetch options');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseFloat(formData.budget_min) > parseFloat(formData.budget_max)) {
      toast.error('Minimum budget cannot be greater than maximum budget');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API}/jobs`, {
        ...formData,
        budget_min: parseFloat(formData.budget_min),
        budget_max: parseFloat(formData.budget_max),
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Job posted successfully!');
      navigate(`/jobs/${response.data.id}`);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="bg-card border-white/10">
          <CardHeader>
            <CardTitle className="font-heading text-2xl" data-testid="post-job-title">Post a Renovation Job</CardTitle>
            <CardDescription>
              Describe your project to receive bids from verified contractors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Kitchen Renovation in Mississauga"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="bg-background border-input"
                  data-testid="job-title-input"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your renovation project in detail. Include scope of work, materials preferences, and any specific requirements..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={5}
                  className="bg-background border-input resize-none"
                  data-testid="job-description-input"
                />
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
                    required
                  >
                    <SelectTrigger className="bg-background border-input" data-testid="job-location-select">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger className="bg-background border-input" data-testid="job-category-select">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label>Budget Range (CAD)</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.budget_min}
                      onChange={(e) => setFormData({ ...formData, budget_min: e.target.value })}
                      required
                      min="0"
                      className="bg-background border-input pl-9"
                      data-testid="job-budget-min-input"
                    />
                  </div>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.budget_max}
                      onChange={(e) => setFormData({ ...formData, budget_max: e.target.value })}
                      required
                      min="0"
                      className="bg-background border-input pl-9"
                      data-testid="job-budget-max-input"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  The maximum budget will be held in escrow once funded
                </p>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="start_date">Preferred Start Date (Optional)</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="bg-background border-input pl-9"
                    data-testid="job-start-date-input"
                  />
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
                <h4 className="font-heading font-semibold text-white mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Your job will be visible to verified contractors</li>
                  <li>• Contractors can submit bids for free</li>
                  <li>• You'll need to fund escrow before accepting a bid</li>
                  <li>• Build Launch charges 10% platform fee on completion</li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full glow-blue" 
                disabled={loading}
                data-testid="submit-job-btn"
              >
                {loading ? 'Posting Job...' : 'Post Job'}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PostJob;
