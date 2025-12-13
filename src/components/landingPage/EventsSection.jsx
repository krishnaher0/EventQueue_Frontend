import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EventCard from './EventCard';
import api from '../api';

// Sample events for demonstration
const sampleEvents = [
    {
        _id: '1',
        title: 'Kathmandu Hiking Group',
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=250&fit=crop',
        date: '2026-06-15',
        time: '6:00 AM',
        location: 'Phulchoki Hikes',
        price: 0,
        category: 'Outdoor',
        tag: 'Featured',
    },
    {
        _id: '2',
        title: 'Tech Innovation Conference',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
        date: '2025-07-20',
        time: '9:00 AM',
        location: 'Kathmandu Mall',
        price: 120,
        category: 'Conference',
        tag: 'Conference',
    },
    {
        _id: '3',
        title: 'Contemporary Art Exhibition',
        image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=400&h=250&fit=crop',
        date: '2025-08-05',
        time: '10:00 AM',
        location: 'Gorkha Museum',
        price: 0,
        category: 'Art',
        tag: 'Art',
    },
    {
        _id: '4',
        title: 'Outdoor Garden Party',
        image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=250&fit=crop',
        date: '2025-09-10',
        time: '3:00 PM',
        location: 'Botanical Gardens',
        price: 30,
        category: 'Social',
        tag: 'Outdoor',
    },
    {
        _id: '5',
        title: 'Business Networking Event',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
        date: '2025-10-18',
        time: '7:00 PM',
        location: 'Hilton Hotel',
        price: 25,
        category: 'Business',
        tag: 'Business',
    },
    {
        _id: '6',
        title: 'Chess Tournaments',
        image: 'https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400&h=250&fit=crop',
        date: '2025-11-22',
        time: '8:00 PM',
        location: 'Dwarika Hotel',
        price: 50,
        category: 'Sports',
        tag: 'Sports',
    },
];

const EventsSection = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                setEvents(data.length > 0 ? data : sampleEvents);
            } catch (error) {
                console.error('Error fetching events:', error);
                setEvents(sampleEvents);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Events</h2>
                        <p className="text-gray-600">Don't miss out on these popular events happening near you</p>
                    </div>
                    <Link
                        to="/events"
                        className="hidden md:inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        View All Events
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-5 space-y-3">
                                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.slice(0, 6).map((event) => (
                            <EventCard key={event._id} event={event} />
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center md:hidden">
                    <Link
                        to="/events"
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        View All Events
                        <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EventsSection;
