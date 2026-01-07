"use client";

import { useAdmin } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function AdminLoginPage() {
    const { login } = useAdmin();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const success = login(email, password);
            if (success) {
                router.push("/admin");
            } else {
                setError("Email atau password salah");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        Admin Portal
                    </h1>
                    <p className="text-white/60">Masuk untuk mengelola toko</p>
                </div>

                <div className="bg-surface border border-white/10 rounded-2xl p-8 backdrop-blur-sm shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="admin@mapstore.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                "Memproses..."
                            ) : (
                                <>
                                    Masuk Dashboard
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/40">
                        <p>Demo Credentials:</p>
                        <p>Email: admin@mapstore.com</p>
                        <p>Password: admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
