// import { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Cart = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [cart, setCart] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const saved = localStorage.getItem('cart');
//     if (saved) {
//       setCart(JSON.parse(saved));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   const updateQuantity = (index, newQuantity) => {
//     if (newQuantity < 1) return;
//     setCart((prev) =>
//       prev.map((item, i) =>
//         i === index ? { ...item, quantity: newQuantity } : item
//       )
//     );
//   };

//   const removeItem = (index) => {
//     setCart((prev) => prev.filter((_, i) => i !== index));
//   };

//   const clearCart = () => {
//     setCart([]);
//   };

//   const subtotal = cart.reduce(
//     (acc, item) => acc + item.price * item.quantity,
//     0
//   );
//   const shipping = subtotal >= 5000 ? 0 : 100;
//   const total = subtotal + shipping;

//   const proceedToCheckout = () => {
//     if (!user) {
//       navigate('/login', { state: { from: '/cart' } });
//       return;
//     }
//     navigate('/checkout');
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-16">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <div className="bg-white rounded-2xl shadow-sm p-12">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-24 w-24 mx-auto text-gray-300 mb-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={1.5}
//                 d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
//               />
//             </svg>
//             <h2 className="text-2xl font-bold text-gray-900 mb-4">
//               Your cart is empty
//             </h2>
//             <p className="text-gray-500 mb-8">
//               Looks like you haven't added anything to your cart yet.
//             </p>
//             <Link
//               to="/shop"
//               className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//             >
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Cart Items */}
//           <div className="lg:col-span-2 space-y-4">
//             {cart.map((item, index) => (
//               <div
//                 key={`${item._id}-${item.selectedSize}-${item.selectedColor}`}
//                 className="bg-white rounded-xl shadow-sm p-6 flex gap-6"
//               >
//                 <img
//                   src={item.image || 'https://via.placeholder.com/150'}
//                   alt={item.name}
//                   className="w-24 h-24 object-cover rounded-lg"
//                 />
//                 <div className="flex-1">
//                   <div className="flex justify-between">
//                     <div>
//                       <Link
//                         to={`/shop/${item._id}`}
//                         className="font-semibold text-gray-900 hover:text-indigo-600"
//                       >
//                         {item.name}
//                       </Link>
//                       <p className="text-sm text-gray-500 mt-1">
//                         {item.selectedSize && `Size: ${item.selectedSize}`}
//                         {item.selectedSize && item.selectedColor && ' | '}
//                         {item.selectedColor && `Color: ${item.selectedColor}`}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => removeItem(index)}
//                       className="text-gray-400 hover:text-red-500"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-5 w-5"
//                         viewBox="0 0 20 20"
//                         fill="currentColor"
//                       >
//                         <path
//                           fillRule="evenodd"
//                           d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                           clipRule="evenodd"
//                         />
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="flex justify-between items-end mt-4">
//                     <div className="flex items-center gap-3">
//                       <button
//                         onClick={() => updateQuantity(index, item.quantity - 1)}
//                         className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
//                       >
//                         -
//                       </button>
//                       <span className="font-medium">{item.quantity}</span>
//                       <button
//                         onClick={() => updateQuantity(index, item.quantity + 1)}
//                         className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
//                       >
//                         +
//                       </button>
//                     </div>
//                     <span className="font-bold text-gray-900">
//                       NPR {(item.price * item.quantity).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}

//             <button
//               onClick={clearCart}
//               className="text-red-500 hover:text-red-600 font-medium"
//             >
//               Clear Cart
//             </button>
//           </div>

//           {/* Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
//               <h2 className="text-lg font-bold text-gray-900 mb-6">
//                 Order Summary
//               </h2>

//               <div className="space-y-4">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal ({cart.length} items)</span>
//                   <span>NPR {subtotal.toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Shipping</span>
//                   <span>
//                     {shipping === 0 ? (
//                       <span className="text-green-600">Free</span>
//                     ) : (
//                       `NPR ${shipping}`
//                     )}
//                   </span>
//                 </div>
//                 {subtotal < 5000 && (
//                   <p className="text-sm text-gray-500">
//                     Add NPR {(5000 - subtotal).toLocaleString()} more for free
//                     shipping
//                   </p>
//                 )}
//                 <div className="border-t pt-4">
//                   <div className="flex justify-between text-lg font-bold text-gray-900">
//                     <span>Total</span>
//                     <span>NPR {total.toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={proceedToCheckout}
//                 disabled={loading}
//                 className="w-full mt-6 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
//               >
//                 {loading ? 'Processing...' : 'Proceed to Checkout'}
//               </button>

//               <Link
//                 to="/shop"
//                 className="block text-center mt-4 text-indigo-600 hover:underline"
//               >
//                 Continue Shopping
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;


import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }
    navigate('/checkout');
  };

  // Debug: log cart items
  console.log('Cart Items:', cartItems);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart ({cartItems.length} items)</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-sm p-4 flex gap-4"
              >
                <img
                  src={item.images?.[0] || item.image || '/placeholder.png'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rs. {((item.discountPrice || item.price) * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">Rs. {getCartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>Rs. {getCartTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/shop"
                className="block text-center text-blue-600 hover:underline mt-4 text-sm"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;