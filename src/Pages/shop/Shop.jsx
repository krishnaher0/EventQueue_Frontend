import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { productsAPI } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";

// ...existing code...

// Category data with icons
const SHOP_CATEGORIES = [
  {
    id: 'event-gears',
    name: 'Event Gears',
    description: 'Pro cameras, sound, lighting',
    icon: '🎬',
    filter: 'Tech & Gadgets',
  },
  {
    id: 'signed-products',
    name: 'Signed Products',
    description: 'Celebrity autographs & memorabilia',
    icon: '✍️',
    filter: 'Merchandise',
  },
  {
    id: 'chess-gaming',
    name: 'Chess & Gaming',
    description: 'Tournament boards & equipment',
    icon: '♟️',
    filter: 'Sports & Fitness',
  },
  {
    id: 'event-apparel',
    name: 'Event Apparel',
    description: 'Community & festival clothing',
    icon: '👕',
    filter: 'Event Apparel',
  },
  {
    id: 'accessories',
    name: 'Accessories',
    description: 'Badges, wristbands, backdrops',
    icon: '🎒',
    filter: 'Bags & Accessories',
  },
  {
    id: 'festival-items',
    name: 'Festival Items',
    description: 'Holi colors, traditional items',
    icon: '🎨',
    filter: 'Event Supplies',
  },
  {
    id: 'sports-gear',
    name: 'Sports Gear',
    description: 'Jerseys, equipment, accessories',
    icon: '⚽',
    filter: 'Sports & Fitness',
  },
  {
    id: 'tech-community',
    name: 'Tech Community',
    description: 'Meetup & hackathon merch',
    icon: '💻',
    filter: 'Tech & Gadgets',
  },
];

const FILTER_TAGS = [
  { name: 'Pro Equipment', color: 'bg-gray-800 text-white' },
  { name: 'Signed Products', color: 'bg-indigo-600 text-white' },
  { name: 'Gaming Gear', color: 'bg-orange-500 text-white' },
  { name: 'Festive Items', color: 'bg-red-500 text-white' },
];

// Star rating component
const StarRating = ({ rating, reviewCount }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'text-yellow-400'
                : i === fullStars && hasHalfStar
                ? 'text-yellow-400'
                : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-sm text-gray-500">({reviewCount || 0})</span>
    </div>
  );
};

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [pagination, setPagination] = useState({});
  const { addToCart: addToCartContext, cartItemCount } = useCart();
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { sort: '-createdAt' };
      if (selectedCategory) {
        params.category = selectedCategory;
      }
      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCartContext(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleCategoryClick = (filter) => {
    setSelectedCategory(selectedCategory === filter ? null : filter);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Event Merchandise & Equipment
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Professional event gears, signed memorabilia, gaming equipment,
            festival items, and exclusive community apparel. Everything you
            need for your events.
          </p>

          {/* Filter Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag.name}
                onClick={() => setSelectedTag(selectedTag === tag.name ? null : tag.name)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition ${
                  selectedTag === tag.name
                    ? tag.color
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${selectedTag === tag.name ? '' : 'hover:shadow-md'}`}
              >
                {tag.name}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">500+</p>
              <p className="text-gray-500 text-sm">Products</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">50+</p>
              <p className="text-gray-500 text-sm">Signed Items</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600">100%</p>
              <p className="text-gray-500 text-sm">Authentic</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-indigo-600 italic">Fast</p>
              <p className="text-gray-500 text-sm">Delivery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SHOP_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.filter)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedCategory === category.filter
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
              }`}
            >
              <span className="text-3xl mb-3 block">{category.icon}</span>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Trending Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedCategory ? `${selectedCategory}` : 'Trending Products'}
          </h2>
          <Link
            to="/cart"
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Cart ({cartItemCount})
          </Link>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product._id}
                to={`/shop/${product._id}`}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition group"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {/* Badge */}
                  {product.isFeatured && (
                    <span className="absolute top-3 left-3 px-2 py-1 bg-indigo-600 text-white text-xs font-medium rounded">
                      Signed Products
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 line-clamp-2 min-h-[48px]">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="mt-2">
                    <StarRating
                      rating={product.ratings?.average || 4.5}
                      reviewCount={product.ratings?.count || Math.floor(Math.random() * 100) + 10}
                    />
                  </div>

                  {/* Price and Add to Cart */}
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className="text-sm text-gray-500">NPR</span>
                      <span className="text-lg font-bold text-gray-900 ml-1">
                        {product.price.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      disabled={product.stock === 0}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 transition ${
                        product.stock === 0
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`px-4 py-2 rounded-lg transition ${
                  pagination.currentPage === i + 1
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 border hover:border-indigo-500'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
