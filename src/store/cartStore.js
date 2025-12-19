import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      // Cart items array
      items: [],
      
      // Add item to cart
      addItem: (product) => {
        set((state) => {
          // Check if product already exists in cart
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            // If exists, increase quantity
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            };
          } else {
            // If new, add to cart with quantity 1
            return {
              items: [...state.items, { ...product, quantity: 1 }]
            };
          }
        });
      },
      
      // Remove item from cart
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        }));
      },
      
      // Update item quantity
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter(item => item.id !== productId)
          }));
        } else {
          set((state) => ({
            items: state.items.map(item =>
              item.id === productId
                ? { ...item, quantity }
                : item
            )
          }));
        }
      },
      
      // Clear entire cart
      clearCart: () => {
        set({ items: [] });
      },
      
      // Get total items count
      getTotalItems: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Get total price
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => {
          const price = parseFloat(item.price) || 0;
          return total + (price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'click-mart-cart', // localStorage key
    }
  )
);

export default useCartStore;

