"use client";

import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { Search, X, ShoppingCart, CreditCard, CheckCircle, MessageCircle } from "lucide-react";

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
            <section id="catalog" className="pt-28 pb-20 bg-background relative z-10">
                <div className="container mx-auto px-4 md:px-8">

                    {/* Header - Centered */}
                    <div className="mb-12 text-center animate-fade-in-up">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Pilih Paket <span className="text-primary">Premium</span> Anda
                        </h2>
                        <p className="text-white/50 text-lg max-w-xl mx-auto">Harga termurah untuk hiburan & produktivitas tanpa batas.</p>
                    </div>

                    {/* Search Bar - Centered */}
                    <div className="max-w-sm mx-auto mb-10 animate-fade-in-up [animation-delay:100ms]">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-surface border border-border text-white placeholder:text-white/40 focus:outline-none focus:border-white/40 transition-all"
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

                    {/* Category Filters - Centered */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-10 animate-fade-in-up [animation-delay:200ms]">
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 flex items-center gap-2 transition-all border text-sm font-medium ${activeCategory === cat.id
                                    ? "bg-primary text-background border-primary"
                                    : "bg-transparent text-white/60 border-border hover:border-white/40 hover:text-white"
                                    }`}
                            >
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    <div
                        key={activeCategory}
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 animate-fade-in"
                    >
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} {...product} />
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-16 text-center">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90"
                        onClick={() => setShowHowToOrder(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-surface border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in">
                        {/* Close Button */}
                        <button
                            onClick={() => setShowHowToOrder(false)}
                            className="absolute top-4 right-4 p-2 border border-border hover:border-white/40 transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Modal Content */}
                        <div className="p-8">
                            <h3 className="text-3xl font-bold mb-2 text-center">
                                Cara <span className="text-primary">Order</span>
                            </h3>
                            <p className="text-white/50 text-center mb-8">Ikuti langkah-langkah mudah berikut</p>

                            <div className="space-y-4">
                                {orderSteps.map((step, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 p-5 border border-border hover:border-white/40 transition-colors"
                                    >
                                        <div className="w-12 h-12 bg-surface border border-border flex items-center justify-center shrink-0">
                                            <step.icon className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{step.title}</h4>
                                            <p className="text-sm text-white/50 leading-relaxed">{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setShowHowToOrder(false)}
                                className="w-full mt-8 py-4 bg-primary text-background font-bold hover:bg-primary/90 transition-all glow-hover"
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
