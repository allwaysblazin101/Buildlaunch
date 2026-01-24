import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent } from '../components/ui/card';
import { Phone, Mail } from 'lucide-react';

const Terms = () => {
  const lastUpdated = 'January 2025';

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-white mb-4" data-testid="terms-title">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
        </div>

        <Card className="bg-card/50 border-white/5">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-white/80 leading-relaxed">
                By accessing or using Build Launch ("the Platform"), you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services. Build Launch reserves the right 
                to modify these terms at any time, and your continued use constitutes acceptance of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-white/80 leading-relaxed">
                Build Launch is an online marketplace connecting homeowners with contractors for renovation projects 
                in the Greater Toronto Area (Mississauga, Toronto, and Brampton). We provide:
              </p>
              <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
                <li>A platform for homeowners to post renovation jobs</li>
                <li>A system for contractors to browse and bid on jobs</li>
                <li>Secure escrow payment processing</li>
                <li>Messaging between homeowners and contractors</li>
                <li>Rating and review systems</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p className="text-white/80 leading-relaxed">
                Users must provide accurate, complete information when creating an account. You are responsible for 
                maintaining the confidentiality of your account credentials and for all activities under your account. 
                You must immediately notify Build Launch of any unauthorized use.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">4. Contractor Verification</h2>
              <p className="text-white/80 leading-relaxed">
                Contractors must provide valid license and insurance information to become verified. Build Launch 
                verifies this information but does not guarantee the quality of work. Homeowners are encouraged 
                to conduct their own due diligence before accepting bids.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">5. Escrow Payment System</h2>
              <p className="text-white/80 leading-relaxed">
                All payments are processed through our secure escrow system:
              </p>
              <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
                <li>Homeowners fund escrow before accepting a bid</li>
                <li>Funds are held until the homeowner confirms job completion</li>
                <li>Build Launch charges a 10% platform fee on completed transactions</li>
                <li>Disputes are handled by our support team</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">6. Fees and Payments</h2>
              <p className="text-white/80 leading-relaxed">
                <strong>For Homeowners:</strong> No fees to post jobs. The maximum budget amount is held in escrow.<br />
                <strong>For Contractors:</strong> Free to bid on jobs. A 10% platform fee is deducted from payments upon job completion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">7. Prohibited Activities</h2>
              <p className="text-white/80 leading-relaxed">Users may not:</p>
              <ul className="list-disc list-inside text-white/80 mt-4 space-y-2">
                <li>Provide false or misleading information</li>
                <li>Circumvent the escrow payment system</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Use the platform for illegal activities</li>
                <li>Post spam or unauthorized advertising</li>
                <li>Attempt to access other users' accounts</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p className="text-white/80 leading-relaxed">
                Build Launch is not liable for any disputes between homeowners and contractors. We facilitate 
                connections but are not party to contracts between users. Our liability is limited to the platform 
                fees collected.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">9. Termination</h2>
              <p className="text-white/80 leading-relaxed">
                Build Launch may suspend or terminate accounts that violate these terms. Users may close their 
                accounts at any time, provided there are no active jobs or pending payments.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-heading text-2xl font-semibold text-white mb-4">10. Contact Information</h2>
              <p className="text-white/80 leading-relaxed">
                For questions about these Terms of Service, contact us:
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
            </section>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
