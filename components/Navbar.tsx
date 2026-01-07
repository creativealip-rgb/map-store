"use client";

import Link from "next/link";
import { Zap, Menu, ShoppingCart, User, LogOut, LayoutDashboard, X, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

const Navbar = () => {
    const { getCartCount, setCartOpen } = useCart();
    const { user, logout, setAuthModalOpen, setAuthMode } = useAuth();
    const [isUserMenuOpen, setUserMenuOpen] = useState(false);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    const cartCount = getCartCount();

    const handleLogin = () => {
        setAuthMode("login");
        setAuthModalOpen(true);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Zap className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                        MAP Store
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-white/70 hover:text-primary transition-colors"
                    >
                        Home
                    </Link>
                    <button
                        onClick={() => {
                            const event = new CustomEvent('openCaraOrder');
                            window.dispatchEvent(event);
                        }}
                        className="text-sm font-medium text-white/70 hover:text-primary transition-colors"
                    >
                        Cara Order
                    </button>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart Button */}
                    <button
                        onClick={() => setCartOpen(true)}
                        className="relative p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-white text-xs font-bold rounded-full flex items-center justify-center">
                                {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        )}
                    </button>

                    {/* User Button / Login */}
                    {user ? (
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all"
                            >
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-xs font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium max-w-[100px] truncate">
                                    {user.name}
                                </span>
                            </button>

                            {/* User Dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-white/10 rounded-xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-primary" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-white/5 transition-colors"
                                        onClick={() => setUserMenuOpen(false)}
                                    >
                                        <ShoppingBag className="w-4 h-4 text-primary" />
                                        Pesanan Saya
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setUserMenuOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 text-white text-sm font-semibold transition-all"
                        >
                            <User className="w-4 h-4" />
                            Login
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-white/70 hover:text-white"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-surface border-t border-white/5 animate-in slide-in-from-top duration-200">
                    <div className="container mx-auto px-4 py-4 space-y-2">
                        <Link
                            href="/"
                            className="block py-3 px-4 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <button
                            onClick={() => {
                                const event = new CustomEvent('openCaraOrder');
                                window.dispatchEvent(event);
                                setMobileMenuOpen(false);
                            }}
                            className="w-full text-left py-3 px-4 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            Cara Order
                        </button>
                        <hr className="border-white/10" />
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 py-3 px-4 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Admin Panel
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 py-3 px-4 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Pesanan Saya
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => {
                                    handleLogin();
                                    setMobileMenuOpen(false);
                                }}
                                className="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                            >
                                <User className="w-4 h-4" />
                                Login / Register
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
