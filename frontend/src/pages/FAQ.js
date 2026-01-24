import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { 
  Shield, DollarSign, Users, Clock, HelpCircle, 
  ChevronDown, Phone, CheckCircle, AlertCircle
} from 'lucide-react';

const FAQ = () => {
  const faqs = [
    {
      category: 'For Homeowners',
      icon: <Users className="w-5 h-5" />,
      questions: [
        {
          q: 'How does the escrow system protect me?',
          a: 'When you fund a job, your money goes into our secure escrow account - not directly to the contractor. The funds are only released when you confirm the job is complete and satisfactory. This protects you from paying for incomplete or unsatisfactory work.'
        },
        {
          q: 'What is the platform fee?',
          a: 'Build Launch charges a 10% platform fee on completed jobs. This fee is deducted from the escrow amount when you release payment to the contractor. There are no upfront fees for posting jobs.'
        },
        {
          q: 'How do I choose the right contractor?',
          a: 'Review each contractor\'s bid carefully, including their price, estimated timeline, and message. Check their verification status (license and insurance), ratings, reviews from past homeowners, and number of completed jobs on the platform.'
        },
        {
          q: 'What if I\'m not satisfied with the work?',
          a: 'Do not release the escrow payment until you\'re satisfied. If there\'s a dispute, contact our support team at 416-697-1728 and we\'ll help mediate. As a last resort, our admin team can review the situation and make a fair resolution.'
        },
        {
          q: 'Can I cancel a job after funding escrow?',
          a: 'If you haven\'t accepted a bid yet, you can request a refund. Once a bid is accepted, cancellation depends on work progress. Contact us at 416-697-1728 to discuss your specific situation.'
        }
      ]
    },
    {
      category: 'For Contractors',
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          q: 'Is it really free to bid on jobs?',
          a: 'Yes! Bidding is completely free. You only pay the 10% platform fee when you win a job AND the homeowner releases payment after completion. If you don\'t win or the job is cancelled, you pay nothing.'
        },
        {
          q: 'How do I get verified?',
          a: 'Go to your Profile and fill in your license number and insurance information. Once submitted, you\'ll receive a "Verified" badge that appears on all your bids, helping you stand out to homeowners.'
        },
        {
          q: 'When do I get paid?',
          a: 'Payment is released when the homeowner confirms job completion. The funds (minus 10% platform fee) are then transferred to your account. We recommend maintaining clear communication with homeowners throughout the project.'
        },
        {
          q: 'What if a homeowner refuses to release payment unfairly?',
          a: 'Contact our support team at 416-697-1728. We\'ll review the situation, mediate between both parties, and if necessary, our admin team can make a fair decision on fund release.'
        }
      ]
    },
    {
      category: 'Payments & Security',
      icon: <DollarSign className="w-5 h-5" />,
      questions: [
        {
          q: 'Is my payment information secure?',
          a: 'Yes. We use Stripe, a PCI-compliant payment processor used by millions of businesses worldwide. Your card details are never stored on our servers.'
        },
        {
          q: 'What currencies do you accept?',
          a: 'Currently, all transactions are processed in Canadian Dollars (CAD) as we serve the Greater Toronto Area (Mississauga, Toronto, and Brampton).'
        },
        {
          q: 'How long does it take to process payments?',
          a: 'Escrow funding is instant via Stripe checkout. When you release payment to a contractor, they typically receive funds within 2-3 business days.'
        }
      ]
    },
    {
      category: 'Account & Support',
      icon: <HelpCircle className="w-5 h-5" />,
      questions: [
        {
          q: 'How do I contact support?',
          a: 'Call us at 416-697-1728, email info@buildlaunch.ca, or use the contact form on our website. Our team is available Monday-Friday 9AM-6PM, Saturday 10AM-4PM.'
        },
        {
          q: 'Can I delete my account?',
          a: 'Yes. Contact our support team and we\'ll process your request. Note that you cannot delete your account while you have active jobs or pending payments.'
        },
        {
          q: 'Is my personal information safe?',
          a: 'We take privacy seriously. Your information is encrypted and never shared with third parties. Contractors only see the information necessary to bid on and complete jobs.'
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-cyan-400 font-medium text-sm uppercase tracking-wider mb-4 block">Support</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4" data-testid="faq-title">
            Frequently Asked Questions
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to know about Build Launch. Can't find your answer? 
            <a href="tel:416-697-1728" className="text-cyan-400 hover:underline ml-1">Call us at 416-697-1728</a>
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqs.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-cyan-400">
                  {section.icon}
                </div>
                <h2 className="font-heading text-xl font-semibold text-white">{section.category}</h2>
              </div>
              
              <div className="space-y-3">
                {section.questions.map((faq, index) => (
                  <Card key={index} className="bg-card/50 border-white/5 hover:border-white/10 transition-colors">
                    <CardContent className="p-5">
                      <details className="group">
                        <summary className="flex items-center justify-between cursor-pointer list-none">
                          <h3 className="font-medium text-white pr-4">{faq.q}</h3>
                          <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform flex-shrink-0" />
                        </summary>
                        <p className="mt-4 text-muted-foreground text-sm leading-relaxed border-t border-white/5 pt-4">
                          {faq.a}
                        </p>
                      </details>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Still Need Help */}
        <Card className="mt-12 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-white/10">
          <CardContent className="p-8 text-center">
            <Phone className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
            <h3 className="font-heading text-2xl font-bold text-white mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-6">Our team is here to help you with anything you need.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="tel:416-697-1728" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg text-white font-medium hover:from-blue-500 hover:to-cyan-400 transition-colors"
                data-testid="faq-call-btn"
              >
                <Phone className="w-5 h-5" />
                Call 416-697-1728
              </a>
              <a 
                href="mailto:info@buildlaunch.ca" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 rounded-lg text-white font-medium hover:bg-white/20 transition-colors"
              >
                Email Support
              </a>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
