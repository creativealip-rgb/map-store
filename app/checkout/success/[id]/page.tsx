
import { db } from "@/lib/db";
import { orders, orderItems, products } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderSuccessPage({ params }: PageProps) {
    const { id } = await params;

    const order = await db.query.orders.findFirst({
        where: eq(orders.id, id),
        with: {
            items: {
                with: {
                    product: true,
                },
            },
        },
    });

    if (!order) {
        return <div>Order not found</div>;
    }

    const guestInfo = order.guestInfo as { name: string; whatsapp: string } | null;
    const customerName = guestInfo?.name || "Customer";

    // Create WhatsApp Message
    const message = `Halo Admin MAP Store, saya ingin konfirmasi pesanan:
    
ID Pesanan: ${order.id}
Nama: ${customerName}
Total: ${formatPrice(parseFloat(order.totalAmount))}

Mohon diproses ya! Terima kasih.`;

    const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`; // Replace with actual Admin WA

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <div className="flex-1 container mx-auto px-4 pt-32 pb-20 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <CheckCircle className="w-10 h-10" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-4">Pesanan Berhasil Dibuat!</h1>
                <p className="text-white/60 mb-8 max-w-md">
                    Terima kasih {customerName}, pesanan kamu sudah kami terima dengan ID <span className="text-primary font-mono">{order.id}</span>.
                    Silakan konfirmasi ke WhatsApp kami untuk menyelesaikan pembayaran.
                </p>

                <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="font-bold mb-4 flex items-center gap-2">
                        <span className="p-1 rounded-md bg-primary/20 text-primary">💰</span>
                        Instruksi Pembayaran
                    </h3>

                    <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-center">
                        <p className="text-sm text-white/60 mb-1">Total yang harus dibayar</p>
                        <p className="text-3xl font-bold text-primary">{formatPrice(parseFloat(order.totalAmount))}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-sm text-white/60 mb-1">Bank BCA</p>
                            <div className="flex justify-between items-center">
                                <p className="font-mono font-medium">1234567890</p>
                                <span className="text-xs text-white/40">a.n MAP Store</span>
                            </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-sm text-white/60 mb-1">Mandiri</p>
                            <div className="flex justify-between items-center">
                                <p className="font-mono font-medium">0987654321</p>
                                <span className="text-xs text-white/40">a.n MAP Store</span>
                            </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <p className="text-sm text-white/60 mb-1">E-Wallet (Dana/OVO/Gopay)</p>
                            <div className="flex justify-between items-center">
                                <p className="font-mono font-medium">081234567890</p>
                                <span className="text-xs text-white/40">a.n MAP Store</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full max-w-md gap-3 mb-12">
                    <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-[#25D366]/20"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Saya Sudah Bayar & Konfirmasi
                    </a>
                    <Link
                        href="/"
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10"
                    >
                        Kembali ke Store
                    </Link>
                </div>

                {/* Order Details Preview */}
                <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 text-left">
                    <h3 className="font-bold mb-4 border-b border-white/10 pb-2">Detail Pesanan</h3>
                    <div className="space-y-3 mb-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-white/80">{item.product?.name || "Unknown Product"} x{item.quantity}</span>
                                <span className="text-white font-medium">{formatPrice(item.priceAtTime)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between font-bold pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(order.totalAmount)}</span>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
