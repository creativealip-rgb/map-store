"use client";

import { formatPrice, calculateDiscount } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Check, ShoppingCart, CheckCircle, Sparkles, ShieldCheck, Zap, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Product } from "@/lib/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProductDetailClientProps {
    product: any; // We'll type this better or trust Drizzle return
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    // Ensure features is an array (handle potential JSON parsing if needed, though Drizzle usually handles it)
    const features = Array.isArray(product.features) ? product.features :
        (typeof product.features === 'string' ? JSON.parse(product.features) : []);

    const handleAddToCart = () => {
        const productData: Product = {
            id: product.id,
            title: product.name, // generic name from DB to title
            price: formatPrice(product.price),
            originalPrice: product.originalPrice ? formatPrice(product.originalPrice) : undefined,
            features: features,
            isBestSeller: product.isBestSeller,
            category: product.categoryId, // categoryId from DB as category
            imageColor: product.imageColor,
            image: product.image,
        };

        addToCart(productData);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    const discount = calculateDiscount(product.originalPrice, product.price);
    const formattedPrice = formatPrice(product.price);
    const formattedOriginalPrice = product.originalPrice ? formatPrice(product.originalPrice) : null;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-20">
                {/* Back Button */}
                <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-primary transition-colors mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Store
                </Link>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative">
                        <div className={`aspect-square rounded-3xl ${product.imageColor} relative overflow-hidden flex items-center justify-center`}>
                            {product.image && (
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    width={300}
                                    height={300}
                                    className="object-contain drop-shadow-2xl z-10"
                                />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                            {/* Badges */}
                            {product.isBestSeller && (
                                <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-20">
                                    <Sparkles className="w-3 h-3" />
                                    BEST SELLER
                                </div>
                            )}
                            {discount && (
                                <div className="absolute top-6 right-6 bg-red-500/90 text-white text-sm font-bold px-3 py-1.5 rounded-full z-20">
                                    -{discount}%
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="flex flex-col">
                        {/* Category */}
                        <span className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">{product.categoryId}</span>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-bold mb-6">{product.name}</h1>

                        {/* Price */}
                        <div className="flex items-end gap-3 mb-8">
                            <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">{formattedPrice}</span>
                            {formattedOriginalPrice && (
                                <span className="text-lg text-white/30 line-through mb-1">{formattedOriginalPrice}</span>
                            )}
                            {discount && (
                                <span className="text-sm text-green-400 font-semibold mb-1">Hemat {discount}%</span>
                            )}
                        </div>

                        {/* Features */}
                        <div className="bg-white/5 rounded-2xl p-6 mb-8 border border-white/10">
                            <h3 className="font-bold mb-4 text-lg">Yang Kamu Dapatkan:</h3>
                            <ul className="space-y-3">
                                {features.map((feature: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-white/80">
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            {[
                                { icon: Zap, label: "Proses Kilat" },
                                { icon: ShieldCheck, label: "Full Garansi" },
                                { icon: MessageCircle, label: "Support 24/7" },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-3 bg-white/5 rounded-xl border border-white/10">
                                    <item.icon className="w-5 h-5 text-primary mb-2" />
                                    <span className="text-xs text-white/60">{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Add to Cart Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={isAdded}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 ${isAdded
                                ? "bg-green-500 text-white cursor-default"
                                : "bg-gradient-to-r from-primary to-cyan-500 text-black hover:shadow-[0_0_40px_-5px_var(--color-primary)] hover:scale-[1.02] active:scale-95"
                                }`}
                        >
                            {isAdded ? (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Berhasil Ditambahkan ke Keranjang
                                </>
                            ) : (
                                <>
                                    <ShoppingCart className="w-5 h-5" />
                                    Tambah ke Keranjang
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
