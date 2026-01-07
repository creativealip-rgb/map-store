"use client";

import { useAdmin } from "@/context/AdminContext";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/types";
import { DollarSign, ShoppingBag, Clock, Package } from "lucide-react";

export default function AdminDashboard() {
    const { products, adminUser } = useAdmin();
    const { getAllOrders } = useCart();
    const orders = getAllOrders();

    const stats = [
        {
            label: "Total Pendapatan",
            value: formatPrice(orders.reduce((acc, order) => {
                return order.status !== 'cancelled' ? acc + order.total : acc;
            }, 0)),
            icon: DollarSign,
            color: "text-green-400",
            bg: "bg-green-400/10",
        },
        {
            label: "Total Order",
            value: orders.length.toString(),
            icon: ShoppingBag,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Pending Orders",
            value: orders.filter((o) => o.status === "pending").length.toString(),
            icon: Clock,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
        {
            label: "Total Produk",
            value: products.length.toString(),
            icon: Package,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
        },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
                <p className="text-white/60">Selamat datang kembali, {adminUser?.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-surface rounded-2xl p-6 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-white/60 text-sm mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-surface rounded-2xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold">Order Terbaru</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/60 text-sm">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders.slice(0, 5).reverse().map((order) => (
                                <tr key={order.id} className="text-sm">
                                    <td className="p-4 font-mono text-white/60">#{order.id.slice(0, 8)}...</td>
                                    <td className="p-4">User {order.userId.slice(0, 4)}...</td>
                                    <td className="p-4 font-semibold">{formatPrice(order.total)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white/10 capitalize
                                            ${order.status === 'completed' ? 'text-green-400 bg-green-400/10' : ''}
                                            ${order.status === 'pending' ? 'text-amber-400 bg-amber-400/10' : ''}
                                            ${order.status === 'processing' ? 'text-purple-400 bg-purple-400/10' : ''}
                                            ${order.status === 'cancelled' ? 'text-red-400 bg-red-400/10' : ''}
                                        `}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-white/60">
                                        {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-white/40">
                                        Belum ada order masuk
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
