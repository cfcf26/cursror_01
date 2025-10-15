// User Types
export interface User {
  id: string;
  email: string;
  area: string; // 지역 (예: "강남구", "서초구")
  created_at: string;
}

// Product Types
export interface Product {
  id: string;
  user_id: string;
  title: string;
  description: string;
  price: number;
  area: string;
  created_at: string;
  updated_at: string;
}

// Chat Types
export interface ChatRoom {
  id: string;
  product_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  user_id: string;
  message: string;
  created_at: string;
}

// Extended Chat Types for UI Components
export interface ChatRoomWithDetails extends ChatRoom {
  products: {
    id: string;
    title: string;
    price: number;
  };
  buyer?: {
    id: string;
    email: string;
  };
  seller?: {
    id: string;
    email: string;
  };
}

