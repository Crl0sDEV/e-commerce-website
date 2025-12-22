import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product, CartItem } from '@/types'

interface CartState {
  cart: CartItem[];
  addItem: (product: Product) => void;
  decreaseItem: (productId: string) => void; // New!
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (product) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === product.id);

        if (existingItem) {
          const updatedCart = currentCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          set({ cart: updatedCart });
        } else {
          set({ cart: [...currentCart, { ...product, quantity: 1 }] });
        }
      },

      // NEW LOGIC: Bawas Quantity
      decreaseItem: (productId) => {
        const currentCart = get().cart;
        const existingItem = currentCart.find((item) => item.id === productId);

        if (existingItem && existingItem.quantity > 1) {
          const updatedCart = currentCart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
          set({ cart: updatedCart });
        }
        // Note: Kung 1 nalang ang quantity, hindi natin buburahin dito.
        // Sa "Trash/Remove" button na yun.
      },

      removeItem: (productId) => {
        set({
          cart: get().cart.filter((item) => item.id !== productId),
        });
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'shopping-cart-storage',
    }
  )
);

export default useCartStore;