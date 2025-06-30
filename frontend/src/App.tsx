import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

type Page = 'landing' | 'booking';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const handleBookNow = () => {
    setCurrentPage('booking');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1">
          {currentPage === 'landing' ? (
            <LandingPage onBookNow={handleBookNow} />
          ) : (
            <BookingPage />
          )}
        </main>

        <Footer />
      </div>
    </QueryClientProvider>
  );
}

export default App;
