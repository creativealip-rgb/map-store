"use client";

import { useCart, updateOrderStatus } from "@/context/CartContext";
import { OrderStatus, formatPrice, Order } from "@/lib/types";
import { useState } from "react";
import { Search, Filter, ChevronDown, CheckCircle, XCircle, Clock, Package } from "lucide-react";

export default function OrdersPage() {
    const { getAllOrders } = useCart();
    const orders = getAllOrders();
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOrders = orders
        .filter((order) => {
            if (statusFilter !== "all" && order.status !== statusFilter) return false;
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    order.id.toLowerCase().includes(query) ||
                    order.userId.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .reverse();

    const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
        updateOrderStatus(orderId, newStatus);
        // Force refresh since we're using localStorage directly in helper
        window.location.reload();
    };

    const StatusBadge = ({ status }: { status: OrderStatus }) => {
        const styles = {
            pending: "text-amber-400 bg-amber-400/10",
            paid: "text-blue-400 bg-blue-400/10",
            processing: "text-purple-400 bg-purple-400/10",
            completed: "text-green-400 bg-green-400/10",
            cancelled: "text-red-400 bg-red-400/10",
        };

        const icons = {
            pending: Clock,
            paid: CheckCircle,
            processing: Package,
            completed: CheckCircle,
            cancelled: XCircle,
        };

        const Icon = icons[status];

        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                <Icon className="w-3.5 h-3.5" />
                <span className="capitalize">{status}</span>
            </span>
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Pesanan</h1>
                <p className="text-white/60">Kelola pesanan masuk</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari Order ID..."
                        className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>
                <div className="relative w-full md:w-48">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                        className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-colors appearance-none cursor-pointer"
                    >
                        <option value="all">Semua Status</option>
                        <option value="pending">Menunggu Pembayaran</option>
                        <option value="paid">Sudah Dibayar</option>
                        <option value="processing">Sedang Diproses</option>
                        <option value="completed">Selesai</option>
                        <option value="cancelled">Dibatalkan</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-surface rounded-2xl border border-white/10">
                        <p className="text-white/40">Tidak ada pesanan ditemukan</p>
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="bg-surface border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
                            <div className="p-6">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-mono font-medium">#{order.id}</h3>
                                            <StatusBadge status={order.status} />
                                        </div>
                                        <p className="text-sm text-white/60">
                                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right mr-4">
                                            <p className="text-sm text-white/60">Total Pesanan</p>
                                            <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
                                        </div>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                            className="bg-black/20 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary/50 cursor-pointer"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="paid">Paid</option>
                                            <option value="processing">Processing</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    {order.items.map((item) => (
                                        <div key={item.product.id} className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg ${item.product.imageColor} flex-shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{item.product.title}</p>
                                                <p className="text-sm text-white/60">{item.product.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{item.product.price}</p>
                                                <p className="text-sm text-white/60">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-sm text-white/40">
                                    <p>Customer ID: {order.userId}</p>
                                    {order.paidAt && (
                                        <p>Dibayar: {new Date(order.paidAt).toLocaleString("id-ID")}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
