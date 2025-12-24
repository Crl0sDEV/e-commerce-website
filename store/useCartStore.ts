import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'
import { toast } from 'sonner'

interface CartState {
  cart: CartItem[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],

      addItem: (product) => {
        const currentCart = get().cart
        const existingItem = currentCart.find((item) => item.id === product.id)
        const availableStock = product.stock || 0

        if (existingItem) {
          // CHECK: Kung ang nasa cart + 1 ay sobra na sa stock, STOP.
          if (existingItem.quantity + 1 > availableStock) {
            toast.error(`Oops! Only ${availableStock} stocks left for ${product.name}.`)
            return // Stop execution
          }

          // If okay, proceed update
          const updatedCart = currentCart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
          set({ cart: updatedCart })
          toast.success('Added more to cart!')
        } else {
          // New Item Check
          if (availableStock < 1) {
            toast.error('Item is sold out!')
            return
          }

          set({ cart: [...currentCart, { ...product, quantity: 1 }] })
          toast.success(`${product.name} added to cart!`)
        }
      },

      removeItem: (productId) => {
        set({ cart: get().cart.filter((item) => item.id !== productId) })
        toast.info('Item removed from cart.')
      },

      updateQuantity: (productId, quantity) => {
        const currentCart = get().cart
        const item = currentCart.find(i => i.id === productId)
        
        // CHECK: Wag payagan kung sobra sa stock
        if (item && quantity > (item.stock || 0)) {
          toast.error(`Max stock reached (${item.stock}).`)
           return
        }
        
        // CHECK: Wag payagan mag negative or zero
        if (quantity < 1) return

        set({
          cart: currentCart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'shopping-cart-storage',
    }
  )
);

export default useCartStore;