"use client";

import { useAdmin } from "@/context/AdminContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react"; // Added useState
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, ShoppingCart, LogOut, Menu, X } from "lucide-react"; // Added Menu, X

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { isAdmin, loading, logout } = useAdmin();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setSidebarOpen] = useState(false); // Added state
    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        if (!loading && !isAdmin && !isLoginPage) {
            router.push("/admin/login");
        }
    }, [isAdmin, loading, router, isLoginPage]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-white/60">Loading Admin...</div>
            </div>
        );
    }

    if (isLoginPage) {
        return <div className="min-h-screen bg-background">{children}</div>;
    }

    if (!isAdmin) {
        return null;
    }

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Produk", icon: ShoppingBag },
        { href: "/admin/orders", label: "Pesanan", icon: ShoppingCart },
    ];

    return (
        <div className="min-h-screen bg-background flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-64 bg-surface border-r border-white/10 p-6 flex flex-col z-50 transition-transform duration-300
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="flex items-center justify-between mb-10">
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Admin Panel
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-2 text-white/60 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="pt-6 border-t border-white/10">
                    <button
                        onClick={() => {
                            logout();
                            setSidebarOpen(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-colors w-full"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center p-4 border-b border-white/10 bg-background/80 backdrop-blur-md sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 -ml-2 text-white/60 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 font-semibold">Admin Panel</span>
                </div>

                <div className="p-4 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
