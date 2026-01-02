import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    search: '',
    location: '',
    date: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchParams.search) params.set('search', searchParams.search);
    if (searchParams.location) params.set('location', searchParams.location);
    if (searchParams.date) params.set('date', searchParams.date);
    navigate(`/events?${params.toString()}`);
  };

  return (
    <section className="bg-slate-50 py-12 px-4 lg:px-8 xl:px-12">
      <div className="w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>🎉</span>
              Join 100K+ Event Enthusiasts
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Discover Events That <span className="text-primary">Inspire You</span>
            </h1>

            <p className="text-slate-500 text-lg mb-8 max-w-lg">
              Find and book amazing events, discover unique venues, and connect with your community. Your next unforgettable experience is just a click away.
            </p>

            <div className="flex gap-12">
              <div>
                <span className="text-3xl font-bold text-secondary">50+</span>
                <p className="text-slate-500 text-sm">Events</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-secondary">10+</span>
                <p className="text-slate-500 text-sm">Bookings</p>
              </div>
              <div>
                <span className="text-3xl font-bold text-secondary">50+</span>
                <p className="text-slate-500 text-sm">Venues</p>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/woman.png"
                alt="Event Speaker"
                className="w-full h-[450px] object-cover object-top"
              />
              {/* White card overlay to hide watermark */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-5 rounded-xl shadow-lg">
                <h4 className="font-semibold mb-3 text-slate-800">Why Join EventQueue?</h4>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    5000+ exclusive events
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Special discounts
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Vibrant community
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-600">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Innovative Mindset
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mt-12 max-w-4xl mx-auto bg-white rounded-2xl p-2 shadow-lg flex flex-col lg:flex-row gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-slate-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search events..."
              className="w-full outline-none text-sm"
              value={searchParams.search}
              onChange={(e) => setSearchParams({ ...searchParams, search: e.target.value })}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3 border-b lg:border-b-0 lg:border-r border-slate-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <input
              type="text"
              placeholder="Location"
              className="w-full outline-none text-sm"
              value={searchParams.location}
              onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
            />
          </div>
          <div className="flex-1 flex items-center gap-3 px-4 py-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <input
              type="date"
              className="w-full outline-none text-sm"
              value={searchParams.date}
              onChange={(e) => setSearchParams({ ...searchParams, date: e.target.value })}
            />
          </div>
          <button type="submit" className="bg-secondary text-white px-8 py-3 rounded-xl font-semibold hover:bg-slate-900 transition-colors">
            Search
          </button>
        </form>
      </div>
    </section>
  );
};

export default HeroSection;
