
import { getProductById } from "@/lib/db/queries";
import ProductDetailClient from "@/components/ProductDetailClient";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
    const { id } = await params;
    const productId = parseInt(id);
    const product = await getProductById(productId);

    if (!product) {
        return (
            <main className="min-h-screen bg-background text-foreground">
                <Navbar />
                <div className="container mx-auto px-4 pt-32 pb-20 text-center">
                    <h1 className="text-3xl font-bold mb-4">Produk Tidak Ditemukan</h1>
                    <p className="text-white/60 mb-8">Produk yang kamu cari tidak tersedia.</p>
                    <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-black font-semibold rounded-xl hover:bg-primary/90 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Kembali ke Store
                    </Link>
                </div>
                <Footer />
            </main>
        );
    }

    return <ProductDetailClient product={product} />;
}
