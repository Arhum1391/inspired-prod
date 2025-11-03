'use client';

import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <Navbar variant="hero" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Welcome to{' '}
            <span className="gradient-text">YourApp</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-fade-in">
            Build amazing experiences with our modern, responsive navbar component.
            Perfect for your Next.js applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
            <a
              href="#features"
              className="bg-white text-[#0A0A0A] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors btn-hover-lift"
            >
              Explore Features
            </a>
            <a
              href="#contact"
              className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors btn-hover-lift"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Research
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Comprehensive research and analysis to help you make informed investment decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Calculator
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Powerful financial calculators to help you plan and optimize your investments.
            </p>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Portfolio
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Track and manage your investment portfolio with our advanced tools.
            </p>
          </div>
        </div>
      </section>

      {/* Shariah Section */}
      <section id="shariah" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Shariah
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Shariah-compliant investment options and guidance for Islamic finance.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              About Our Platform
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              We provide cutting-edge solutions that help businesses grow and succeed
              in the digital age. Our platform combines modern technology with
              user-friendly design.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-300">
                Built with performance in mind, our platform delivers blazing fast
                experiences across all devices.
              </p>
            </div>

            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Reliable</h3>
              <p className="text-gray-300">
                Trusted by thousands of users worldwide. Our platform is designed
                for reliability and uptime.
              </p>
            </div>

            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">User-Friendly</h3>
              <p className="text-gray-300">
                Intuitive design and seamless user experience. Easy to use for
                beginners and powerful for experts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Key Features
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Discover the powerful features that make our platform stand out
              from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Responsive Design</h3>
              <p className="text-gray-300 mb-6">
                Our navbar component is fully responsive and works perfectly on
                all devices, from mobile phones to desktop computers.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Mobile-first approach
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Smooth animations
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Accessibility features
                </li>
              </ul>
            </div>
            
            <div className="bg-[#1F1F1F] p-8 rounded-lg">
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Simple Pricing
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Choose the plan that's right for you. All plans include our core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <h3 className="text-xl font-semibold mb-4">Starter</h3>
              <div className="text-3xl font-bold mb-6">$9<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300">✓ Up to 5 projects</li>
                <li className="text-gray-300">✓ Basic support</li>
                <li className="text-gray-300">✓ Standard features</li>
              </ul>
              <button className="w-full bg-white text-[#0A0A0A] py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover border-2 border-[#667EEA]">
              <div className="bg-[#667EEA] text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                Popular
              </div>
              <h3 className="text-xl font-semibold mb-4">Pro</h3>
              <div className="text-3xl font-bold mb-6">$29<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300">✓ Unlimited projects</li>
                <li className="text-gray-300">✓ Priority support</li>
                <li className="text-gray-300">✓ Advanced features</li>
              </ul>
              <button className="w-full bg-[#667EEA] text-white py-3 rounded-full font-semibold hover:bg-[#5a67d8] transition-colors">
                Get Started
              </button>
            </div>

            <div className="bg-[#1F1F1F] p-8 rounded-lg card-hover">
              <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
              <div className="text-3xl font-bold mb-6">$99<span className="text-lg text-gray-400">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="text-gray-300">✓ Everything in Pro</li>
                <li className="text-gray-300">✓ 24/7 support</li>
                <li className="text-gray-300">✓ Custom integrations</li>
              </ul>
              <button className="w-full bg-white text-[#0A0A0A] py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Ready to get started? We'd love to hear from you. Send us a message
              and we'll respond as soon as possible.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-600 rounded-lg focus:outline-none focus:border-[#667EEA] text-white"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-600 rounded-lg focus:outline-none focus:border-[#667EEA] text-white"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 bg-[#1F1F1F] border border-gray-600 rounded-lg focus:outline-none focus:border-[#667EEA] text-white"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#667EEA] text-white py-3 rounded-lg font-semibold hover:bg-[#5a67d8] transition-colors btn-hover-lift"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:ei-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2024 YourApp. All rights reserved. Built with Next.js and Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
}