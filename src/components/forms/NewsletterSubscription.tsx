'use client';

export default function NewsletterSubscription() {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        
        
        {/* Substack Embed Section */}
        <div className="p-6">
          <iframe 
            src="https://inspiredanalyst.substack.com/embed" 
            width="100%" 
            height="400" 
            style={{
              border: '1px solid #EEE', 
              background: 'white'
            }} 
            frameBorder="0" 
            scrolling="no"
          />
        </div>
        
        {/* Footer Note */}
        <div className="p-6 pt-0">
          <p className="text-xs text-gray-500 text-center">
            By subscribing you agree to Substack's Terms of Use, our Privacy Policy and our Information collection notice
          </p>
        </div>
      </div>
    </div>
  );
}
