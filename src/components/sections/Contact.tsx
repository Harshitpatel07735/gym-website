"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

export default function Contact() {
    return (
        <section id="contact" className="py-24 md:py-40 px-6 md:px-12 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

                    {/* Left Column: Map and Info */}
                    <div className="space-y-12">
                        <div className="space-y-4">
                            <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary block">
                                Find Us
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                                Location & <br /> <span className="text-gradient">Hours</span>
                            </h2>
                        </div>

                        {/* Map Container */}
                        <div className="aspect-video lg:aspect-square w-full rounded-2xl overflow-hidden glass border-white/5 relative group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.6175405108603!2d-73.9877119!3d40.7484405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1709384000000!5m2!1sen!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) brightness(95%) contrast(90%)" }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="opacity-50 group-hover:opacity-80 transition-opacity duration-700"
                            />
                            <div className="absolute inset-0 pointer-events-none border-2 border-primary/10 rounded-2xl group-hover:border-primary/30 transition-colors duration-500" />
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <MapPin size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold uppercase tracking-widest text-[#00e5ff]">Address</div>
                                        <div className="text-muted text-sm leading-relaxed">
                                            742 Industrial Blvd, Unit 3<br />Brooklyn, NY 11222
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Phone size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold uppercase tracking-widest text-[#00e5ff]">Phone</div>
                                        <div className="text-muted text-sm">+91 98765 43210</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Mail size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold uppercase tracking-widest text-[#00e5ff]">Email</div>
                                        <div className="text-muted text-sm">info@irontemple.com</div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                        <Clock size={20} />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="text-sm font-bold uppercase tracking-widest text-[#00e5ff]">Staffed Hours</div>
                                        <div className="text-muted text-sm space-y-2">
                                            <div className="flex justify-between gap-4">
                                                <span className="text-white/60">MON - FRI</span>
                                                <span className="text-white">6:00 AM - 9:00 PM</span>
                                            </div>
                                            <div className="flex justify-between gap-4">
                                                <span className="text-white/60">SAT - SUN</span>
                                                <span className="text-white">8:00 AM - 6:00 PM</span>
                                            </div>
                                            <div className="pt-2 text-[10px] font-bold uppercase tracking-widest text-secondary italic">
                                                24/7 Key Fob Access
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:pt-32">
                        <div className="glass p-8 md:p-12 rounded-3xl space-y-10 relative overflow-hidden group">
                            {/* Subtle gradient background for the form */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                            <div className="space-y-2">
                                <h3 className="text-3xl font-black uppercase tracking-tight italic">
                                    Send a <span className="text-primary">Message</span>
                                </h3>
                                <p className="text-muted text-sm">
                                    Got questions? Our team will get back to you within 24 hours.
                                </p>
                            </div>

                            <form className="space-y-6">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block ml-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        placeholder="Marcus Kane"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block ml-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        placeholder="marcus@example.com"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted block ml-1">
                                        Your Message
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        placeholder="I'm interested in the Elite Boxing program..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full btn-primary flex items-center justify-center gap-3 group/btn py-5"
                                >
                                    <span>Transmit Message</span>
                                    <Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
