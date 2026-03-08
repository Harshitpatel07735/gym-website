"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

const testimonials = [
    {
        name: "Harshit Patel",
        role: "Member for 2 years",
        text: "Apex Fitness transformed my approach to training. The community and elite coaching are unmatched in the city.",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    },
    {
        name: "Sarah Miller",
        role: "Member for 1 year",
        text: "The state-of-the-art facilities and high-energy atmosphere keep me motivated every single day.",
        img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    },
    {
        name: "Robert Fox",
        role: "Member for 6 months",
        text: "I've seen more results in 6 months here than in 3 years at my previous gym. Highly recommended!",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
    },
];

export default function Testimonials() {
    const [active, setActive] = useState(0);

    return (
        <section className="py-24 md:py-40 px-6 md:px-12 bg-accent relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto relative z-10">
                <div className="text-center mb-16 md:mb-24">
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4 block">
                        Testimonials
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                        What Our Members Say
                    </h2>
                </div>

                <div className="relative min-h-[300px] flex flex-col items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <Quote className="mx-auto text-primary opacity-20" size={60} />
                            <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-white/90">
                                "{testimonials[active].text}"
                            </p>

                            <div className="flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                                    <img src={testimonials[active].img} alt={testimonials[active].name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <div className="text-lg font-black uppercase tracking-tight">{testimonials[active].name}</div>
                                    <div className="text-xs text-muted uppercase tracking-widest">{testimonials[active].role}</div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex gap-4 mt-16">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={cn(
                                    "w-12 h-1 transition-all duration-300 rounded-full",
                                    active === i ? "bg-primary w-20" : "bg-white/10 hover:bg-white/20"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
