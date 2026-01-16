import { useState, useEffect } from 'react';
import { eventsAPI } from '../../services/eventApi';
import { recommendationAPI } from '../../services/recommendationApi';
import HeroSection from '../../components/home/HeroSection';
import TrendingEvents from '../../components/home/TrendingEvents';
import RecommendedEvents from '../../components/home/RecommendedEvents';
import WhyChooseUs from '../../components/home/WhyChooseUs';
import FAQ from './FAQ';
import Contact from './Contact';
import CategorySection from '../../components/home/CategorySection';


// Sample data for demo purposes when backend is not running
const sampleEvents = [
  {
    _id: '1',
    title: 'Kathmandu hiking Group',
    description: 'Join us for an amazing hiking experience',
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
    date: '2025-06-15',
    time: '6:00 AM',
    location: 'Phulchoki Hikes',
    price: 0,
    currency: 'NPR',
    isFeatured: true,
    tags: ['Outdoor']
  },
  {
    _id: '2',
    title: 'Tech Innovation Conference',
    description: 'Explore the latest in technology',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
    date: '2025-07-20',
    time: '9:00 AM',
    location: 'Kathmandu Mall',
    price: 120,
    currency: 'NPR',
    isFeatured: false,
    tags: []
  },
  {
    _id: '3',
    title: 'Contemporary Art Exhibition',
    description: 'Discover amazing contemporary art',
    category: 'Arts & Culture',
    image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&h=250&fit=crop',
    date: '2025-08-05',
    time: '10:00 AM',
    location: 'Gorkha Museum',
    price: 0,
    currency: 'NPR',
    isFeatured: false,
    tags: ['Confirmed']
  },
  {
    _id: '4',
    title: 'Outdoor Garden Party',
    description: 'Enjoy a beautiful garden party',
    category: 'Social & Networking',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=250&fit=crop',
    date: '2025-09-10',
    time: '3:00 PM',
    location: 'Botanical Gardens',
    price: 30,
    currency: 'NPR',
    isFeatured: true,
    tags: ['Social', 'Business']
  },
  {
    _id: '5',
    title: 'Business Networking Event',
    description: 'Network with industry professionals',
    category: 'Business Seminar',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
    date: '2025-10-18',
    time: '7:00 PM',
    location: 'Hilton Hotel',
    price: 25,
    currency: 'NPR',
    isFeatured: false,
    tags: ['Business']
  },
  {
    _id: '6',
    title: 'Chess Tournaments',
    description: 'Compete in exciting chess matches',
    category: 'Sports & Fitness',
    image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=250&fit=crop',
    date: '2025-11-22',
    time: '8:00 PM',
    location: 'Dwarika Hotel',
    price: 50,
    currency: 'NPR',
    isFeatured: false,
    tags: ['Sports']
  }
];

const HomePage = () => {
  const [trendingEvents, setTrendingEvents] = useState([]);
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationBasis, setRecommendationBasis] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, categoryRes, recommendationsRes] = await Promise.all([
          eventsAPI.getAll(),
          eventsAPI.getCategoryCounts(),
          recommendationAPI.getRecommendedEvents(6)
        ]);
        setTrendingEvents(trendingRes.data.events);
        setCategoryCounts(categoryRes.data.counts);
        setRecommendedEvents(recommendationsRes.data.events);
        setRecommendationBasis(recommendationsRes.data.basedOn);
      } catch (error) {
        console.log('Using sample data - backend may not be running');
        setTrendingEvents(sampleEvents);
        setCategoryCounts([]);
        setRecommendedEvents([]);
      } finally {
        setLoading(false);
        setRecommendationsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="home-page">
      <HeroSection />
      <CategorySection categoryCounts={categoryCounts} />
      <RecommendedEvents
        events={recommendedEvents}
        loading={recommendationsLoading}
        basedOn={recommendationBasis}
      />
      <TrendingEvents events={trendingEvents} loading={loading} />
      <WhyChooseUs />
      <FAQ />
      <Contact />
    </main>
  );
};

export default HomePage;
