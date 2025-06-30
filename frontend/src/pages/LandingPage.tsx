import React from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

interface LandingPageProps {
  onBookNow: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onBookNow }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-50">
      {/* Hero Section */}
      <div className="relative px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Premium Padel Courts
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the game like never before with our state-of-the-art facilities 
            and professional lighting
          </p>
          <Button onClick={onBookNow} size="lg" className="text-lg px-8 py-4">
            Book Your Court Now
          </Button>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Higgs Padel?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Professional Quality
              </h3>
              <p className="text-gray-600">
                Our courts meet international standards with premium artificial turf 
                and professional lighting systems.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Flexible Booking
              </h3>
              <p className="text-gray-600">
                Easy online booking system with flexible time slots from 9 AM to 10 PM. 
                Book your preferred time instantly.
              </p>
            </Card>

            <Card className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Great Experience
              </h3>
              <p className="text-gray-600">
                Modern facilities with changing rooms, equipment rental, 
                and a cozy cafe for post-game refreshments.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="px-4 py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Simple Pricing
          </h2>
          
          <Card className="max-w-md mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">
                50 GEL
              </div>
              <div className="text-gray-600 mb-6">per hour</div>
              <ul className="space-y-2 text-left text-gray-600 mb-6">
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Professional court access
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  LED lighting system
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Changing room access
                </li>
                <li className="flex items-center">
                  <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Equipment available for rent
                </li>
              </ul>
              <Button onClick={onBookNow} className="w-full">
                Book Now
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 py-16 bg-red-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Play?
          </h2>
          <p className="text-xl text-red-100 mb-8">
            Book your court now and experience the best padel facilities in Tbilisi
          </p>
          <Button 
            onClick={onBookNow}
            variant="secondary"
            size="lg"
            className="bg-white text-red-600 hover:bg-gray-100"
          >
            Book Your Court
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;