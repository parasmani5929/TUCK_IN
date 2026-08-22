import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cart')) || [];
    } catch {
      return [];
    }
  });

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (food, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.food_id === food._id.toString());
      if (existing) {
        return prev.map((item) =>
          item.food_id === food._id.toString()
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          food_id: food._id.toString(),
          name: food.name,
          price: food.price,
          image: food.image,
          quantity,
        },
      ];
    });
    toast.success(`${food.name} added to cart!`);
  };

  const removeFromCart = (food_id) => {
    setCart((prev) => prev.filter((item) => item.food_id !== food_id));
  };

  const updateQuantity = (food_id, quantity) => {
    if (quantity <= 0) return removeFromCart(food_id);
    setCart((prev) =>
      prev.map((item) => (item.food_id === food_id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
