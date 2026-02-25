'use client';

import Navbar from '@/components/Navbar';

export default function Meetings() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Meetings Header */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Book Mentorship
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Schedule a one-on-one mentorship session with our financial experts.
            Get personalized guidance and advice tailored to your investment goals.
          </p>
        </div>
      </section>

      {/* Mentorship Options */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mentorship Option 1 */}
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <h3 className="text-xl font-semibold mb-4">Basic Consultation</h3>
              <div className="text-3xl font-bold mb-6">$99<span className="text-lg text-gray-400">/session</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300">• 30-minute session</li>
                <li className="text-gray-300">• Investment strategy review</li>
                <li className="text-gray-300">• Basic portfolio analysis</li>
                <li className="text-gray-300">• Email follow-up</li>
              </ul>
              <button className="w-full bg-[#667EEA] text-white py-3 rounded-lg font-semibold hover:bg-[#5a67d8] transition-colors">
                Book Now
              </button>
            </div>

            {/* Mentorship Option 2 */}
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover border-2 border-[#667EEA]">
              <div className="bg-[#667EEA] text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Mentorship</h3>
              <div className="text-3xl font-bold mb-6">$199<span className="text-lg text-gray-400">/session</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300">• 60-minute session</li>
                <li className="text-gray-300">• Comprehensive portfolio review</li>
                <li className="text-gray-300">• Custom investment plan</li>
                <li className="text-gray-300">• 2-week follow-up support</li>
              </ul>
              <button className="w-full bg-[#667EEA] text-white py-3 rounded-lg font-semibold hover:bg-[#5a67d8] transition-colors">
                Book Now
              </button>
            </div>

            {/* Mentorship Option 3 */}
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <h3 className="text-xl font-semibold mb-4">Elite Mentorship</h3>
              <div className="text-3xl font-bold mb-6">$399<span className="text-lg text-gray-400">/session</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300">• 90-minute session</li>
                <li className="text-gray-300">• Advanced strategy development</li>
                <li className="text-gray-300">• Risk management plan</li>
                <li className="text-gray-300">• 1-month follow-up support</li>
              </ul>
              <button className="w-full bg-[#667EEA] text-white py-3 rounded-lg font-semibold hover:bg-[#5a67d8] transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mentorship Process */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              How It Works
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Our mentorship process is designed to provide maximum value and personalized guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#667EEA] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Book Session</h3>
              <p className="text-gray-300 text-sm">Choose your mentorship package and schedule a convenient time.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#667EEA] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Prepare</h3>
              <p className="text-gray-300 text-sm">We'll send you a questionnaire to understand your goals.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#667EEA] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Meet & Learn</h3>
              <p className="text-gray-300 text-sm">Have your one-on-one session with our expert mentor.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#667EEA] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Follow Up</h3>
              <p className="text-gray-300 text-sm">Receive ongoing support and implementation guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Expert Mentors */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Meet Our Expert Mentors
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Learn from experienced financial professionals with proven track records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1F1F1F] p-6 rounded-lg text-center card-hover">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Sarah Johnson</h3>
              <p className="text-gray-400 mb-4">Senior Financial Analyst</p>
              <p className="text-gray-300 text-sm mb-4">
                Over 10 years of experience in investment analysis and portfolio management.
              </p>
              <div className="text-sm text-[#667EEA]">Specializes in: Value Investing</div>
            </div>

            <div className="bg-[#1F1F1F] p-6 rounded-lg text-center card-hover">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Michael Chen</h3>
              <p className="text-gray-400 mb-4">Portfolio Manager</p>
              <p className="text-gray-300 text-sm mb-4">
                Expert in risk management and alternative investment strategies.
              </p>
              <div className="text-sm text-[#667EEA]">Specializes in: Risk Management</div>
            </div>

            <div className="bg-[#1F1F1F] p-6 rounded-lg text-center card-hover">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold mb-2">Emily Rodriguez</h3>
              <p className="text-gray-400 mb-4">Investment Advisor</p>
              <p className="text-gray-300 text-sm mb-4">
                Specializes in growth investing and emerging market opportunities.
              </p>
              <div className="text-sm text-[#667EEA]">Specializes in: Growth Investing</div>
            </div>
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

