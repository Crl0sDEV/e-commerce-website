// types/index.ts

export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image_url: string;
    category?: string;   // Added: Ginamit natin to sa SQL at UI
    stock?: number;      // Optional: Kasi baka null sa DB
    created_at?: string; // Optional: Generated ni Supabase
  }
  
  export interface CartItem extends Product {
    quantity: number;
  }