// User Types
export interface User {
    id: string;
    email: string;
    name: string;
    whatsapp: string;
    role?: 'admin' | 'user';
    createdAt: string;
}

export interface AdminUser {
    email: string;
    name: string;
}

// Product Types
export interface Product {
    id: number;
    title: string;
    price: string;
    originalPrice?: string;
    features: string[];
    isBestSeller?: boolean;
    category: string;
    imageColor: string;
    image?: string;
}

// Cart Types
export interface CartItem {
    product: Product;
    quantity: number;
}

// Order Types
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'cancelled';

export interface Order {
    id: string;
    userId: string;
    items: CartItem[];
    total: number;
    status: OrderStatus;
    createdAt: string;
    paidAt?: string;
    completedAt?: string;
}

// Helper function to generate unique IDs
export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Helper function to parse price string to number
export const parsePrice = (priceStr: string): number => {
    return parseInt(priceStr.replace(/[^\d]/g, ''), 10);
};

// Helper function to format number to price string
export const formatPrice = (price: number): string => {
    return `Rp ${price.toLocaleString('id-ID')}`;
};
