'use client';

import Navbar from '@/components/Navbar';

export default function Blog() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Blog Header */}
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

      {/* Blog Posts */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog Post 1 */}
            <article className="bg-[#1F1F1F] rounded-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-2">January 15, 2024</div>
                <h3 className="text-xl font-semibold mb-3">
                  Getting Started with Modern Web Development
                </h3>
                <p className="text-gray-300 mb-4">
                  Learn the fundamentals of modern web development with React,
                  Next.js, and Tailwind CSS. Perfect for beginners.
                </p>
                <a
                  href="#"
                  className="text-[#667EEA] hover:text-[#5a67d8] font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>

            {/* Blog Post 2 */}
            <article className="bg-[#1F1F1F] rounded-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-r from-green-500 to-blue-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-2">January 12, 2024</div>
                <h3 className="text-xl font-semibold mb-3">
                  Building Responsive Navbars
                </h3>
                <p className="text-gray-300 mb-4">
                  Discover the best practices for creating responsive navigation
                  components that work across all devices.
                </p>
                <a
                  href="#"
                  className="text-[#667EEA] hover:text-[#5a67d8] font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>

            {/* Blog Post 3 */}
            <article className="bg-[#1F1F1F] rounded-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-2">January 10, 2024</div>
                <h3 className="text-xl font-semibold mb-3">
                  Performance Optimization Tips
                </h3>
                <p className="text-gray-300 mb-4">
                  Learn how to optimize your web applications for better performance
                  and user experience.
                </p>
                <a
                  href="#"
                  className="text-[#667EEA] hover:text-[#5a67d8] font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>

            {/* Blog Post 4 */}
            <article className="bg-[#1F1F1F] rounded-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-r from-red-500 to-orange-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-2">January 8, 2024</div>
                <h3 className="text-xl font-semibold mb-3">
                  CSS Grid vs Flexbox
                </h3>
                <p className="text-gray-300 mb-4">
                  A comprehensive comparison of CSS Grid and Flexbox, when to use
                  each, and best practices.
                </p>
                <a
                  href="#"
                  className="text-[#667EEA] hover:text-[#5a67d8] font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>

            {/* Blog Post 5 */}
            <article className="bg-[#1F1F1F] rounded-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-r from-teal-500 to-cyan-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-2">January 5, 2024</div>
                <h3 className="text-xl font-semibold mb-3">
                  TypeScript Best Practices
                </h3>
                <p className="text-gray-300 mb-4">
                  Improve your TypeScript code with these essential best practices
                  and patterns used by professionals.
                </p>
                <a
                  href="#"
                  className="text-[#667EEA] hover:text-[#5a67d8] font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>

            {/* Blog Post 6 */}
            <article className="bg-[#1F1F1F] rounded-lg overflow-hidden card-hover">
              <div className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <div className="p-6">
                <div className="text-sm text-gray-400 mb-2">January 3, 2024</div>
                <h3 className="text-xl font-semibold mb-3">
                  Next.js App Router Guide
                </h3>
                <p className="text-gray-300 mb-4">
                  Master the new App Router in Next.js 13+ with this comprehensive
                  guide and practical examples.
                </p>
                <a
                  href="#"
                  className="text-[#667EEA] hover:text-[#5a67d8] font-semibold"
                >
                  Read More →
                </a>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
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

