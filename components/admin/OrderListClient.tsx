"use client";

import { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { updateOrderStatusAction } from "@/lib/actions/dashboard";
import { useState } from "react";
import { Loader2, Search, Filter } from "lucide-react";

interface OrderListProps {
    orders: any[]; // Using any for now as Drizzle type inference is tricky with relations
}

export default function OrderListClient({ orders }: OrderListProps) {
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const filteredOrders = orders.filter((order) => {
        const matchesFilter = filter === "all" || order.status === filter;
        const guestInfo = order.guestInfo as { name: string } | null;
        const matchesSearch =
            order.id.toLowerCase().includes(search.toLowerCase()) ||
            (guestInfo?.name || "").toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        await updateOrderStatusAction(orderId, newStatus as any);
        setUpdatingId(null);
    };

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                    <input
                        type="text"
                        placeholder="Cari ID Order atau Nama Customer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                    {["all", "pending", "paid", "processing", "completed", "cancelled"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${filter === status
                                    ? "bg-primary text-black"
                                    : "bg-white/5 text-white/70 hover:bg-white/10"
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5">
                            <tr>
                                <th className="p-4 font-semibold text-white/60">ID Order</th>
                                <th className="p-4 font-semibold text-white/60">Customer</th>
                                <th className="p-4 font-semibold text-white/60">Items</th>
                                <th className="p-4 font-semibold text-white/60">Total</th>
                                <th className="p-4 font-semibold text-white/60">Status</th>
                                <th className="p-4 font-semibold text-white/60">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredOrders.map((order) => {
                                const guestInfo = order.guestInfo as { name: string; whatsapp: string } | null;
                                return (
                                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-mono text-sm">
                                            {order.id.slice(0, 8)}...
                                            <div className="text-xs text-white/40 mt-1">
                                                {new Date(order.createdAt).toLocaleDateString("id-ID")}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-medium">{guestInfo?.name || "Guest"}</div>
                                            <div className="text-xs text-white/40">{guestInfo?.whatsapp}</div>
                                        </td>
                                        <td className="p-4 text-sm">
                                            {order.items.map((item: any) => (
                                                <div key={item.id} className="truncate max-w-[200px]">
                                                    {item.quantity}x {item.product?.name || "Unknown"}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="p-4 font-bold text-primary">
                                            {formatPrice(order.totalAmount)}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize inline-flex
                                                ${order.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                                    order.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                                                        order.status === 'paid' ? 'bg-blue-500/20 text-blue-400' :
                                                            order.status === 'processing' ? 'bg-purple-500/20 text-purple-400' :
                                                                'bg-red-500/20 text-red-400'}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {updatingId === order.id ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            ) : (
                                                <select
                                                    value={order.status || "pending"}
                                                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                                    className="bg-black/20 border border-white/10 rounded-lg py-1 px-2 text-sm focus:outline-none focus:border-primary cursor-pointer"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="paid">Paid</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="completed">Completed</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                    <div className="p-8 text-center text-white/40">
                        Tidak ada pesanan yang ditemukan.
                    </div>
                )}
            </div>
        </div>
    );
}
