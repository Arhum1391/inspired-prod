'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <Navbar />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            Our Blog
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Stay updated with the latest insights, tutorials, and industry news.
            Learn from our experts and grow your skills.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article key={i} className="bg-[#1F1F1F] rounded-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                <div className="p-6">
                  <div className="text-sm text-gray-400 mb-2">January {i + 14}, 2024</div>
                  <h3 className="text-xl font-semibold mb-3">
                    Blog Post Title {i}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    Learn the fundamentals and best practices for modern development.
                  </p>
                  <a
                    href="#"
                    className="text-[#667EEA] hover:text-[#5a67d8] font-semibold"
                  >
                    Read More →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#111111]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Stay Updated
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Subscribe to our newsletter and never miss a post. Get the latest
            updates delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#1F1F1F] border border-gray-600 rounded-lg focus:outline-none focus:border-[#667EEA] text-white"
            />
            <button className="bg-[#667EEA] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#5a67d8] transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

