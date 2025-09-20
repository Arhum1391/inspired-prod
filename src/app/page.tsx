import NewsletterSubscription from '@/components/NewsletterSubscription';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Inspired Analyst
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Professional analysis and consulting services to help you make informed decisions and achieve your goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/book"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
            >
              Book a Meeting
            </a>
            <a
              href="#services"
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Services Section */}
        <div id="services" className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Initial Consultation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Quick overview and needs assessment
              </p>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                $50
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Extended Consultation
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Extended consultation with detailed analysis
              </p>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                $75
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Strategy Workshop
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Intensive planning and implementation workshop
              </p>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                $150
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                Follow-up Session
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Progress review and next steps
              </p>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                $75
              </div>
            </div>
          </div>

          {/* Newsletter Subscription */}
          <div className="mt-20">
            <NewsletterSubscription />
          </div>
        </div>
      </div>
    </div>
  );
}
