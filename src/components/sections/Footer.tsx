"use client";

import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-black pt-24 pb-12 px-6 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    {/* Brand */}
                    <div className="space-y-8">
                        <Link href="/" className="text-3xl font-black tracking-tighter text-white">
                            FORGE<span className="text-primary">.</span>
                        </Link>
                        <p className="text-muted text-sm leading-relaxed max-w-xs">
                            The ultimate destination for those seeking elite performance and
                            transformative results. Join the community of the driven.
                        </p>
                        <div className="flex gap-4">
                            {[Instagram, Facebook, Youtube, Twitter].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all text-white/40 hover:text-white">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-black mb-8">Quick Links</h4>
                        <ul className="space-y-4">
                            {["Home", "About", "Facilities", "Pricing", "Contact"].map((item) => (
                                <li key={item}>
                                    <Link href={`#${item.toLowerCase()}`} className="text-sm text-muted hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Facilities */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-black mb-8">Facilities</h4>
                        <ul className="space-y-4">
                            {["Strength", "HIIT", "Boxing", "Yoga", "CrossFit"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-sm text-muted hover:text-primary transition-colors">{item}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-black mb-8">Newsletter</h4>
                        <p className="text-sm text-muted mb-6">Subscribe for training tips and exclusive offers.</p>
                        <div className="flex">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="bg-white/5 border border-white/10 px-4 py-3 rounded-l-lg focus:outline-none focus:border-primary w-full text-sm"
                            />
                            <button className="bg-primary px-6 py-3 rounded-r-lg font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-colors">
                                Join
                            </button>
                        </div>
                        <div className="mt-8 text-[10px] text-muted space-y-2 uppercase tracking-widest font-bold">
                            <div>Mon-Fri 5AM-11PM | Sat-Sun 7AM-9PM</div>
                            <div>123 Elite Way, Fitness District</div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-8">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-muted">
                        © 2025 APEX FITNESS. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-[10px] uppercase tracking-[0.2em] text-muted font-bold">
                        <a href="#" className="hover:text-primary">Privacy Policy</a>
                        <a href="#" className="hover:text-primary">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
