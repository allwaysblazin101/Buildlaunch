import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { Shield, DollarSign, Users, CheckCircle, ArrowRight, Star, MapPin, Clock, X } from 'lucide-react';

const Landing = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const stats = [
    { value: '500+', label: 'Jobs Completed' },
    { value: '150+', label: 'Verified Contractors' },
    { value: '$2M+', label: 'Secured in Escrow' },
    { value: '4.8', label: 'Average Rating' },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Post Your Job',
      description: 'Describe your renovation project, set your budget, and choose your location in the GTA.',
      icon: <Users className="w-6 h-6" />,
    },
    {
      step: '02',
      title: 'Fund Escrow',
      description: 'Pay securely into our escrow system. Your money is protected until the job is complete.',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      step: '03',
      title: 'Choose Contractor',
      description: 'Review bids from verified contractors. Select the best fit for your project.',
      icon: <CheckCircle className="w-6 h-6" />,
    },
    {
      step: '04',
      title: 'Release Payment',
      description: 'Once satisfied with the work, release payment. Contractor receives funds minus 10% fee.',
      icon: <DollarSign className="w-6 h-6" />,
    },
  ];

  const categories = [
    'Kitchen Renovation', 'Bathroom Renovation', 'Basement Finishing',
    'Flooring', 'Painting', 'Roofing', 'Plumbing', 'Electrical',
    'HVAC', 'Windows & Doors', 'Deck & Patio', 'Landscaping'
  ];

  const galleryImages = [
    {
      src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
      title: 'Modern Kitchen Renovation',
      location: 'Mississauga'
    },
    {
      src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80',
      title: 'Luxury Bathroom Remodel',
      location: 'Toronto'
    },
    {
      src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
      title: 'Open Concept Living',
      location: 'Brampton'
    },
    {
      src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
      title: 'Complete Home Exterior',
      location: 'Toronto'
    },
    {
      src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
      title: 'Basement Entertainment',
      location: 'Mississauga'
    },
    {
      src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
      title: 'Premium Deck Build',
      location: 'Brampton'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Mississauga',
      text: 'Build Launch made my kitchen renovation stress-free. The escrow system gave me peace of mind knowing my money was safe.',
      rating: 5,
      project: 'Kitchen Renovation'
    },
    {
      name: 'Michael T.',
      location: 'Toronto',
      text: 'As a contractor, I love that bidding is free. I only pay when I win the job. Fair and transparent system.',
      rating: 5,
      project: 'General Contracting'
    },
    {
      name: 'Jennifer L.',
      location: 'Brampton',
      text: 'Found an amazing contractor for my basement. The whole process was seamless and the results exceeded expectations.',
      rating: 5,
      project: 'Basement Finishing'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background layers */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary font-medium">Secure Escrow Payments</span>
              </div>
              
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Renovation Jobs,{' '}
                <span className="gradient-text">Secured</span> by Escrow
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                The trusted marketplace for homeowners in Mississauga, Toronto, and Brampton. 
                Post jobs, receive competitive bids, and pay securely through our escrow system.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" className="glow-blue text-lg px-8 h-14" data-testid="hero-cta-homeowner">
                    Post a Job
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14 border-white/20 hover:bg-white/5" data-testid="hero-cta-contractor">
                    Join as Contractor
                  </Button>
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap items-center gap-8 mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Secure Escrow</p>
                    <p className="text-xs text-muted-foreground">Funds protected</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Verified Contractors</p>
                    <p className="text-xs text-muted-foreground">Licensed & insured</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Free to Bid</p>
                    <p className="text-xs text-muted-foreground">No upfront fees</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image Card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl" />
                <div className="relative glass rounded-2xl p-2 animate-fade-in">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80"
                    alt="Modern renovation"
                    className="rounded-xl w-full h-80 object-cover"
                  />
                  <div className="absolute bottom-6 left-6 right-6 glass rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Recent Project</p>
                        <p className="text-sm text-muted-foreground">Kitchen Renovation • Toronto</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-secondary text-secondary" />
                        <span className="text-white font-medium">5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee */}
      <section className="py-6 bg-card/50 border-y border-white/5">
        <Marquee gradient={false} speed={40} pauseOnHover>
          <div className="flex items-center gap-16 px-8">
            {[...stats, ...stats].map((stat, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="font-heading text-4xl font-bold gradient-text">{stat.value}</span>
                <span className="text-muted-foreground text-sm">{stat.label}</span>
                <span className="text-primary/40 mx-4">◆</span>
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 section-gradient">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              How Build Launch Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our secure escrow system protects both homeowners and contractors throughout the entire project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <Card 
                key={index} 
                className="bg-card/50 border-white/5 hover:border-primary/30 transition-all duration-500 hover-lift card-glow group"
                data-testid={`how-it-works-step-${index + 1}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="font-mono text-primary/60 text-sm">{item.step}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 text-primary group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Our Work</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Project Gallery
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Browse completed renovation projects from verified contractors across the GTA
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div 
                    className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                    data-testid={`gallery-image-${index}`}
                  >
                    <img 
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <h4 className="text-white font-medium">{image.title}</h4>
                      <p className="text-white/70 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {image.location}
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-card border-white/10 p-2">
                  <img 
                    src={image.src.replace('w=600', 'w=1200')}
                    alt={image.title}
                    className="w-full rounded-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-heading text-xl text-white">{image.title}</h3>
                    <p className="text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {image.location}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/browse-jobs">
              <Button variant="outline" size="lg" className="border-white/20">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Marquee */}
      <section className="py-8 bg-primary/5 border-y border-white/5">
        <Marquee gradient={false} speed={30} direction="right">
          <div className="flex items-center gap-4 px-4">
            {[...categories, ...categories].map((cat, i) => (
              <span 
                key={i} 
                className="px-5 py-2.5 rounded-full border border-white/10 bg-card/30 text-sm text-muted-foreground whitespace-nowrap hover:border-primary/30 hover:text-white transition-colors cursor-default"
              >
                {cat}
              </span>
            ))}
          </div>
        </Marquee>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 section-gradient">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">Reviews</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-3 mb-4">
              Trusted by Homeowners & Contractors
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our community has to say about Build Launch
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-card/50 border-white/5 hover:border-primary/20 transition-all duration-300"
                data-testid={`testimonial-${index + 1}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-white/90 mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center">
                      <span className="font-heading font-semibold text-primary text-lg">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location} • {testimonial.project}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Start Your Renovation?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
            Join hundreds of homeowners who trust Build Launch for secure, 
            hassle-free renovation projects in the Greater Toronto Area.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="glow-blue text-lg px-10 h-14" data-testid="cta-get-started">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-10 h-14 border-white/20">
                Contact Us
              </Button>
            </Link>
          </div>
          <p className="mt-10 text-muted-foreground flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Most homeowners receive their first bid within 24 hours
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
