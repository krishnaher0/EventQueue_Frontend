import { useState } from 'react';

const HeroSection = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        console.log({ searchQuery, location, date });
    };

    return (
        <section className="bg-gray-50 py-12 lg:py-20">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm mb-6">
                            <span className="mr-2">🎉</span>
                            Join 100K+ Event Enthusiasts
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Discover Events That
                            <span className="text-indigo-600 block">Inspire You</span>
                        </h1>

                        <p className="text-gray-600 text-lg mb-8">
                            Find and book amazing events, discover unique venues, and connect
                            with your community. Your next unforgettable experience is just a
                            click away.
                        </p>

                        {/* Stats */}
                        <div className="flex space-x-8 mb-8">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">50+</div>
                                <div className="text-gray-500 text-sm">Events</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">10+</div>
                                <div className="text-gray-500 text-sm">Bookings</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">50+</div>
                                <div className="text-gray-500 text-sm">Venues</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Image Card */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-1">
                            <div className="bg-white rounded-xl overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop"
                                    alt="Event crowd"
                                    className="w-full h-64 object-cover"
                                />
                                <div className="p-6 bg-indigo-900 text-white">
                                    <h3 className="text-xl font-semibold mb-4">Why Join EventQueue?</h3>
                                    <ul className="space-y-2">
                                        <li className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Access to 5000+ exclusive events
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Discounts and special offers
                                        </li>
                                        <li className="flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Connect with a vibrant community
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mt-12 bg-white rounded-xl shadow-lg p-4">
                    <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Any date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                onFocus={(e) => e.target.type = 'date'}
                                onBlur={(e) => !e.target.value && (e.target.type = 'text')}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition font-semibold"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
