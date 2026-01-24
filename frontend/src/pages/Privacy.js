import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Phone, Mail, Shield } from 'lucide-react';

const Privacy = () => {
  const lastUpdated = 'January 2025';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-emerald-400">Your Privacy Matters</span>
          </div>
          <h1 className="font-heading text-4xl font-bold text-white mb-4" data-testid="privacy-title">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <Card className="bg-card/50 border-white/5">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              <p className="text-white/80 leading-relaxed">
                Build Launch collects information necessary to provide our renovation marketplace services:
              </p>
              <h3 className="font-heading text-lg font-semibold text-white mt-4 mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Account credentials (password is encrypted)</li>
                <li>For contractors: license number, insurance information, company details</li>
              </ul>
              <h3 className="font-heading text-lg font-semibold text-white mt-4 mb-2">Usage Information</h3>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Job postings and bid submissions</li>
                <li>Messages between users</li>
                <li>Payment transaction records</li>
                <li>Reviews and ratings</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-white/80 leading-relaxed">We use collected information to:</p>
              <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
                <li>Operate and maintain the Build Launch platform</li>
                <li>Process transactions and payments through our escrow system</li>
                <li>Connect homeowners with contractors</li>
                <li>Send notifications about jobs, bids, and payments</li>
                <li>Verify contractor credentials</li>
                <li>Improve our services and user experience</li>
                <li>Respond to customer support inquiries</li>
                <li>Enforce our Terms of Service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="text-white/80 leading-relaxed">
                We do not sell your personal information. We share information only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
                <li><strong>Between Users:</strong> Contractors can see job details posted by homeowners. Homeowners can see contractor profiles and bids.</li>
                <li><strong>Payment Processing:</strong> We share necessary information with Stripe to process payments securely.</li>
                <li><strong>Legal Requirements:</strong> We may disclose information when required by law or to protect our rights.</li>
                <li><strong>Business Transfers:</strong> In the event of a merger or acquisition, user information may be transferred.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="text-white/80 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
                <li>Passwords are encrypted using bcrypt hashing</li>
                <li>All data transmission is encrypted via HTTPS</li>
                <li>Payment information is processed by PCI-compliant Stripe</li>
                <li>Access controls limit employee access to user data</li>
                <li>Regular security audits and monitoring</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">5. Data Retention</h2>
              <p className="text-white/80 leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide services. 
                If you close your account, we will delete or anonymize your data within 90 days, except where 
                retention is required for legal or business purposes (such as transaction records).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">6. Your Rights</h2>
              <p className="text-white/80 leading-relaxed">You have the right to:</p>
              <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update inaccurate information via your profile</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-white/80 mt-4 leading-relaxed">
                To exercise these rights, contact us at <a href="tel:416-697-1728" className="text-cyan-400">416-697-1728</a> or 
                <a href="mailto:info@buildlaunch.ca" className="text-cyan-400 ml-1">info@buildlaunch.ca</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">7. Cookies and Tracking</h2>
              <p className="text-white/80 leading-relaxed">
                We use essential cookies to maintain your session and preferences. We do not use third-party 
                tracking cookies for advertising purposes. Your browser settings can control cookie behavior.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
              <p className="text-white/80 leading-relaxed">
                Build Launch is not intended for users under 18 years of age. We do not knowingly collect 
                information from children. If we learn we have collected information from a child, we will 
                delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">9. Changes to This Policy</h2>
              <p className="text-white/80 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify users of significant changes 
                via email or platform notification. Continued use after changes constitutes acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">10. Contact Us</h2>
              <p className="text-white/80 leading-relaxed">
                For privacy-related questions or concerns:
              </p>
              <div className="flex flex-col gap-2 mt-4">
                <a href="tel:416-697-1728" className="flex items-center gap-2 text-cyan-400 hover:underline">
                  <Phone className="w-4 h-4" />
                  416-697-1728
                </a>
                <a href="mailto:info@buildlaunch.ca" className="flex items-center gap-2 text-cyan-400 hover:underline">
                  <Mail className="w-4 h-4" />
                  info@buildlaunch.ca
                </a>
              </div>
              <p className="text-white/80 mt-4">
                Build Launch<br />
                Serving: Mississauga, Toronto, Brampton, Ontario, Canada
              </p>
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
