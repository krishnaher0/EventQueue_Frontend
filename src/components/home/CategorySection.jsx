import { Link } from 'react-router-dom';

const categories = [
  {
    name: 'Business Seminar',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    count: 890,
    color: 'text-slate-800'
  },
  {
    name: 'Social & Networking',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    count: 1300,
    color: 'text-primary'
  },
  {
    name: 'Sports & Fitness',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 2a10 10 0 0 0 0 20"/>
        <path d="M2 12h20"/>
        <path d="M12 2c2.5 2.5 4 6 4 10s-1.5 7.5-4 10"/>
      </svg>
    ),
    count: 920,
    color: 'text-red-500'
  },
  {
    name: 'Food & Drink',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/>
        <line x1="10" y1="1" x2="10" y2="4"/>
        <line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    ),
    count: 780,
    color: 'text-amber-500'
  },
  {
    name: 'Workshops',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    ),
    count: 760,
    color: 'text-emerald-500'
  }
];

const CategorySection = ({ categoryCounts = [] }) => {
  const getCategoryCount = (name) => {
    const category = categoryCounts.find(c => c._id === name);
    return category ? category.count : categories.find(c => c.name === name)?.count || 0;
  };

  return (
    <section className="w-full py-16 px-4 lg:px-8 xl:px-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Browse By Category</h2>
        <p className="text-slate-500">Find events that match your interests and passions</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            to={`/events?category=${encodeURIComponent(category.name)}`}
            className="bg-white border border-slate-200 rounded-xl p-6 text-center transition-all duration-200 hover:border-primary hover:shadow-md hover:-translate-y-0.5"
          >
            <div className={`mb-4 ${category.color}`}>
              {category.icon}
            </div>
            <h3 className="font-semibold mb-1">{category.name}</h3>
            <span className="text-sm text-slate-500">{getCategoryCount(category.name)} Events</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
