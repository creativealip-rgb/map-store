"use client";

import Link from "next/link";
import { Instagram, Send, Mail } from "lucide-react";
import { useState } from "react";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const openCaraOrder = () => {
        const event = new CustomEvent('openCaraOrder');
        window.dispatchEvent(event);
    };

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('#')) {
            e.preventDefault();
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else if (href === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const productLinks = [
        { name: "Streaming", href: "#catalog" },
        { name: "Design Tools", href: "#catalog" },
        { name: "Productivity", href: "#catalog" },
        { name: "Gaming", href: "#catalog" },
        { name: "VPN & Security", href: "#catalog" },
    ];

    const categoryLinks = [
        { name: "Premium Accounts", href: "#catalog" },
        { name: "Bundling Packages", href: "#catalog" },
        { name: "Best Sellers", href: "#catalog" },
        { name: "New Arrivals", href: "#catalog" },
    ];

    const socialLinks = [
        { name: "Instagram", href: "#", icon: Instagram },
        { name: "Telegram", href: "#", icon: Send },
    ];

    return (
        <footer className="relative bg-surface border-t border-border overflow-hidden">

            {/* Newsletter Section */}
            <div className="border-b border-border">
                <div className="container mx-auto px-4 md:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                Dapatkan Update <span className="text-primary">Promo Terbaru</span>
                            </h3>
                            <p className="text-white/50">Subscribe newsletter kami dan jangan lewatkan penawaran menarik!</p>
                        </div>
                        <form onSubmit={handleSubscribe} className="flex w-full max-w-md">
                            <div className="relative flex-1">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    placeholder="Masukkan email kamu"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-background border border-border text-white placeholder:text-white/40 focus:outline-none focus:border-primary transition-all"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-4 bg-primary text-background font-bold hover:bg-primary/90 transition-colors whitespace-nowrap"
                            >
                                {subscribed ? "Berhasil! ✓" : "Subscribe"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="inline-block mb-5 group">
                            <span className="text-3xl font-light tracking-[0.2em] text-white uppercase hover:text-primary transition-colors">
                                MAP<span className="font-bold">Store</span>
                            </span>
                        </Link>
                        <p className="text-white/50 mb-6 max-w-md leading-relaxed">
                            Platform <span className="text-white">#1 Indonesia</span> untuk beli akun premium 2025. Netflix, Spotify, Canva, ChatGPT, dan 50+ layanan lainnya dengan harga terbaik dan garansi penuh.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    className="w-11 h-11 border border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Products */}
                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Produk</h4>
                        <ul className="space-y-3">
                            {productLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        className="text-white/50 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-primary group-hover:w-3 transition-all"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Kategori</h4>
                        <ul className="space-y-3">
                            {categoryLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={(e) => scrollToSection(e, link.href)}
                                        className="text-white/50 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                                    >
                                        <span className="w-0 h-px bg-primary group-hover:w-3 transition-all"></span>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Kontak</h4>
                        <ul className="space-y-4">
                            <li>
                                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">WhatsApp</span>
                                <span className="text-white font-medium">+62 812-3456-7890</span>
                            </li>
                            <li>
                                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Email</span>
                                <span className="text-white font-medium">support@mapstore.id</span>
                            </li>
                            <li>
                                <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Jam Operasional</span>
                                <span className="text-white font-medium">09:00 - 22:00 WIB</span>
                            </li>
                            <li className="pt-2">
                                <button
                                    onClick={openCaraOrder}
                                    className="text-primary hover:underline text-sm font-medium"
                                >
                                    Cara Order →
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Large Brand Typography */}
            <div className="border-t border-border overflow-hidden">
                <div className="container mx-auto px-4 md:px-8 py-8">
                    <div className="text-center">
                        <span className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.3em] text-white/5 uppercase select-none">
                            MAPSTORE
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-border">
                <div className="container mx-auto px-4 md:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-white/30">
                            © 2025 MAP Store. All rights reserved.
                        </p>
                        <p className="text-sm text-white/30">
                            Made with <span className="text-primary">♥</span> by Vibe Coding
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
