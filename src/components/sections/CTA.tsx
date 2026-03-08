"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Phone, ArrowRight } from "lucide-react";

export default function CTA() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <section className="relative py-24 md:py-40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10 -z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-20 -z-20" />

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-8">
                            Ready to <br /> <span className="text-gradient">Transform?</span>
                        </h2>
                        <p className="text-muted text-lg md:text-xl mb-12 max-w-2xl mx-auto">
                            Join today and get your first week FREE. No commitment, no contracts.
                            Your journey to elite fitness starts here.
                        </p>

                        <div className="flex flex-col items-center gap-6">
                            <button
                                onClick={() => setShowModal(true)}
                                className="btn-primary px-12 py-6 text-lg hover:px-16 transition-all duration-500"
                            >
                                Claim Your Free Trial
                            </button>
                            <div className="text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
                                Or call us: +91 98765 43210
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Free Trial Floating Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

                        {/* Modal Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 40 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md glass rounded-3xl p-8 md:p-10 border border-white/10 overflow-hidden"
                        >
                            {/* Decorative gradient */}
                            <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/20 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />

                            {/* Close Button */}
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 z-10"
                            >
                                <X size={18} />
                            </button>

                            {/* Header */}
                            <div className="relative z-10 mb-8">
                                <div className="inline-block bg-gradient-to-r from-primary to-secondary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white mb-4">
                                    Free Trial
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                                    Start Your <span className="text-primary italic">Journey</span>
                                </h3>
                                <p className="text-white/40 text-sm mt-2">
                                    Fill in your details to claim your free week.
                                </p>
                            </div>

                            {/* Form */}
                            <form className="relative z-10 space-y-5" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block ml-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                        <input
                                            type="text"
                                            placeholder="Your full name"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block ml-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                        <input
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 block ml-1">
                                        Contact Number
                                    </label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                                        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-white/50 text-sm font-bold">+91</div>
                                        <input
                                            type="tel"
                                            placeholder="98765 43210"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-[4.5rem] pr-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 group hover:shadow-lg hover:shadow-primary/20 transition-all duration-500 mt-2"
                                >
                                    <span>Claim Free Trial</span>
                                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>

                            <p className="relative z-10 text-[10px] text-white/20 text-center mt-4 uppercase tracking-widest">
                                No credit card required
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
