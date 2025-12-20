
export default function Footer() {
  return (
    <footer className="bg-[#0A142F] text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="w-20 h-12   rounded-lg flex items-center justify-center">
<img src="https://cdn.cness.io/cness%20(2).svg" />   
         </div>
            <div className="space-y-2">
              <p className="text-lg">+1 (7635) 547-12-97</p>
              <p className="text-gray-300">support@cness.co</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4 text-gray-300">
              <div className="space-y-2">
                <p className="hover:text-white cursor-pointer">Product</p>
                <p className="hover:text-white cursor-pointer">Information</p>
              </div>
              <div className="space-y-2">
                <p className="hover:text-white cursor-pointer">Company</p>
                <p className="hover:text-white cursor-pointer">Marketplace</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold">Subscribe</h3>
            <div className="flex">
              <input
                type="email"
                placeholder="Get product updates"
                className="flex-1 px-4 py-3 bg-white text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button className="px-6 py-3 bg-purple-600 rounded-r-lg hover:bg-purple-700 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex space-x-6">
            {/* Social Icons */}
            <img src="https://cdn.cness.io/Linkedin.svg"></img>

            <img src="https://cdn.cness.io/facebook.svg"></img>

          <img src="https://cdn.cness.io/Twitter.svg"></img>

          </div>
          <p className="text-gray-300">© 2025 CNESS. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}
