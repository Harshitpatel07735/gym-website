"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));

        if (email === "yogifitness26@gmail.com" && password === "1234") {
            // Store simple auth state
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userEmail", email);
            router.push("/admin");
        } else {
            setError("Invalid credentials. Please use the authorized admin email.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md relative z-10">
                <div className="text-center mb-10">
                    <Link href="/" className="text-4xl font-black tracking-tighter text-white inline-block mb-2">
                        YOGI<span className="text-primary">.</span>
                    </Link>
                    <p className="text-muted text-sm font-medium tracking-widest uppercase">Admin Management Console</p>
                </div>

                <div className="glass p-8 md:p-10 rounded-[2rem] border-white/5 shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Welcome back</h2>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="yogifitness26@gmail.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-white/40 ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/10 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-primary/10 border border-primary/20 text-primary text-xs py-3 px-4 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full py-4 rounded-2xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <span>Sign In to Dashboard</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5 text-center">
                        <p className="text-white/30 text-xs">
                            Restricted access. Authorized personnel only.
                        </p>
                    </div>
                </div>
                
                <div className="mt-8 text-center">
                    <Link href="/" className="text-white/40 hover:text-white text-xs transition-colors flex items-center justify-center gap-2">
                        Back to main website
                    </Link>
                </div>
            </div>
        </div>
    );
}
