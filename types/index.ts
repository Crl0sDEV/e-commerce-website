// types/index.ts

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    category?: string;
    stock?: number;
    created_at?: string;
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }
  
  // Bagong definition para sa Admin Dashboard fetch
  export interface OrderItemWithProduct {
    id: string;
    quantity: number;
    price_at_purchase: number;
    // Dahil naka-join ang table, ganito ang itsura ng return ni Supabase
    products: Product | null; 
  }
  
  export interface Order {
    id: string;
    created_at: string;
    customer_name: string;
    customer_address: string;
    customer_contact: string;
    total_amount: number;
    status: string;
    payment_method: string;
    discount_amount: number;
    subtotal: number;
    // Override natin to: Sa admin page, kasama na ang items
    order_items: OrderItemWithProduct[]; 
  }

  
export interface Profile {
  id: string
  full_name: string | null
  phone_number: string | null
  address: string | null
  avatar_url: string | null
  updated_at: string | null
}