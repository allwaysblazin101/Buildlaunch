import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Marquee from 'react-fast-marquee';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '../components/ui/dialog';
import { 
  Shield, DollarSign, Users, CheckCircle, ArrowRight, Star, MapPin, 
  Clock, Play, Sparkles, Building2, Hammer, PaintBucket, Wrench,
  ChevronDown, MousePointer2
} from 'lucide-react';

const Landing = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Parallax mouse effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Auto-rotate steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '500+', label: 'Jobs Completed', icon: <CheckCircle className="w-5 h-5" /> },
    { value: '150+', label: 'Verified Contractors', icon: <Users className="w-5 h-5" /> },
    { value: '$2M+', label: 'Secured in Escrow', icon: <Shield className="w-5 h-5" /> },
    { value: '4.8★', label: 'Average Rating', icon: <Star className="w-5 h-5" /> },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Post Your Job',
      description: 'Describe your renovation project, upload photos, set your budget, and choose your location.',
      icon: <Building2 className="w-7 h-7" />,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      step: '02',
      title: 'Fund Escrow',
      description: 'Pay securely into our escrow system. Your money is 100% protected until job completion.',
      icon: <Shield className="w-7 h-7" />,
      color: 'from-emerald-500 to-teal-400',
    },
    {
      step: '03',
      title: 'Choose Contractor',
      description: 'Review bids from verified contractors. Compare ratings, reviews, and select your perfect match.',
      icon: <Users className="w-7 h-7" />,
      color: 'from-violet-500 to-purple-400',
    },
    {
      step: '04',
      title: 'Release Payment',
      description: 'Once satisfied, release payment. Contractor receives funds minus our 10% platform fee.',
      icon: <DollarSign className="w-7 h-7" />,
      color: 'from-amber-500 to-orange-400',
    },
  ];

  const categories = [
    { name: 'Kitchen', icon: <PaintBucket className="w-5 h-5" /> },
    { name: 'Bathroom', icon: <Wrench className="w-5 h-5" /> },
    { name: 'Basement', icon: <Building2 className="w-5 h-5" /> },
    { name: 'Flooring', icon: <Hammer className="w-5 h-5" /> },
  ];

  const galleryImages = [
    { src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80', title: 'Modern Kitchen', location: 'Mississauga' },
    { src: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&q=80', title: 'Luxury Bathroom', location: 'Toronto' },
    { src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', title: 'Open Living', location: 'Brampton' },
    { src: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', title: 'Home Exterior', location: 'Toronto' },
    { src: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', title: 'Entertainment Room', location: 'Mississauga' },
    { src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', title: 'Premium Deck', location: 'Brampton' },
  ];

  const testimonials = [
    { name: 'Sarah M.', location: 'Mississauga', text: 'Build Launch made my kitchen renovation stress-free. The escrow system gave me complete peace of mind!', rating: 5, project: 'Kitchen' },
    { name: 'Michael T.', location: 'Toronto', text: 'As a contractor, I love that bidding is free. Fair, transparent, and I only pay when I win.', rating: 5, project: 'Contracting' },
    { name: 'Jennifer L.', location: 'Brampton', text: 'Found an amazing contractor for my basement. The whole process was seamless!', rating: 5, project: 'Basement' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section - Full Screen with Parallax */}
      <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          {/* Main background image with overlay */}
          <div 
            className="absolute inset-0 transition-transform duration-300 ease-out"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px) scale(1.1)`,
            }}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/80" />
          
          {/* Animated gradient orbs */}
          <div 
            className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[150px] animate-pulse"
            style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-pulse"
            style={{ animationDelay: '1s', transform: `translate(${-mousePosition.x * 1.5}px, ${-mousePosition.y * 1.5}px)` }}
          />
          <div 
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-sm text-white/80">Trusted by 500+ homeowners in the GTA</span>
          </div>

          {/* Main Heading */}
          <h1 
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up"
            style={{ animationDelay: '0.1s' }}
          >
            Your Renovation,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 animate-gradient">
              Secured & Simple
            </span>
          </h1>

          {/* Subheading */}
          <p 
            className="text-xl text-white/70 mb-10 max-w-2xl mx-auto animate-slide-up leading-relaxed"
            style={{ animationDelay: '0.2s' }}
          >
            Post your renovation job. Receive competitive bids. Pay through secure escrow. 
            <span className="text-cyan-400"> It's that easy.</span>
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up"
            style={{ animationDelay: '0.3s' }}
          >
            <Link to="/register">
              <Button 
                size="lg" 
                className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-lg px-10 h-14 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500"
                data-testid="hero-cta-homeowner"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Post a Job
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Button>
            </Link>
            <a href="tel:416-697-1728">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-10 h-14 border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                data-testid="hero-call-btn"
              >
                <Phone className="w-5 h-5 mr-2" />
                416-697-1728
              </Button>
            </a>
          </div>

          {/* Quick Stats */}
          <div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default"
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  <span className="text-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity">{stat.icon}</span>
                  <span className="font-heading text-2xl font-bold text-white">{stat.value}</span>
                </div>
                <span className="text-xs text-white/50">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-white/40">Scroll to explore</span>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </div>
        </div>
      </section>

      {/* Categories Strip */}
      <section className="py-6 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-blue-600/10 border-y border-white/5">
        <Marquee gradient={false} speed={50} pauseOnHover>
          <div className="flex items-center gap-8 px-8">
            {[...categories, ...categories, ...categories].map((cat, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                <span className="text-cyan-400 group-hover:scale-110 transition-transform">{cat.icon}</span>
                <span className="text-white/80 whitespace-nowrap">{cat.name} Renovation</span>
              </div>
            ))}
          </div>
        </Marquee>
      </section>

      {/* How It Works - Interactive */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4">
              <MousePointer2 className="w-4 h-4" />
              Simple Process
            </span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Four simple steps to your perfect renovation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Steps List */}
            <div className="space-y-4">
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className={`group p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                    activeStep === index 
                      ? 'bg-white/10 border-white/20 scale-[1.02]' 
                      : 'bg-white/5 border-white/5 hover:bg-white/8 hover:border-white/10'
                  }`}
                  onClick={() => setActiveStep(index)}
                  data-testid={`how-it-works-step-${index + 1}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm text-white/40">{item.step}</span>
                        <h3 className="font-heading text-xl font-semibold text-white">{item.title}</h3>
                      </div>
                      <p className={`text-white/60 text-sm leading-relaxed transition-all duration-300 ${activeStep === index ? 'opacity-100' : 'opacity-70'}`}>
                        {item.description}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${item.color} ${activeStep === index ? 'opacity-100 scale-100' : 'opacity-0 scale-0'} transition-all duration-300`} />
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Display */}
            <div className="relative h-[500px] rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-3xl" />
              {howItWorks.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-4 rounded-2xl overflow-hidden transition-all duration-700 ${
                    activeStep === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  <img
                    src={galleryImages[index]?.src || galleryImages[0].src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${item.color} mb-3`}>
                      {item.icon}
                      <span className="text-white font-medium">Step {item.step}</span>
                    </div>
                    <h3 className="text-2xl font-heading font-bold text-white">{item.title}</h3>
                  </div>
                </div>
              ))}
              
              {/* Progress dots */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                {howItWorks.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      activeStep === index ? 'w-8 bg-white' : 'bg-white/30 hover:bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-card/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">Portfolio</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              Stunning Transformations
            </h2>
            <p className="text-white/60 text-lg">
              Real projects completed by our verified contractors
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {galleryImages.map((image, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div 
                    className={`group relative rounded-2xl overflow-hidden cursor-pointer ${
                      index === 0 ? 'md:col-span-2 md:row-span-2 aspect-square md:aspect-auto' : 'aspect-[4/3]'
                    }`}
                    data-testid={`gallery-image-${index}`}
                  >
                    <img 
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-white font-semibold text-lg">{image.title}</h4>
                      <p className="text-white/70 text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {image.location}
                      </p>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-4xl bg-card border-white/10 p-2">
                  <img src={image.src.replace('w=800', 'w=1400')} alt={image.title} className="w-full rounded-lg" />
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">Testimonials</span>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
              Loved by Our Community
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <Card 
                key={index} 
                className="group bg-white/5 border-white/5 hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2"
                data-testid={`testimonial-${index + 1}`}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-6 leading-relaxed">"{t.text}"</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-white">{t.name}</p>
                      <p className="text-sm text-white/50">{t.location} • {t.project}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-blue-600/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 rounded-full blur-[200px]" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <Logo size="hero" showText={false} />
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-8 mb-6">
            Ready to Transform<br />Your Space?
          </h2>
          <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
            Join hundreds of homeowners who trust Build Launch for their renovation projects.
          </p>
          <Link to="/register">
            <Button 
              size="lg" 
              className="group bg-white text-gray-900 hover:bg-white/90 text-lg px-12 h-16 shadow-2xl shadow-white/20"
              data-testid="cta-get-started"
            >
              Start Your Project Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-8 text-white/50 flex items-center justify-center gap-2">
            <Clock className="w-4 h-4" />
            Most homeowners receive their first bid within 24 hours
          </p>
        </div>
      </section>

      <Footer />

      {/* Add animation keyframes via style tag */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.5; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        .animate-float {
          animation: float 10s ease-in-out infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default Landing;
