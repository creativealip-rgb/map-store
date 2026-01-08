"use client";

import ProductCard from "./ProductCard";
import { useState, useEffect, useMemo } from "react";
import { Search, X, ShoppingCart, CreditCard, CheckCircle, MessageCircle, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface CatalogProps {
    products: any[];
    categories: any[];
}

const PRODUCTS_PER_PAGE = 8;

const Catalog = ({ products, categories }: CatalogProps) => {
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [showHowToOrder, setShowHowToOrder] = useState(false);
    const [showMobileFilter, setShowMobileFilter] = useState(false);
    const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" });
    const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "newest">("default");
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedFilters, setExpandedFilters] = useState({
        category: true,
        price: true,
    });

    // Listen for custom event from Navbar to open Cara Order popup
    useEffect(() => {
        const handleOpenCaraOrder = () => setShowHowToOrder(true);
        window.addEventListener('openCaraOrder', handleOpenCaraOrder);
        return () => window.removeEventListener('openCaraOrder', handleOpenCaraOrder);
    }, []);

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchQuery, priceRange, sortBy]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = products.filter((p) => {
            const matchesCategory = activeCategory === "all" || p.category.toLowerCase() === activeCategory.toLowerCase();
            const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category.toLowerCase().includes(searchQuery.toLowerCase());

            // Price filter
            const productPrice = typeof p.price === 'string' ? parseInt(p.price.replace(/[^0-9]/g, '')) : p.price;
            const minPrice = priceRange.min ? parseInt(priceRange.min) * 1000 : 0;
            const maxPrice = priceRange.max ? parseInt(priceRange.max) * 1000 : Infinity;
            const matchesPrice = productPrice >= minPrice && productPrice <= maxPrice;

            return matchesCategory && matchesSearch && matchesPrice;
        });

        // Sort
        if (sortBy === "price-asc") {
            result = [...result].sort((a, b) => {
                const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^0-9]/g, '')) : a.price;
                const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^0-9]/g, '')) : b.price;
                return priceA - priceB;
            });
        } else if (sortBy === "price-desc") {
            result = [...result].sort((a, b) => {
                const priceA = typeof a.price === 'string' ? parseInt(a.price.replace(/[^0-9]/g, '')) : a.price;
                const priceB = typeof b.price === 'string' ? parseInt(b.price.replace(/[^0-9]/g, '')) : b.price;
                return priceB - priceA;
            });
        }

        return result;
    }, [products, activeCategory, searchQuery, priceRange, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    // Get active filters for display
    const activeFilters = useMemo(() => {
        const filters: { key: string; label: string }[] = [];
        if (activeCategory !== "all") {
            const cat = categories.find(c => c.id === activeCategory);
            filters.push({ key: "category", label: cat?.name || activeCategory });
        }
        if (priceRange.min) filters.push({ key: "minPrice", label: `Min: Rp ${priceRange.min}K` });
        if (priceRange.max) filters.push({ key: "maxPrice", label: `Max: Rp ${priceRange.max}K` });
        if (searchQuery) filters.push({ key: "search", label: `"${searchQuery}"` });
        return filters;
    }, [activeCategory, priceRange, searchQuery, categories]);

    const clearFilter = (key: string) => {
        switch (key) {
            case "category": setActiveCategory("all"); break;
            case "minPrice": setPriceRange(prev => ({ ...prev, min: "" })); break;
            case "maxPrice": setPriceRange(prev => ({ ...prev, max: "" })); break;
            case "search": setSearchQuery(""); break;
        }
    };

    const clearAllFilters = () => {
        setActiveCategory("all");
        setPriceRange({ min: "", max: "" });
        setSearchQuery("");
        setSortBy("default");
    };

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

    // Filter Sidebar Component
    const FilterSidebar = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className={`${isMobile ? "" : "sticky top-24"}`}>
            <div className="space-y-6">
                {/* Categories */}
                <div className="border border-border">
                    <button
                        onClick={() => setExpandedFilters(prev => ({ ...prev, category: !prev.category }))}
                        className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                    >
                        <span className="font-bold text-white text-sm uppercase tracking-wider">Kategori</span>
                        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${expandedFilters.category ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilters.category && (
                        <div className="px-4 pb-4 space-y-2">
                            <button
                                onClick={() => setActiveCategory("all")}
                                className={`w-full text-left px-3 py-2 text-sm transition-colors ${activeCategory === "all"
                                        ? "bg-primary text-background font-medium"
                                        : "text-white/60 hover:text-white hover:bg-surface-hover"
                                    }`}
                            >
                                Semua Produk
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors ${activeCategory === cat.id
                                            ? "bg-primary text-background font-medium"
                                            : "text-white/60 hover:text-white hover:bg-surface-hover"
                                        }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Price Range */}
                <div className="border border-border">
                    <button
                        onClick={() => setExpandedFilters(prev => ({ ...prev, price: !prev.price }))}
                        className="w-full flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                    >
                        <span className="font-bold text-white text-sm uppercase tracking-wider">Rentang Harga</span>
                        <ChevronDown className={`w-4 h-4 text-white/50 transition-transform ${expandedFilters.price ? "rotate-180" : ""}`} />
                    </button>
                    {expandedFilters.price && (
                        <div className="px-4 pb-4">
                            <div className="flex items-center gap-2">
                                <div className="flex-1">
                                    <label className="text-xs text-white/40 mb-1 block">Min (Ribuan)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                        className="w-full px-3 py-2 bg-surface border border-border text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary"
                                    />
                                </div>
                                <span className="text-white/40 mt-5">—</span>
                                <div className="flex-1">
                                    <label className="text-xs text-white/40 mb-1 block">Max (Ribuan)</label>
                                    <input
                                        type="number"
                                        placeholder="∞"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                        className="w-full px-3 py-2 bg-surface border border-border text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-primary"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-white/30 mt-2">Contoh: 50 = Rp 50.000</p>
                        </div>
                    )}
                </div>

                {/* Clear Filters */}
                {activeFilters.length > 0 && (
                    <button
                        onClick={clearAllFilters}
                        className="w-full py-3 border border-border text-white/60 text-sm hover:border-accent hover:text-accent transition-colors"
                    >
                        Reset Semua Filter
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <>
            <section id="catalog" className="pt-28 pb-20 bg-background relative z-10">
                <div className="container mx-auto px-4 md:px-8">

                    {/* Header */}
                    <div className="mb-8 text-center animate-fade-in-up">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                            Pilih Paket <span className="text-primary">Premium</span> Anda
                        </h2>
                        <p className="text-white/50 text-lg max-w-xl mx-auto">Harga termurah untuk hiburan & produktivitas tanpa batas.</p>
                    </div>

                    {/* Main Layout: Sidebar + Content */}
                    <div className="flex flex-col lg:flex-row gap-8">

                        {/* Sidebar - Desktop */}
                        <aside className="hidden lg:block w-64 shrink-0 animate-fade-in-up">
                            <div className="mb-4">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <SlidersHorizontal className="w-5 h-5" />
                                    Filter Produk
                                </h3>
                            </div>
                            <FilterSidebar />
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Top Bar: Search + Sort + Mobile Filter */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-6 animate-fade-in-up [animation-delay:100ms]">
                                {/* Search */}
                                <div className="relative flex-1">
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

                                {/* Sort Dropdown */}
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                                    className="px-4 py-3 bg-surface border border-border text-white text-sm focus:outline-none focus:border-white/40 cursor-pointer"
                                >
                                    <option value="default">Urutkan</option>
                                    <option value="price-asc">Harga: Terendah</option>
                                    <option value="price-desc">Harga: Tertinggi</option>
                                    <option value="newest">Terbaru</option>
                                </select>

                                {/* Mobile Filter Button */}
                                <button
                                    onClick={() => setShowMobileFilter(true)}
                                    className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border text-white hover:border-white/40 transition-colors"
                                >
                                    <SlidersHorizontal className="w-5 h-5" />
                                    <span className="text-sm font-medium">Filter</span>
                                </button>
                            </div>

                            {/* Applied Filters */}
                            {activeFilters.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 mb-6 animate-fade-in">
                                    <span className="text-sm text-white/40">Filter Aktif:</span>
                                    {activeFilters.map((filter) => (
                                        <button
                                            key={filter.key}
                                            onClick={() => clearFilter(filter.key)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border text-sm text-white hover:border-accent hover:text-accent transition-colors group"
                                        >
                                            {filter.label}
                                            <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Results Count */}
                            <div className="mb-4 text-sm text-white/40">
                                Menampilkan {paginatedProducts.length} dari {filteredProducts.length} produk
                            </div>

                            {/* Products Grid */}
                            <div
                                key={`${activeCategory}-${currentPage}`}
                                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-in"
                            >
                                {paginatedProducts.map((product) => (
                                    <ProductCard key={product.id} {...product} />
                                ))}
                                {paginatedProducts.length === 0 && (
                                    <div className="col-span-full py-16 text-center">
                                        <p className="text-white/50 text-lg">
                                            {searchQuery ? `Tidak ada produk untuk "${searchQuery}"` : "Produk untuk filter ini tidak ditemukan."}
                                        </p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="mt-4 px-6 py-2 border border-primary text-primary hover:bg-primary hover:text-background transition-colors"
                                        >
                                            Reset Filter
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 mt-10 animate-fade-in-up">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 border border-border text-white/60 hover:border-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 border text-sm font-medium transition-colors ${currentPage === page
                                                    ? "bg-primary text-background border-primary"
                                                    : "border-border text-white/60 hover:border-white/40 hover:text-white"
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 border border-border text-white/60 hover:border-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </section>

            {/* Mobile Filter Drawer */}
            {showMobileFilter && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/80" onClick={() => setShowMobileFilter(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background border-r border-border animate-slide-in-right p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <SlidersHorizontal className="w-5 h-5" />
                                Filter Produk
                            </h3>
                            <button
                                onClick={() => setShowMobileFilter(false)}
                                className="p-2 border border-border hover:border-white/40 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <FilterSidebar isMobile />
                        <button
                            onClick={() => setShowMobileFilter(false)}
                            className="w-full mt-6 py-3 bg-primary text-background font-bold hover:bg-primary/90 transition-colors"
                        >
                            Terapkan Filter
                        </button>
                    </div>
                </div>
            )}

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
