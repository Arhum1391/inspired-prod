'use client';

import Navbar from '@/components/Navbar';

export default function Bootcamp() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Bootcamp Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Bootcamp
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Master the art of financial analysis and investment strategies with our comprehensive bootcamp program.
            Learn from industry experts and gain practical skills.
          </p>
        </div>
      </section>

      {/* Bootcamp Features */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bootcamp Card 1 */}
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Financial Analysis</h3>
              <p className="text-gray-300 mb-4">
                Learn comprehensive financial analysis techniques including ratio analysis, 
                cash flow analysis, and valuation methods.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Fundamental Analysis</li>
                <li>• Technical Analysis</li>
                <li>• Risk Assessment</li>
                <li>• Portfolio Management</li>
              </ul>
            </div>

            {/* Bootcamp Card 2 */}
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Investment Strategies</h3>
              <p className="text-gray-300 mb-4">
                Master various investment strategies including value investing, growth investing, 
                and alternative investments.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Value Investing</li>
                <li>• Growth Investing</li>
                <li>• Dividend Investing</li>
                <li>• Alternative Assets</li>
              </ul>
            </div>

            {/* Bootcamp Card 3 */}
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Trading Techniques</h3>
              <p className="text-gray-300 mb-4">
                Learn professional trading techniques and risk management strategies 
                used by successful traders.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Day Trading</li>
                <li>• Swing Trading</li>
                <li>• Options Trading</li>
                <li>• Risk Management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Bootcamp Program Details */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Program Structure
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our bootcamp is designed to provide comprehensive learning with hands-on experience.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">What You'll Learn</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#667EEA] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Financial Statement Analysis</h4>
                    <p className="text-gray-300 text-sm">Learn to read and analyze balance sheets, income statements, and cash flow statements.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#667EEA] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Market Analysis Techniques</h4>
                    <p className="text-gray-300 text-sm">Master both fundamental and technical analysis methods.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#667EEA] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Portfolio Management</h4>
                    <p className="text-gray-300 text-sm">Build and manage diversified investment portfolios.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-[#667EEA] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Risk Management</h4>
                    <p className="text-gray-300 text-sm">Learn to identify and manage investment risks effectively.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">Program Benefits</h3>
              <div className="space-y-4">
                <div className="bg-[#1F1F1F] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Expert Instructors</h4>
                  <p className="text-gray-300 text-sm">Learn from industry professionals with years of experience.</p>
                </div>

                <div className="bg-[#1F1F1F] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Hands-on Projects</h4>
                  <p className="text-gray-300 text-sm">Work on real-world projects and case studies.</p>
                </div>

                <div className="bg-[#1F1F1F] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Networking Opportunities</h4>
                  <p className="text-gray-300 text-sm">Connect with like-minded professionals and industry experts.</p>
                </div>

                <div className="bg-[#1F1F1F] p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Certification</h4>
                  <p className="text-gray-300 text-sm">Receive a certificate upon successful completion.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enrollment Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Join our bootcamp and take your financial analysis skills to the next level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/meetings"
              className="bg-[#667EEA] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#5a67d8] transition-colors btn-hover-lift"
            >
              Enroll Now
            </a>
            <a
              href="/contact"
              className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors btn-hover-lift"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 YourApp. All rights reserved. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}

