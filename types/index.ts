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
    // Override natin to: Sa admin page, kasama na ang items
    order_items: OrderItemWithProduct[]; 
  }