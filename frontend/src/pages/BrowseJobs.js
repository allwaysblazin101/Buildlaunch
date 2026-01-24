import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '../App';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { toast } from 'sonner';
import { 
  MapPin, DollarSign, Search, Filter, SlidersHorizontal,
  CheckCircle, Users, Eye, AlertCircle, X, Star, Clock
} from 'lucide-react';

const BrowseJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    category: '',
    search: '',
    minBudget: 0,
    maxBudget: 100000,
    status: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchOptions();
    fetchJobs();
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

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.location) params.append('location', filters.location);
      if (filters.category) params.append('category', filters.category);
      if (filters.status) params.append('status', filters.status);
      if (filters.minBudget > 0) params.append('min_budget', filters.minBudget);
      if (filters.maxBudget < 100000) params.append('max_budget', filters.maxBudget);

      const response = await axios.get(`${API}/jobs?${params.toString()}`);
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchJobs();
    }, 300);
    return () => clearTimeout(debounce);
  }, [filters.location, filters.category, filters.status, filters.minBudget, filters.maxBudget]);

  const filteredAndSortedJobs = React.useMemo(() => {
    let result = [...jobs];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower) ||
        job.category.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'budget_high':
        result.sort((a, b) => b.budget_max - a.budget_max);
        break;
      case 'budget_low':
        result.sort((a, b) => a.budget_min - b.budget_min);
        break;
      case 'most_bids':
        result.sort((a, b) => (b.bid_count || 0) - (a.bid_count || 0));
        break;
      default:
        break;
    }

    return result;
  }, [jobs, filters.search, filters.sortBy]);

  const clearFilters = () => {
    setFilters({
      location: '',
      category: '',
      search: '',
      minBudget: 0,
      maxBudget: 100000,
      status: '',
      sortBy: 'newest',
    });
  };

  const activeFilterCount = [
    filters.location,
    filters.category,
    filters.status,
    filters.minBudget > 0,
    filters.maxBudget < 100000,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold text-white mb-2" data-testid="browse-jobs-title">
            Browse Renovation Jobs
          </h1>
          <p className="text-muted-foreground">
            Find renovation projects in Mississauga, Toronto, and Brampton
          </p>
        </div>

        {/* Search and Filter Bar */}
        <Card className="bg-card border-white/10 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, description, or category..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="pl-9 bg-background border-input"
                  data-testid="search-input"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.location || "all"}
                  onValueChange={(value) => setFilters({ ...filters, location: value === "all" ? "" : value })}
                >
                  <SelectTrigger className="w-40 bg-background border-input" data-testid="location-filter">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) => setFilters({ ...filters, category: value === "all" ? "" : value })}
                >
                  <SelectTrigger className="w-44 bg-background border-input" data-testid="category-filter">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                >
                  <SelectTrigger className="w-40 bg-background border-input" data-testid="sort-filter">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="budget_high">Highest Budget</SelectItem>
                    <SelectItem value="budget_low">Lowest Budget</SelectItem>
                    <SelectItem value="most_bids">Most Bids</SelectItem>
                  </SelectContent>
                </Select>

                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`border-input ${showFilters ? 'bg-primary/10 border-primary/30' : ''}`}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-primary text-white">{activeFilterCount}</Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-white/10 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Budget Range */}
                  <div className="space-y-3">
                    <Label className="text-sm">Budget Range (CAD)</Label>
                    <div className="px-2">
                      <Slider
                        value={[filters.minBudget, filters.maxBudget]}
                        onValueChange={([min, max]) => setFilters({ ...filters, minBudget: min, maxBudget: max })}
                        min={0}
                        max={100000}
                        step={1000}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${filters.minBudget.toLocaleString()}</span>
                      <span>${filters.maxBudget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-3">
                    <Label className="text-sm">Job Status</Label>
                    <Select
                      value={filters.status || "all"}
                      onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? "" : value })}
                    >
                      <SelectTrigger className="bg-background border-input">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="open">Open (Accepting Bids)</SelectItem>
                        <SelectItem value="in_escrow">Funded (Ready to Award)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <Button 
                      variant="ghost" 
                      onClick={clearFilters}
                      className="text-muted-foreground hover:text-white"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted-foreground">
            <span className="text-white font-medium">{filteredAndSortedJobs.length}</span> job{filteredAndSortedJobs.length !== 1 ? 's' : ''} found
          </p>
          {activeFilterCount > 0 && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear filters
            </Button>
          )}
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredAndSortedJobs.length === 0 ? (
          <Card className="bg-card border-white/10">
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-heading text-lg font-semibold text-white mb-2">
                No jobs found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or check back later for new opportunities.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAndSortedJobs.map((job) => (
              <Card 
                key={job.id} 
                className="bg-card border-white/10 hover:border-primary/30 transition-all duration-300 hover-lift group"
                data-testid={`job-card-${job.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-heading text-lg font-semibold text-white group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                          {job.category}
                        </Badge>
                        {job.status === 'in_escrow' && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Funded
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-white font-medium">
                          <DollarSign className="w-4 h-4 text-emerald-400" />
                          ${job.budget_min.toLocaleString()} - ${job.budget_max.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Users className="w-4 h-4" />
                          {job.bid_count || 0} bid{(job.bid_count || 0) !== 1 ? 's' : ''}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {job.images && job.images.length > 0 && (
                        <div className="hidden sm:flex -space-x-2">
                          {job.images.slice(0, 3).map((img, i) => (
                            <div key={i} className="w-10 h-10 rounded-lg border-2 border-card overflow-hidden">
                              <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {job.images.length > 3 && (
                            <div className="w-10 h-10 rounded-lg border-2 border-card bg-white/10 flex items-center justify-center text-xs text-white">
                              +{job.images.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                      <Link to={`/jobs/${job.id}`}>
                        <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400" data-testid={`view-job-btn-${job.id}`}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default BrowseJobs;
