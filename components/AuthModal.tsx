"use client";

import { useState } from "react";
import { X, Mail, Lock, User, Phone, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AuthModal = () => {
    const {
        isAuthModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        login,
        register,
        loginWithGoogle
    } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setName("");
        setWhatsapp("");
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            if (authMode === "login") {
                const result = await login(email, password);
                if (!result.success) {
                    setError(result.error || "Login gagal");
                } else {
                    resetForm();
                }
            } else {
                if (!name || !whatsapp) {
                    setError("Semua field harus diisi");
                    setIsLoading(false);
                    return;
                }
                const result = await register({ email, password, name, whatsapp });
                if (!result.success) {
                    setError(result.error || "Registrasi gagal");
                } else {
                    resetForm();
                }
            }
        } catch {
            setError("Terjadi kesalahan");
        }

        setIsLoading(false);
    };

    const switchMode = () => {
        setAuthMode(authMode === "login" ? "register" : "login");
        setError("");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={() => setAuthModalOpen(false)}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Header */}
                <div className="relative p-6 pb-0">
                    <button
                        onClick={() => setAuthModalOpen(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-2xl font-bold mb-2">
                        {authMode === "login" ? "Selamat Datang! 👋" : "Buat Akun Baru 🚀"}
                    </h2>
                    <p className="text-white/60">
                        {authMode === "login"
                            ? "Login untuk melanjutkan pembelian"
                            : "Daftar untuk mulai berbelanja"}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {authMode === "register" && (
                        <>
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Nama Lengkap</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <label className="text-sm text-white/60">Nomor WhatsApp</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                    <input
                                        type="tel"
                                        value={whatsapp}
                                        onChange={(e) => setWhatsapp(e.target.value)}
                                        placeholder="08123456789"
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="text-sm text-white/60">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@example.com"
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="text-sm text-white/60">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-black font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            authMode === "login" ? "Login" : "Daftar Sekarang"
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-surface text-white/40">atau</span>
                        </div>
                    </div>

                    {/* Google Login */}
                    <button
                        type="button"
                        onClick={loginWithGoogle}
                        className="w-full py-3 bg-white hover:bg-white/90 text-gray-800 font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Login dengan Google
                    </button>

                    {/* Switch Mode */}
                    <p className="text-center text-white/60 text-sm mt-4">
                        {authMode === "login" ? (
                            <>
                                Belum punya akun?{" "}
                                <button
                                    type="button"
                                    onClick={switchMode}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Daftar Sekarang
                                </button>
                            </>
                        ) : (
                            <>
                                Sudah punya akun?{" "}
                                <button
                                    type="button"
                                    onClick={switchMode}
                                    className="text-primary hover:underline font-medium"
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthModal;
