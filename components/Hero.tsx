import { ArrowRight, BadgeCheck, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";

const Hero = () => {
    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32">
            <div className="container mx-auto px-4 md:px-8 relative z-10">

                {/* Centered Layout */}
                <div className="max-w-4xl mx-auto text-center">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-border mb-8 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        <span className="text-xs font-semibold text-white/70 tracking-widest uppercase">Trusted by 1000+ Customers</span>
                    </div>

                    {/* Headline - Bold Swiss Typography - Centered */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 text-white leading-[0.95] animate-fade-in-up [animation-delay:100ms]">
                        Akses Semua<br />
                        <span className="text-primary">Akun Premium</span><br />
                        dalam Satu Genggaman.
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg md:text-xl text-white/60 max-w-xl mx-auto mb-12 leading-relaxed animate-fade-in-up [animation-delay:200ms]">
                        Proses cepat, harga hemat, dan garansi anti-nanggung. Temukan akun streaming, desain, hingga produktivitas hanya di MAP Store.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up [animation-delay:300ms]">
                        <Link
                            href="#catalog"
                            className="group px-8 py-4 bg-primary text-background font-bold text-lg transition-all border border-primary hover:bg-primary/90 glow-hover flex items-center gap-2"
                        >
                            Lihat Katalog
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#testimonials"
                            className="px-8 py-4 bg-transparent border border-border text-white font-semibold text-lg hover:border-white/40 hover:bg-white/5 transition-all flex items-center gap-2"
                        >
                            Pelajari Dulu
                        </Link>
                    </div>

                </div>

                {/* Features / Trust Bar - Grid Layout */}
                <div className="mt-24 pt-12 border-t border-border grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up [animation-delay:400ms]">
                    {[
                        { icon: Zap, label: "Proses Kilat", desc: "Langsung kirim setelah bayar" },
                        { icon: ShieldCheck, label: "Full Garansi", desc: "Anti backroll atau hold" },
                        { icon: BadgeCheck, label: "100% Legal", desc: "Bukan akun curian/hack" },
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 border border-border hover:border-white/30 transition-colors">
                            <div className="w-12 h-12 bg-surface flex items-center justify-center text-primary border border-border">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-lg">{feature.label}</h3>
                                <p className="text-sm text-white/50">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Hero;
