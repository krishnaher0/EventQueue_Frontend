// import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// const CartContext = createContext(null);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(() => {
//     const saved = localStorage.getItem('cart');
//     return saved ? JSON.parse(saved) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem('cart', JSON.stringify(cart));
//   }, [cart]);

//   const addToCart = useCallback((product, quantity = 1, selectedSize = '', selectedColor = '') => {
//     setCart((prev) => {
//       const existingIndex = prev.findIndex(
//         (item) =>
//           item._id === product._id &&
//           item.selectedSize === selectedSize &&
//           item.selectedColor === selectedColor
//       );

//       if (existingIndex > -1) {
//         const updated = [...prev];
//         updated[existingIndex] = {
//           ...updated[existingIndex],
//           quantity: updated[existingIndex].quantity + quantity,
//         };
//         return updated;
//       }
//       return [...prev, { ...product, quantity, selectedSize, selectedColor }];
//     });
//   }, []);

//   const removeFromCart = useCallback((productId, selectedSize = '', selectedColor = '') => {
//     setCart((prev) =>
//       prev.filter(
//         (item) =>
//           !(item._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor)
//       )
//     );
//   }, []);

//   const updateQuantity = useCallback((productId, quantity, selectedSize = '', selectedColor = '') => {
//     if (quantity <= 0) {
//       removeFromCart(productId, selectedSize, selectedColor);
//       return;
//     }
//     setCart((prev) =>
//       prev.map((item) =>
//         item._id === productId && item.selectedSize === selectedSize && item.selectedColor === selectedColor
//           ? { ...item, quantity }
//           : item
//       )
//     );
//   }, [removeFromCart]);

//   const clearCart = useCallback(() => {
//     setCart([]);
//   }, []);

//   const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
//   const cartTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         cartItemCount,
//         cartTotal,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// export default CartContext;


import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize from localStorage immediately
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item._id === product._id);

      if (existingItem) {
        return prevItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.price || 0;
      return total + price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;