"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { formatPrice, Order, CartItem } from "@/lib/types";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Copy, Check, MessageCircle, CreditCard, Building2, Smartphone, QrCode, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense, useRef } from "react";

// Payment info - Replace with actual data
const PAYMENT_INFO = {
    bank: [
        {
            name: "BCA",
            accountNumber: "1234567890",
            accountName: "MAP Store",
            icon: Building2,
        },
        {
            name: "Mandiri",
            accountNumber: "0987654321",
            accountName: "MAP Store",
            icon: Building2,
        },
        {
            name: "BRI",
            accountNumber: "5678901234",
            accountName: "MAP Store",
            icon: Building2,
        },
    ],
    ewallet: [
        { name: "OVO", number: "08123456789", icon: Smartphone },
        { name: "DANA", number: "08123456789", icon: Smartphone },
        { name: "GoPay", number: "08123456789", icon: Smartphone },
    ],
    whatsapp: "6281234567890", // WhatsApp number for confirmation
};

function PaymentContent() {
    const { items, getCartTotal, createOrder } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const orderLoadedRef = useRef(false);

    // Get orderId from URL if present (coming from dashboard)
    const urlOrderId = searchParams.get('orderId');

    // Load existing order from localStorage or create new one
    useEffect(() => {
        // Skip if already loaded
        if (orderLoadedRef.current) {
            return;
        }

        if (!user) {
            router.push("/checkout");
            return;
        }

        // If orderId is in URL, load that order from localStorage
        if (urlOrderId) {
            const ordersStr = localStorage.getItem("map_store_orders");
            const orders: Order[] = ordersStr ? JSON.parse(ordersStr) : [];
            const existingOrder = orders.find(o => o.id === urlOrderId);

            if (existingOrder) {
                setOrder(existingOrder);
                setIsLoading(false);
                orderLoadedRef.current = true;
                return;
            }
        }

        // If cart has items, create new order
        if (items.length > 0) {
            const newOrder = createOrder(user.id);
            setOrder(newOrder);
            setIsLoading(false);
            orderLoadedRef.current = true;
            return;
        }

        // If no order found and cart is empty, redirect to home
        if (!urlOrderId && items.length === 0) {
            router.push("/");
            return;
        }

        setIsLoading(false);
    }, [user, items, router, urlOrderId, createOrder]);


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedText(text);
        setTimeout(() => setCopiedText(null), 2000);
    };

    // Use order total (saved before cart was cleared) instead of cart total
    const total = order?.total || getCartTotal();
    const orderItems = order?.items || items;

    const handleConfirmPayment = () => {
        const itemsList = orderItems.map((item: CartItem) =>
            `• ${item.product.title} x${item.quantity}`
        ).join("\n");

        const message = encodeURIComponent(
            `Halo Admin MAP Store! 👋\n\n` +
            `Saya sudah melakukan pembayaran:\n` +
            `📦 Order ID: ${order?.id}\n` +
            `💰 Total: ${formatPrice(total)}\n\n` +
            `📋 Produk:\n${itemsList}\n\n` +
            `👤 Nama: ${user?.name}\n` +
            `📧 Email: ${user?.email}\n` +
            `📱 WhatsApp: ${user?.whatsapp}\n\n` +
            `Mohon diproses ya, terima kasih! 🙏`
        );
        window.open(`https://wa.me/${PAYMENT_INFO.whatsapp}?text=${message}`, "_blank");
    };

    if (!user || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-white/60">Loading...</div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-white/60 mb-4">Order tidak ditemukan</p>
                    <Link href="/" className="text-primary hover:underline">Kembali ke Beranda</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Pembayaran</h1>
                        <p className="text-white/60">Silakan transfer sesuai total pesanan</p>
                    </div>
                </div>

                {/* Order Info Card */}
                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30 rounded-2xl p-6 mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <p className="text-white/60 text-sm mb-1">Order ID</p>
                            <p className="font-mono text-lg font-bold text-primary">{order?.id}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-sm mb-1">Total yang harus dibayar</p>
                            <p className="text-4xl font-bold text-white">{formatPrice(total)}</p>
                        </div>
                    </div>

                    {/* Timer Warning */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2 text-amber-400">
                        <Clock className="w-5 h-5" />
                        <span className="text-sm">
                            Selesaikan pembayaran dalam 24 jam untuk menghindari pembatalan otomatis
                        </span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Bank Transfer */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-blue-500/20 rounded-xl">
                                <CreditCard className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Transfer Bank</h3>
                                <p className="text-white/60 text-sm">BCA, Mandiri, BRI</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {PAYMENT_INFO.bank.map((bank) => (
                                <div
                                    key={bank.name}
                                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{bank.name}</span>
                                        <span className="text-xs text-white/40">a.n. {bank.accountName}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-lg">{bank.accountNumber}</span>
                                        <button
                                            onClick={() => copyToClipboard(bank.accountNumber)}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                            {copiedText === bank.accountNumber ? (
                                                <Check className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* E-Wallet */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-500/20 rounded-xl">
                                <Smartphone className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">E-Wallet</h3>
                                <p className="text-white/60 text-sm">OVO, DANA, GoPay</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {PAYMENT_INFO.ewallet.map((wallet) => (
                                <div
                                    key={wallet.name}
                                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{wallet.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-lg">{wallet.number}</span>
                                        <button
                                            onClick={() => copyToClipboard(wallet.number)}
                                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                                        >
                                            {copiedText === wallet.number ? (
                                                <Check className="w-4 h-4 text-green-400" />
                                            ) : (
                                                <Copy className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* QRIS */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-purple-500/20 rounded-xl">
                            <QrCode className="w-6 h-6 text-purple-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">QRIS</h3>
                            <p className="text-white/60 text-sm">Scan dengan aplikasi e-wallet atau mobile banking manapun</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl">
                        {/* Placeholder for QRIS - Replace with actual QRIS image */}
                        <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
                            <div className="text-center text-gray-500">
                                <QrCode className="w-12 h-12 mx-auto mb-2" />
                                <p className="text-sm">QRIS</p>
                                <p className="text-xs">Coming Soon</p>
                            </div>
                        </div>
                        <p className="mt-4 text-gray-600 text-sm">Scan untuk membayar {formatPrice(total)}</p>
                    </div>
                </div>

                {/* Confirm Payment Button */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="font-bold text-lg mb-4">Sudah melakukan pembayaran?</h3>
                    <p className="text-white/60 mb-6">
                        Klik tombol di bawah untuk konfirmasi pembayaran via WhatsApp.
                        Admin akan memverifikasi dan mengirimkan akun premium Anda.
                    </p>

                    <button
                        onClick={handleConfirmPayment}
                        className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                        <MessageCircle className="w-6 h-6" />
                        Konfirmasi Pembayaran via WhatsApp
                    </button>

                    <div className="mt-6 text-center">
                        <Link
                            href="/dashboard"
                            className="text-primary hover:underline text-sm"
                        >
                            Lihat status pesanan di Dashboard →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-white/60">Loading...</div>
            </div>
        }>
            <PaymentContent />
        </Suspense>
    );
}
