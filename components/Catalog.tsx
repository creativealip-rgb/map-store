"use client";

import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { Search, X, HelpCircle, ShoppingCart, CreditCard, CheckCircle, MessageCircle } from "lucide-react";

interface CatalogProps {
    products: any[];
    categories: any[];
}

const Catalog = ({ products, categories }: CatalogProps) => {
    const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showHowToOrder, setShowHowToOrder] = useState(false);

    // Listen for custom event from Navbar to open Cara Order popup
    useEffect(() => {
        const handleOpenCaraOrder = () => setShowHowToOrder(true);
        window.addEventListener('openCaraOrder', handleOpenCaraOrder);
        return () => window.removeEventListener('openCaraOrder', handleOpenCaraOrder);
    }, []);

    const filteredProducts = products.filter((p) => {
        const matchesCategory = activeCategory === "all" || p.category.toLowerCase() === activeCategory.toLowerCase();
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const orderSteps = [
        {
            icon: Search,
            title: "1. Pilih Produk",
            description: "Cari dan pilih akun premium yang kamu butuhkan dari katalog kami. Klik pada kartu produk untuk melihat detail lengkap.",
        },
        {
            icon: ShoppingCart,
            title: "2. Tambah ke Keranjang",
            description: "Klik tombol 'Tambah ke Keranjang' pada halaman detail produk. Kamu bisa menambahkan beberapa produk sekaligus.",
        },
        {
            icon: CreditCard,
            title: "3. Checkout & Pembayaran",
            description: "Buka keranjang, isi data diri (Nama, Email, WhatsApp), lalu pilih metode pembayaran: QRIS, E-Wallet, atau Transfer Bank.",
        },
        {
            icon: CheckCircle,
            title: "4. Konfirmasi Pembayaran",
            description: "Setelah pembayaran berhasil, konfirmasi otomatis akan dikirim. Simpan bukti pembayaran untuk referensi.",
        },
        {
            icon: MessageCircle,
            title: "5. Terima Akun",
            description: "Akun akan dikirim via WhatsApp dalam hitungan menit. Jika ada kendala, hubungi customer support kami.",
        },
    ];

    return (
        <>
            <section id="catalog" className="pt-24 pb-20 bg-background relative z-10">
                <div className="container mx-auto px-4">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-4">
                            Pilih Paket <span className="text-primary">Premium</span> Anda
                        </h2>
                        <p className="text-white/60 text-lg">Harga termurah untuk hiburan & produktivitas tanpa batas.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-10">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-full flex items-center gap-2 transition-all border text-sm ${activeCategory === cat.id
                                    ? "bg-primary text-black font-bold border-primary shadow-[0_0_20px_-5px_var(--color-primary)] scale-105"
                                    : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full text-center py-10">
                                <p className="text-white/50 text-lg">
                                    {searchQuery ? `Tidak ada produk untuk "${searchQuery}"` : "Produk untuk kategori ini sedang restock."}
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </section>

            {/* How to Order Modal */}
            {showHowToOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={() => setShowHowToOrder(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-surface border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowHowToOrder(false)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Content */}
                        <div className="p-8">
                            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                                Cara <span className="text-primary">Order</span>
                            </h3>
                            <p className="text-white/60 text-center mb-8">Ikuti langkah-langkah mudah berikut</p>

                            <div className="space-y-6">
                                {orderSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center shrink-0">
                                            <step.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{step.title}</h4>
                                            <p className="text-sm text-white/60 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowHowToOrder(false)}
                                className="w-full mt-8 py-3 rounded-xl bg-gradient-to-r from-primary to-cyan-500 text-black font-bold hover:shadow-[0_0_30px_-5px_var(--color-primary)] transition-all"
                            >
                                Mulai Belanja Sekarang
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Catalog;
