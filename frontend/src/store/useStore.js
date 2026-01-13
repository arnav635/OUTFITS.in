import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      cart: [],
      wishlist: [],
      
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
        set({ token });
      },
      
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, cart: [], wishlist: [] });
      },
      
      addToCart: (item) =>
        set((state) => ({
          cart: [...state.cart, item],
        })),
      
      removeFromCart: (index) =>
        set((state) => ({
          cart: state.cart.filter((_, i) => i !== index),
        })),
      
      clearCart: () => set({ cart: [] }),
      
      addToWishlist: (item) =>
        set((state) => ({
          wishlist: [...state.wishlist, item],
        })),
      
      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.product_id !== productId),
        })),
    }),
    {
      name: 'outfits-store',
    }
  )
);

export default useStore;