import React from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Shield, DollarSign, Users, CheckCircle, ArrowRight, Star, MapPin, Clock } from 'lucide-react';

const Landing = () => {
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

  const testimonials = [
    {
      name: 'Sarah M.',
      location: 'Mississauga',
      text: 'Build Launch made my kitchen renovation stress-free. The escrow system gave me peace of mind.',
      rating: 5,
    },
    {
      name: 'Michael T.',
      location: 'Toronto',
      text: 'As a contractor, I love that bidding is free. I only pay when I win the job. Fair and transparent.',
      rating: 5,
    },
    {
      name: 'Jennifer L.',
      location: 'Brampton',
      text: 'Found an amazing contractor for my basement. The whole process was seamless and secure.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1632857997897-9418428d7368?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl animate-slide-up">
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Renovation Jobs,{' '}
              <span className="text-primary">Secured</span> by Escrow
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl">
              The trusted marketplace for homeowners in Mississauga, Toronto, and Brampton. 
              Post jobs, receive bids, and pay securely through escrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button size="lg" className="glow-blue text-lg px-8" data-testid="hero-cta-homeowner">
                  Post a Job
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="text-lg px-8" data-testid="hero-cta-contractor">
                  Join as Contractor
                </Button>
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 mt-12">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>Secure Escrow</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Verified Contractors</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <DollarSign className="w-5 h-5 text-secondary" />
                <span>Free to Bid</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Marquee */}
      <section className="py-6 bg-card border-y border-white/10">
        <Marquee gradient={false} speed={40} pauseOnHover>
          <div className="flex items-center gap-12 px-6">
            {[...stats, ...stats].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-heading text-3xl font-bold text-primary">{stat.value}</span>
                <span className="text-muted-foreground">{stat.label}</span>
                <span className="text-primary mx-4">•</span>
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              How Build Launch Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our secure escrow system protects both homeowners and contractors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, index) => (
              <Card 
                key={index} 
                className="bg-card border-white/10 hover:border-primary/50 transition-all duration-300 hover-lift"
                data-testid={`how-it-works-step-${index + 1}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-primary text-sm">{item.step}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/50 to-transparent" />
                  </div>
                  <div className="w-12 h-12 rounded-md bg-primary/20 flex items-center justify-center mb-4 text-primary">
                    {item.icon}
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Marquee */}
      <section className="py-8 bg-primary/5 border-y border-white/10">
        <Marquee gradient={false} speed={30} direction="right">
          <div className="flex items-center gap-4 px-4">
            {[...categories, ...categories].map((cat, i) => (
              <span 
                key={i} 
                className="px-4 py-2 rounded-full border border-white/10 text-sm text-muted-foreground whitespace-nowrap"
              >
                {cat}
              </span>
            ))}
          </div>
        </Marquee>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Homeowners & Contractors
            </h2>
            <p className="text-muted-foreground text-lg">
              See what our community has to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="bg-card border-white/10 hover:border-primary/30 transition-colors"
                data-testid={`testimonial-${index + 1}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-6 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="font-heading font-semibold text-primary">
                        {testimonial.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {testimonial.location}
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
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/20 via-background to-background">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Your Renovation?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join hundreds of homeowners who trust Build Launch for secure, 
            hassle-free renovation projects in the GTA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="glow-blue text-lg px-8" data-testid="cta-get-started">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Contact Us
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-muted-foreground flex items-center justify-center gap-2">
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
