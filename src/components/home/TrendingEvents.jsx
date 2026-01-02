import { Link } from 'react-router-dom';
import EventCard from '../events/EventCard';

const TrendingEvents = ({ events = [], loading = false }) => {
  if (loading) {
    return (
      <section className="w-full py-8 px-4 lg:px-8 xl:px-12 pb-16">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Trending Events</h2>
            <p className="text-slate-500">Don't miss out on these popular events happening near you</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="h-44 animate-shimmer"></div>
              <div className="p-5">
                <div className="h-6 animate-shimmer rounded mb-4"></div>
                <div className="h-4 animate-shimmer rounded mb-2"></div>
                <div className="h-4 animate-shimmer rounded w-3/5"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-8 px-4 lg:px-8 xl:px-12 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
        <div>
          <h2 className="text-3xl font-bold mb-2">Trending Events</h2>
          <p className="text-slate-500">Don't miss out on these popular events happening near you</p>
        </div>
        <Link to="/events" className="flex items-center gap-2 text-primary font-medium hover:underline">
          View All Events
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
    </section>
  );
};

export default TrendingEvents;
