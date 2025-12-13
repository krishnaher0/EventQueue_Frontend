import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landingPage/HeroSection';
import CategorySection from '../components/landingPage/CategorySection';
// import EventsSection from '../components/landingPage/EventsSection';
import WhyChooseSection from '../components/landingPage/WhyChooseSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
    
      <main className="max-w-7xl mx-auto px-4 py-8">
        <HeroSection />
        <CategorySection />
        {/* <EventsSection /> */}
        <WhyChooseSection />
      </main>
    </div>
  );
};

export default HomePage;