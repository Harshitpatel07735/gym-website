"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Calendar, CreditCard, Award, ChevronRight, LogIn, LogOut, CheckCircle2 } from "lucide-react";

export default function MembershipTracker() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Mock login
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <section id="member-login" className="py-24 relative overflow-hidden bg-background">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
                        Member <span className="text-gradient">Dashboard</span>
                    </h2>
                    <p className="text-muted max-w-2xl mx-auto text-lg">
                        Manage your membership, track your progress, and unlock exclusive rewards. Your journey, your Forge.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <AnimatePresence mode="wait">
                        {!isLoggedIn ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="glass p-8 md:p-12 rounded-3xl border border-white/5 relative overflow-hidden"
                            >
                                <div className="max-w-md mx-auto">
                                    <div className="flex justify-center mb-8">
                                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                                            <User size={32} />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-center mb-8 uppercase tracking-widest">Login to Forge Member</h3>
                                    <form onSubmit={handleLogin} className="space-y-6">
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Email Address</label>
                                            <input
                                                type="email"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                                placeholder="member@forge.com"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs uppercase tracking-widest text-muted mb-2 font-bold">Password</label>
                                            <input
                                                type="password"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>
                                        <button type="submit" className="btn-primary w-full py-5 flex items-center justify-center gap-2 group">
                                            <LogIn size={20} />
                                            <span>Access Dashboard</span>
                                        </button>
                                    </form>


                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {/* Sidebar Info */}
                                <div className="md:col-span-1 space-y-6">
                                    <div className="glass p-6 rounded-3xl border border-white/5 flex flex-col items-center text-center">
                                        <div className="relative mb-4">
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                                                <div className="w-full h-full rounded-full bg-background flex items-center justify-center overflow-hidden">
                                                    <User size={48} className="text-white/20" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-background" />
                                        </div>
                                        <h4 className="text-xl font-bold uppercase tracking-tight">John Forge</h4>
                                        <p className="text-primary text-xs font-black uppercase tracking-[0.2em] mt-1">Elite Member</p>

                                        <button
                                            onClick={handleLogout}
                                            className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-white transition-colors"
                                        >
                                            <LogOut size={14} />
                                            Logout
                                        </button>
                                    </div>

                                    <div className="glass p-6 rounded-3xl border border-white/5">
                                        <h5 className="text-xs uppercase tracking-widest text-muted font-bold mb-4">Achievement Streak</h5>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500">
                                                <Award size={24} />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-black">12 Days</div>
                                                <div className="text-[10px] uppercase tracking-widest text-muted">Personal Best: 24 Days</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Dashboard */}
                                <div className="md:col-span-2 space-y-6">
                                    <div className="glass p-8 rounded-3xl border border-white/5">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-3">
                                                <Calendar className="text-primary" size={24} />
                                                <h5 className="text-lg font-bold uppercase tracking-tight">Membership Status</h5>
                                            </div>
                                            <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-green-500/20">
                                                Active
                                            </span>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
                                                    <span>Membership Usage</span>
                                                    <span className="text-white/60">22 Days Remaining</span>
                                                </div>
                                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "75%" }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                        className="h-full bg-gradient-to-r from-primary to-secondary"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div className="text-[10px] uppercase tracking-widest text-muted mb-1">Join Date</div>
                                                    <div className="text-sm font-bold">Jan 12, 2026</div>
                                                </div>
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                                    <div className="text-[10px] uppercase tracking-widest text-muted mb-1">Expiry Date</div>
                                                    <div className="text-sm font-bold">Mar 12, 2026</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="glass p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                                        <div className="flex items-start justify-between mb-6">
                                            <div>
                                                <h5 className="text-lg font-bold uppercase tracking-tight flex items-center gap-2">
                                                    Renew & Save
                                                    <span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-tighter">Save 20%</span>
                                                </h5>
                                                <p className="text-sm text-muted mt-1">Extend your membership now and get exclusive early renewal discount.</p>
                                            </div>
                                        </div>

                                        <button className="btn-primary w-full py-4 flex items-center justify-center gap-2 group">
                                            <CreditCard size={18} />
                                            <span>Renew Subscription</span>
                                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                        </button>

                                        <div className="mt-4 flex items-center gap-2 justify-center">
                                            <CheckCircle2 size={12} className="text-green-500" />
                                            <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 italic">Automatic discount applied at checkout</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
