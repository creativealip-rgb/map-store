"use client";

import Link from "next/link";
import { Instagram, Send } from "lucide-react";

const Footer = () => {
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

    return (
        <footer className="relative bg-surface border-t border-border overflow-hidden">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-5 group">
                            <span className="text-3xl font-light tracking-[0.2em] text-white uppercase hover:text-primary transition-colors">
                                MAP<span className="font-bold">Store</span>
                            </span>
                        </Link>
                        <p className="text-white/50 mb-6 max-w-md leading-relaxed">
                            Platform <span className="text-white">#1 Indonesia</span> untuk beli akun premium 2025. Netflix, Spotify, Canva, ChatGPT, dan 50+ layanan lainnya dengan harga terbaik dan garansi penuh. Dipercaya oleh ribuan pelanggan setiap bulan.
                        </p>
                        <div className="flex gap-3">
                            <Link
                                href="#"
                                className="w-11 h-11 border border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#"
                                className="w-11 h-11 border border-border flex items-center justify-center hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-widest">Menu</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/"
                                    onClick={(e) => scrollToSection(e, '/')}
                                    className="text-white/50 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                                >
                                    <span className="w-0 h-px bg-primary group-hover:w-3 transition-all"></span>
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#catalog"
                                    onClick={(e) => scrollToSection(e, '#catalog')}
                                    className="text-white/50 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                                >
                                    <span className="w-0 h-px bg-primary group-hover:w-3 transition-all"></span>
                                    Katalog
                                </Link>
                            </li>
                            <li>
                                <button
                                    onClick={openCaraOrder}
                                    className="text-white/50 hover:text-primary transition-colors text-sm inline-flex items-center gap-2 group"
                                >
                                    <span className="w-0 h-px bg-primary group-hover:w-3 transition-all"></span>
                                    Cara Order
                                </button>
                            </li>
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
                        </ul>
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
