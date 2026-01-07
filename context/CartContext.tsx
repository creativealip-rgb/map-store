"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product, Order, generateId, parsePrice, formatPrice } from "@/lib/types";

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getCartTotal: () => number;
    getCartCount: () => number;
    isCartOpen: boolean;
    setCartOpen: (open: boolean) => void;
    createOrder: (userId: string) => Order;
    getAllOrders: () => Order[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_KEY = "map_store_cart";
const ORDERS_KEY = "map_store_orders";

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isCartOpen, setCartOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const storedCart = localStorage.getItem(CART_KEY);
        if (storedCart) {
            setItems(JSON.parse(storedCart));
        }
    }, []);

    // Save cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    // Add product to cart
    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };

    // Remove product from cart
    const removeFromCart = (productId: number) => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId));
    };

    // Update quantity
    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    // Clear cart
    const clearCart = () => {
        setItems([]);
    };

    // Get total price
    const getCartTotal = (): number => {
        return items.reduce((total, item) => {
            return total + parsePrice(item.product.price) * item.quantity;
        }, 0);
    };

    // Get total items count
    const getCartCount = (): number => {
        return items.reduce((count, item) => count + item.quantity, 0);
    };

    // Create order from cart
    const createOrder = (userId: string): Order => {
        const order: Order = {
            id: generateId(),
            userId,
            items: [...items],
            total: getCartTotal(),
            status: "pending",
            createdAt: new Date().toISOString(),
        };

        // Save order to localStorage
        const existingOrders = localStorage.getItem(ORDERS_KEY);
        const orders: Order[] = existingOrders ? JSON.parse(existingOrders) : [];
        orders.push(order);
        localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

        // Clear cart after order
        clearCart();

        return order;
    };

    // Get all orders (for admin)
    const getAllOrders = (): Order[] => {
        if (typeof window === "undefined") return [];
        const ordersStr = localStorage.getItem(ORDERS_KEY);
        return ordersStr ? JSON.parse(ordersStr) : [];
    };

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartTotal,
                getCartCount,
                isCartOpen,
                setCartOpen,
                createOrder,
                getAllOrders,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}

// Helper function to get orders
export function getOrders(userId?: string): Order[] {
    if (typeof window === "undefined") return [];
    const ordersStr = localStorage.getItem(ORDERS_KEY);
    const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];
    if (userId) {
        return orders.filter((o) => o.userId === userId);
    }
    return orders;
}

// Helper function to update order status
export function updateOrderStatus(orderId: string, status: Order["status"]) {
    const ordersStr = localStorage.getItem(ORDERS_KEY);
    const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];
    const updatedOrders = orders.map((o) =>
        o.id === orderId
            ? { ...o, status, ...(status === "paid" ? { paidAt: new Date().toISOString() } : {}) }
            : o
    );
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updatedOrders));
}
