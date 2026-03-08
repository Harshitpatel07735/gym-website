"use client";

import { useRef, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { Instagram, Twitter } from "lucide-react";

const trainers = [
    {
        name: "Alex 'Iron' Woods",
        role: "Strength & Conditioning",
        img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
    },
    {
        name: "Sarah Jenkins",
        role: "HIIT Specialist",
        img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80",
    },
    {
        name: "Marcus Thorne",
        role: "Professional Boxer",
        img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80",
    },
    {
        name: "Elena Rodriguez",
        role: "Yoga Practitioner",
        img: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&q=80",
    },
];

function TrainerCard({ trainer, index }: { trainer: typeof trainers[0]; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const x = useSpring(0, { stiffness: 300, damping: 30 });
    const y = useSpring(0, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(y, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#111] cursor-pointer"
        >
            <motion.img
                src={trainer.img}
                alt={trainer.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                style={{ transform: "translateZ(20px) scale(1.1)" }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

            <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500" style={{ transform: "translateZ(40px)" }}>
                <div className="text-sm font-bold text-primary uppercase tracking-widest mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {trainer.role}
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white">
                    {trainer.name}
                </h3>

                <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                    <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                        <Instagram size={18} />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all">
                        <Twitter size={18} />
                    </a>
                </div>
            </div>

            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-2xl transition-all duration-500" />

            {/* Glossy overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none transition-opacity duration-500" />
        </motion.div>
    );
}

export default function Trainers() {
    return (
        <section id="trainers" className="py-24 md:py-40 px-6 md:px-12 bg-background overflow-hidden relative">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4 block">
                            Meet the Team
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                            Elite Coaches
                        </h2>
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-white/40 max-w-md text-sm leading-relaxed"
                    >
                        Our trainers are world-class athletes dedicated to pushing you beyond your potential. Expert guidance, proven results.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trainers.map((trainer, i) => (
                        <TrainerCard key={trainer.name} trainer={trainer} index={i} />
                    ))}
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-20 top-40 text-[20vw] font-black text-white/[0.02] uppercase tracking-tighter pointer-events-none select-none -rotate-90">
                TEAM
            </div>
        </section>
    );
}
