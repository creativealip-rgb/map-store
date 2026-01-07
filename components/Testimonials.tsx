const testimonials = [
    {
        name: "Budi Santoso",
        role: "Mahasiswa",
        text: "Udah langganan Netflix 3 bulan di sini, gapernah ada masalah. Admin fast respown banget!",
        rating: 5,
    },
    {
        name: "Siti Aminah",
        role: "Freelancer",
        text: "Cari Canva Pro murah tapi legal susah, untung ketemu MAP Store. Fitur lengkap, tim saya seneng.",
        rating: 5,
    },
    {
        name: "Rizky Ramadhan",
        role: "Gamer",
        text: "Beli akun game di sini garansinya beneran jalan. Pernah error login, lapor lgsg diganti baru.",
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section id="testimonials" className="py-20 bg-surface border-y border-border">
            <div className="container mx-auto px-4 md:px-8">
                {/* Header - Centered */}
                <div className="mb-16 text-center animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                        Kata <span className="text-primary">Mereka</span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-xl mx-auto">Ribuan pelanggan sudah membuktikan kualitas kami.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {testimonials.map((t, i) => (
                        <div
                            key={i}
                            className="bg-background border border-border p-8 hover:border-white/40 transition-colors animate-fade-in-up"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Stars */}
                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, j) => (
                                    <svg key={j} className="w-4 h-4 text-primary fill-primary" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>

                            {/* Quote */}
                            <p className="text-white/70 mb-8 leading-relaxed">"{t.text}"</p>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-surface border border-border flex items-center justify-center font-bold text-white text-sm">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                                    <p className="text-white/40 text-xs">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
