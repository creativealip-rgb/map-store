"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/types";
import { useRouter } from "next/navigation";

const CartDrawer = () => {
    const {
        items,
        isCartOpen,
        setCartOpen,
        removeFromCart,
        updateQuantity,
        getCartTotal,
        getCartCount
    } = useCart();

    const { user } = useAuth();
    const router = useRouter();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setCartOpen(false);
        router.push("/checkout");
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90 animate-fade-in"
                onClick={() => setCartOpen(false)}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-surface border-l border-border h-full flex flex-col animate-slide-in-right">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Keranjang</h2>
                        <span className="px-2 py-1 bg-surface border border-border text-primary text-sm font-medium">
                            {getCartCount()} item
                        </span>
                    </div>
                    <button
                        onClick={() => setCartOpen(false)}
                        className="p-2 border border-border hover:border-white/40 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <ShoppingBag className="w-16 h-16 text-white/20 mb-4" />
                            <p className="text-white/60 mb-2">Keranjang kosong</p>
                            <p className="text-white/40 text-sm">Yuk mulai belanja!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div
                                    key={item.product.id}
                                    className="bg-background border border-border p-4 hover:border-white/40 transition-colors"
                                >
                                    <div className="flex gap-4">
                                        {/* Product Color */}
                                        <div className={`w-16 h-16 ${item.product.imageColor} flex-shrink-0`} />

                                        {/* Details */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{item.product.title}</h3>
                                            <p className="text-primary font-bold">{item.product.price}</p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                    className="p-1 border border-border hover:border-white/40 transition-colors"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                    className="p-1 border border-border hover:border-white/40 transition-colors"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="ml-auto p-1 text-accent hover:bg-accent/10 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="p-6 border-t border-border space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-white/60">Subtotal</span>
                            <span className="text-2xl font-bold text-primary">
                                {formatPrice(getCartTotal())}
                            </span>
                        </div>

                        {/* Checkout Button */}
                        <button
                            onClick={handleCheckout}
                            className="w-full py-4 bg-primary hover:bg-primary/90 text-background font-bold transition-all glow-hover flex items-center justify-center gap-2"
                        >
                            {user ? "Lanjut ke Checkout" : "Checkout (Bisa Tanpa Login)"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDrawer;
