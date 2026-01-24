import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { 
  Shield, Users, Target, Award, Phone, Mail, MapPin, 
  CheckCircle, Star, Building2, ArrowRight
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Trust & Security',
      description: 'Our escrow system ensures every transaction is protected. Your money is safe until you\'re satisfied.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community First',
      description: 'We verify all contractors and empower homeowners to make informed decisions.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Fair Pricing',
      description: 'Contractors bid for free. Our 10% fee only applies on successful job completion.'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Quality Work',
      description: 'Our rating system ensures only the best contractors thrive on our platform.'
    }
  ];

  const stats = [
    { value: '500+', label: 'Jobs Completed' },
    { value: '150+', label: 'Verified Contractors' },
    { value: '$2M+', label: 'Processed Securely' },
    { value: '4.8/5', label: 'Average Rating' },
  ];

  const team = [
    { name: 'Build Launch Team', role: 'Customer Success', phone: '416-697-1728' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[150px]" />
          
          <div className="relative max-w-4xl mx-auto text-center">
            <Logo size="hero" showText={false} />
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mt-8 mb-6" data-testid="about-title">
              About Build Launch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We're on a mission to make renovation projects stress-free for homeowners 
              and profitable for contractors in the Greater Toronto Area.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card/50 border-y border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    {stat.value}
                  </p>
                  <p className="text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-3">
                Why We Built This
              </h2>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <Card className="bg-card/50 border-white/5">
                <CardContent className="p-8">
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    We saw too many homeowners get burned by unreliable contractors, and too many 
                    honest contractors struggle to find quality leads. The traditional model was broken.
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    That's why we created Build Launch — a platform where trust is built into every 
                    transaction. Our escrow system protects homeowners while ensuring contractors get 
                    paid fairly for their work.
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Based in the Greater Toronto Area, we're proud to serve homeowners in Mississauga, 
                    Toronto, and Brampton. Our team is always available at <a href="tel:416-697-1728" className="text-cyan-400 hover:underline">416-697-1728</a> to 
                    help you with your renovation journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider">Our Values</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mt-3">
                What We Stand For
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="bg-card/50 border-white/5 hover:border-cyan-500/30 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                      {value.icon}
                    </div>
                    <h3 className="font-heading text-lg font-semibold text-white mb-2">{value.title}</h3>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-white/10">
              <CardContent className="p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="font-heading text-3xl font-bold text-white mb-4">
                      Get in Touch
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Have questions? Our team is here to help you every step of the way.
                    </p>
                    <div className="space-y-4">
                      <a href="tel:416-697-1728" className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors" data-testid="about-phone">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Phone className="w-5 h-5" />
                        </div>
                        <span className="font-mono text-lg">416-697-1728</span>
                      </a>
                      <a href="mailto:info@buildlaunch.ca" className="flex items-center gap-3 text-white hover:text-cyan-400 transition-colors">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <Mail className="w-5 h-5" />
                        </div>
                        <span>info@buildlaunch.ca</span>
                      </a>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <span>Serving Mississauga, Toronto & Brampton</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center md:text-right">
                    <Link to="/register">
                      <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg">
                        Start Your Project
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-4">
                      Join 500+ homeowners who trust Build Launch
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
