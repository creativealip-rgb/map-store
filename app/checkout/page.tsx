"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice } from "@/lib/utils";
import { createOrderAction } from "@/lib/actions/orders";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
    const { items, getCartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        whatsapp: "",
        paymentMethod: "QRIS",
    });

    const total = getCartTotal();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await createOrderAction({
                userId: user?.id,
                guestInfo: {
                    name: formData.name,
                    email: formData.email,
                    whatsapp: formData.whatsapp,
                },
                totalAmount: total,
                paymentMethod: formData.paymentMethod,
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    priceAtTime: parseFloat(item.product.price.toString().replace(/\D/g, '')),
                })),
            });

            if (result.success) {
                // Manually save to localStorage for User Dashboard visibility
                // since we are using local auth and DB doesn't have our user ID
                const localOrder = {
                    id: result.orderId,
                    userId: user?.id || "guest",
                    items: [...items],
                    total: total,
                    status: "pending",
                    createdAt: new Date().toISOString(),
                    guestInfo: {
                        name: formData.name,
                        email: formData.email,
                        whatsapp: formData.whatsapp
                    }
                };

                const existingOrders = JSON.parse(localStorage.getItem("map_store_orders") || "[]");
                existingOrders.push(localOrder);
                localStorage.setItem("map_store_orders", JSON.stringify(existingOrders));

                clearCart();
                router.push(`/checkout/success/${result.orderId}`);
            } else {
                alert("Gagal membuat pesanan. Silakan coba lagi.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <main className="min-h-screen bg-background text-foreground flex flex-col">
                <Navbar />
                <div className="flex-1 container mx-auto px-4 pt-32 pb-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Keranjang Kosong</h1>
                    <p className="text-white/60 mb-8">Anda belum menambahkan produk ke keranjang.</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Store
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-20">
                <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Store
                </Link>

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Form Section */}
                    <div className="space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary" />
                                Informasi Pembeli
                            </h2>
                            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">WhatsApp</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                        placeholder="Contoh: 08123456789"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-white/70 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                                        placeholder="email@contoh.com"
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-6">Metode Pembayaran</h2>
                            <div className="space-y-3">
                                {["QRIS", "Bank Transfer (BCA)", "E-Wallet (Gopay/OVO/Dana)"].map((method) => (
                                    <label key={method} className="flex items-center gap-3 p-4 border border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value={method}
                                            checked={formData.paymentMethod === method}
                                            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                            className="w-4 h-4 text-primary focus:ring-primary"
                                        />
                                        <span>{method}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Ringkasan Pesanan</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.product.id} className="flex gap-4">
                                        <div className={`w-16 h-16 rounded-lg ${item.product.imageColor} shrink-0`} />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{item.product.title}</h3>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-sm text-white/60">{item.quantity}x</span>
                                                <span className="text-primary font-bold">{item.product.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 mb-6">
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">{formatPrice(total)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="checkout-form"
                                disabled={isLoading}
                                className="w-full py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Memproses...
                                    </>
                                ) : (
                                    "Bayar Sekarang"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
