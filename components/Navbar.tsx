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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
            <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="group">
                    <span className="text-2xl font-light tracking-[0.2em] text-white uppercase hover:text-primary transition-colors">
                        MAP<span className="font-bold">Store</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                    >
                        Home
                    </Link>
                    <button
                        onClick={() => {
                            const event = new CustomEvent('openCaraOrder');
                            window.dispatchEvent(event);
                        }}
                        className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                    >
                        Cara Order
                    </button>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-3">
                    {/* Cart Button */}
                    <button
                        onClick={() => setCartOpen(true)}
                        className="relative p-2.5 border border-border hover:border-white/40 hover:bg-surface transition-all"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-background text-xs font-bold flex items-center justify-center">
                                {cartCount > 9 ? "9+" : cartCount}
                            </span>
                        )}
                    </button>

                    {/* User Button / Login */}
                    {user ? (
                        <div className="relative hidden md:block">
                            <button
                                onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2.5 border border-border hover:border-white/40 hover:bg-surface transition-all"
                            >
                                <div className="w-6 h-6 bg-primary flex items-center justify-center text-xs font-bold text-background">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium max-w-[100px] truncate">
                                    {user.name}
                                </span>
                            </button>

                            {/* User Dropdown */}
                            {isUserMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border overflow-hidden animate-pop-in origin-top-right">
                                    {user.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-surface-hover transition-colors"
                                            onClick={() => setUserMenuOpen(false)}
                                        >
                                            <LayoutDashboard className="w-4 h-4 text-primary" />
                                            Admin Panel
                                        </Link>
                                    )}
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-surface-hover transition-colors"
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
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-accent hover:bg-accent/10 transition-colors"
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
                            className="hidden md:flex items-center gap-2 px-5 py-2.5 border border-border hover:border-white/40 hover:bg-surface text-white text-sm font-semibold transition-all"
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
                <div className="md:hidden bg-surface border-t border-border">
                    <div className="container mx-auto px-4 py-4 space-y-1">
                        <Link
                            href="/"
                            className="block py-3 px-4 text-white/70 hover:text-white hover:bg-surface-hover transition-colors"
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
                            className="w-full text-left py-3 px-4 text-white/70 hover:text-white hover:bg-surface-hover transition-colors"
                        >
                            Cara Order
                        </button>
                        <hr className="border-border my-2" />
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link
                                        href="/admin"
                                        className="flex items-center gap-3 py-3 px-4 text-white/70 hover:text-white hover:bg-surface-hover transition-colors"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Admin Panel
                                    </Link>
                                )}
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 py-3 px-4 text-white/70 hover:text-white hover:bg-surface-hover transition-colors"
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
                                    className="w-full flex items-center gap-3 py-3 px-4 text-accent hover:bg-accent/10 transition-colors"
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
                                className="w-full flex items-center gap-3 py-3 px-4 text-white/70 hover:text-white hover:bg-surface-hover transition-colors"
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
