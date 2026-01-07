"use client";

import { useAdmin } from "@/context/AdminContext";
import { Product } from "@/lib/types";
import { useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Upload } from "lucide-react";
import Image from "next/image";

// Predefined categories for dropdown
const CATEGORIES = ["Streaming", "Music", "Design", "Productivity", "Games"];

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        price: "",
        originalPrice: "",
        category: CATEGORIES[0],
        features: "",
        imageColor: "bg-gray-500",
        isBestSeller: false,
    });

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                price: product.price,
                originalPrice: product.originalPrice || "",
                category: product.category,
                features: product.features.join("\n"),
                imageColor: product.imageColor,
                isBestSeller: product.isBestSeller || false,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                title: "",
                price: "",
                originalPrice: "",
                category: CATEGORIES[0],
                features: "",
                imageColor: "bg-gradient-to-br from-gray-500 to-black",
                isBestSeller: false,
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            title: formData.title,
            price: formData.price,
            originalPrice: formData.originalPrice,
            category: formData.category,
            features: formData.features.split("\n").filter(f => f.trim()),
            imageColor: formData.imageColor,
            isBestSeller: formData.isBestSeller,
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, productData);
        } else {
            addProduct({
                ...productData,
                image: "/products/default.png", // Placeholder image
            });
        }

        setIsModalOpen(false);
    };

    const handleDelete = (id: number) => {
        if (confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            deleteProduct(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Produk</h1>
                    <p className="text-white/60">Kelola katalog produk</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Produk
                </button>
            </div>

            {/* Search and Filter */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari produk..."
                    className="w-full md:w-96 bg-surface border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
                />
            </div>

            {/* Products Table */}
            <div className="bg-surface border border-white/10 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-white/5 text-white/60 text-sm">
                            <tr>
                                <th className="p-4">Produk</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg ${product.imageColor} flex-shrink-0`} />
                                            <div>
                                                <p className="font-medium">{product.title}</p>
                                                <p className="text-xs text-white/40">{product.features.length} fitur</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-white/10">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4 font-semibold">{product.price}</td>
                                    <td className="p-4">
                                        {product.isBestSeller && (
                                            <span className="text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                                                Best Seller
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleOpenModal(product)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-400"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-red-400"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-surface border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-surface border-b border-white/10 p-6 flex items-center justify-between z-10">
                            <h2 className="text-xl font-bold">
                                {editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Nama Produk</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                                        placeholder="Contoh: Netflix Premium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat} className="bg-surface">{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Harga Jual</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                                        placeholder="Rp 35.000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-white/80">Harga Coret (Opsional)</label>
                                    <input
                                        type="text"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50"
                                        placeholder="Rp 150.000"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Fitur (Satu per baris)</label>
                                <textarea
                                    required
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                    className="w-full h-32 bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50 resize-none"
                                    placeholder="4K Quality&#10;Garansi 30 Hari&#10;Private Account"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Warna Card (Gradient Tailwind)</label>
                                <input
                                    type="text"
                                    value={formData.imageColor}
                                    onChange={(e) => setFormData({ ...formData, imageColor: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 focus:outline-none focus:border-primary/50 font-mono text-sm"
                                    placeholder="bg-gradient-to-br from-red-600 to-black"
                                />
                                <div className={`h-12 w-full rounded-lg mt-2 ${formData.imageColor}`} />
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="isBestSeller"
                                    checked={formData.isBestSeller}
                                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                                    className="w-5 h-5 rounded border-white/10 bg-black/20 text-primary focus:ring-primary"
                                />
                                <label htmlFor="isBestSeller" className="text-sm font-medium text-white/80 cursor-pointer">
                                    Tandai sebagai Best Seller
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-xl transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl transition-colors"
                                >
                                    {editingProduct ? "Simpan Perubahan" : "Tambah Produk"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
