"use client";

import { useAuth } from "@/context/AuthContext";
import { getOrders } from "@/context/CartContext";
import { formatPrice, Order } from "@/lib/types";
import { useRouter } from "next/navigation";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, MessageCircle, User, Mail, Phone, ShoppingBag, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const statusConfig: Record<Order["status"], { label: string; color: string; icon: typeof Clock }> = {
    pending: { label: "Menunggu Pembayaran", color: "text-amber-400 bg-amber-400/10", icon: Clock },
    paid: { label: "Pembayaran Diterima", color: "text-blue-400 bg-blue-400/10", icon: CheckCircle },
    processing: { label: "Sedang Diproses", color: "text-purple-400 bg-purple-400/10", icon: Package },
    completed: { label: "Selesai", color: "text-green-400 bg-green-400/10", icon: CheckCircle },
    cancelled: { label: "Dibatalkan", color: "text-red-400 bg-red-400/10", icon: XCircle },
};

export default function DashboardPage() {
    const { user, setAuthModalOpen, setAuthMode } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            setAuthMode("login");
            setAuthModalOpen(true);
            router.push("/");
        }
    }, [user, router, setAuthMode, setAuthModalOpen]);

    // Load orders
    useEffect(() => {
        if (user) {
            const userOrders = getOrders(user.id);
            setOrders(userOrders.reverse()); // Show newest first
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse text-white/60">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-20">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/"
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                        <p className="text-white/60">Kelola akun dan pantau pesanan Anda</p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* User Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-24">
                            {/* Profile Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-2xl font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold">{user.name}</h2>
                                    <p className="text-white/60 text-sm">Member sejak {new Date(user.createdAt).toLocaleDateString("id-ID")}</p>
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                    <Mail className="w-5 h-5 text-primary" />
                                    <span className="text-white/80 text-sm">{user.email}</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                                    <Phone className="w-5 h-5 text-primary" />
                                    <span className="text-white/80 text-sm">{user.whatsapp}</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-primary">{orders.length}</p>
                                    <p className="text-white/60 text-sm">Total Order</p>
                                </div>
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
                                    <p className="text-2xl font-bold text-green-400">
                                        {orders.filter((o) => o.status === "completed").length}
                                    </p>
                                    <p className="text-white/60 text-sm">Selesai</p>
                                </div>
                            </div>

                            {/* Need Help */}
                            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-sm text-white/60 mb-3">Butuh bantuan?</p>
                                <a
                                    href="https://wa.me/6281234567890"
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Hubungi Admin
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Orders Section */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <ShoppingBag className="w-6 h-6 text-primary" />
                                <h2 className="text-xl font-bold">Riwayat Pesanan</h2>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                                    <p className="text-white/60 mb-2">Belum ada pesanan</p>
                                    <p className="text-white/40 text-sm mb-6">Yuk mulai belanja!</p>
                                    <Link
                                        href="/#catalog"
                                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl transition-colors"
                                    >
                                        Lihat Katalog
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map((order) => {
                                        const status = statusConfig[order.status];
                                        const StatusIcon = status.icon;

                                        return (
                                            <div
                                                key={order.id}
                                                className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-colors"
                                            >
                                                {/* Order Header */}
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                    <div>
                                                        <p className="font-mono text-sm text-white/60">Order #{order.id}</p>
                                                        <div className="flex items-center gap-2 text-white/50 text-sm mt-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                                                day: "numeric",
                                                                month: "long",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${status.color}`}>
                                                        <StatusIcon className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{status.label}</span>
                                                    </div>
                                                </div>

                                                {/* Order Items */}
                                                <div className="space-y-2 mb-4">
                                                    {order.items.map((item) => (
                                                        <div key={item.product.id} className="flex items-center gap-3">
                                                            <div className={`w-10 h-10 rounded-lg ${item.product.imageColor} flex-shrink-0`} />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium truncate">{item.product.title}</p>
                                                                <p className="text-white/60 text-sm">x{item.quantity}</p>
                                                            </div>
                                                            <p className="font-semibold">{item.product.price}</p>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Order Total */}
                                                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                                    <span className="text-white/60">Total</span>
                                                    <span className="text-xl font-bold text-primary">{formatPrice(order.total)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
