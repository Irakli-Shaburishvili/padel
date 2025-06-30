import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Higgs
            </h1>
            <span className="ml-2 text-sm text-gray-500">Padel Court</span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a 
              href="#cafe" 
              className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Cafe
            </a>
            <a 
              href="#padel" 
              className="text-gray-900 px-3 py-2 rounded-md text-sm font-medium border-b-2 border-red-500"
            >
              Padel
            </a>
          </nav>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-500"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="#" 
              className="text-gray-400 hover:text-gray-500"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629.577 0 1.113-.24 1.502-.629.389-.389.629-.925.629-1.502s-.24-1.113-.629-1.502c-.389-.389-.925-.629-1.502-.629s-1.113.24-1.502.629L4.244 9.449c.757-.933 1.908-1.529 3.205-1.529 2.279 0 4.131 1.852 4.131 4.131s-1.852 4.131-4.131 4.131zm7.682 0c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629s1.113-.24 1.502-.629c.389-.389.629-.925.629-1.502s-.24-1.113-.629-1.502c-.389-.389-.925-.629-1.502-.629s-1.113.24-1.502.629l-1.703-1.703c.757-.933 1.908-1.529 3.205-1.529 2.279 0 4.131 1.852 4.131 4.131s-1.852 4.131-4.131 4.131z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;