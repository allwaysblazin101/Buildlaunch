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
import { ArrowRight, MapPin, DollarSign, Calendar, ImagePlus, X, Upload } from 'lucide-react';

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
    images: [],
  });

  // Sample placeholder images for demo
  const sampleImages = [
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
  ];

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

  const handleAddSampleImage = () => {
    if (formData.images.length < 6) {
      const availableImages = sampleImages.filter(img => !formData.images.includes(img));
      if (availableImages.length > 0) {
        const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        setFormData({ ...formData, images: [...formData.images, randomImage] });
      }
    } else {
      toast.error('Maximum 6 images allowed');
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location || !formData.category) {
      toast.error('Please select location and category');
      return;
    }
    
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

              {/* Photo Gallery */}
              <div className="space-y-3">
                <Label>Project Photos (Optional)</Label>
                <p className="text-sm text-muted-foreground">
                  Add photos to help contractors understand your project better
                </p>
                
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                        <img 
                          src={img} 
                          alt={`Project ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.images.length < 6 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddSampleImage}
                    className="w-full border-dashed border-2 h-20 hover:bg-accent/50"
                    data-testid="add-image-btn"
                  >
                    <div className="flex flex-col items-center gap-1">
                      <ImagePlus className="w-6 h-6 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Add Photo ({formData.images.length}/6)
                      </span>
                    </div>
                  </Button>
                )}
              </div>

              {/* Location & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) => setFormData({ ...formData, location: value })}
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
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h4 className="font-heading font-semibold text-white mb-2">What happens next?</h4>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Your job will be visible to verified contractors
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Contractors can submit bids for free
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    You'll need to fund escrow before accepting a bid
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Build Launch charges 10% platform fee on completion
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                className="w-full glow-blue h-12" 
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
