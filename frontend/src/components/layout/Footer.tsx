import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Higgs Padel Court
            </h3>
            <p className="text-gray-600 mb-4">
              Premium padel court facility with professional lighting and excellent facilities. 
              Book your court today and enjoy the game!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629.577 0 1.113-.24 1.502-.629.389-.389.629-.925.629-1.502s-.24-1.113-.629-1.502c-.389-.389-.925-.629-1.502-.629s-1.113.24-1.502.629L4.244 9.449c.757-.933 1.908-1.529 3.205-1.529 2.279 0 4.131 1.852 4.131 4.131s-1.852 4.131-4.131 4.131zm7.682 0c-1.297 0-2.448-.596-3.205-1.529l1.703-1.703c.389.389.925.629 1.502.629s1.113-.24 1.502-.629c.389-.389.629-.925.629-1.502s-.24-1.113-.629-1.502c-.389-.389-.925-.629-1.502-.629s-1.113.24-1.502.629l-1.703-1.703c.757-.933 1.908-1.529 3.205-1.529 2.279 0 4.131 1.852 4.131 4.131s-1.852 4.131-4.131 4.131z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Contact
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <span className="block text-sm">Phone</span>
                <span className="text-gray-900">+995 555 123 456</span>
              </li>
              <li>
                <span className="block text-sm">Email</span>
                <span className="text-gray-900">info@higgs.ge</span>
              </li>
              <li>
                <span className="block text-sm">Address</span>
                <span className="text-gray-900">Tbilisi, Georgia</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Hours
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex justify-between">
                <span>Mon - Fri</span>
                <span>09:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>09:00 - 22:00</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>09:00 - 20:00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © 2024 Higgs Padel Court. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;