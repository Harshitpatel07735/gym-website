"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Hero3D from "./Hero3D";
import Navbar from "./Navbar";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const title1Ref = useRef<HTMLHeadingElement>(null);
    const title2Ref = useRef<HTMLHeadingElement>(null);
    const subtextRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(
            [title1Ref.current, title2Ref.current],
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, delay: 0.5 }
        )
            .fromTo(
                subtextRef.current,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1 },
                "-=1"
            )
            .fromTo(
                ctaRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 1 },
                "-=0.8"
            );
    }, []);

    return (
        <>
            <section
                ref={containerRef}
                className="relative h-screen w-full flex items-center justify-center overflow-hidden"
            >
                <Navbar />
                <Hero3D />

                <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-white/80">
                            Premium Fitness Experience
                        </span>
                    </div>

                    <h1 className="text-6xl md:text-[clamp(48px,8vw,120px)] font-black uppercase leading-[0.9] tracking-tighter mb-6 overflow-hidden">
                        <span ref={title1Ref} className="block">
                            Break Your{" "}
                        </span>
                        <span ref={title2Ref} className="block text-gradient">
                            Limits
                        </span>
                    </h1>

                    <p
                        ref={subtextRef}
                        className="text-muted text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
                    >
                        Transform your body, elevate your mind. Join the most advanced
                        training facility in modern fitness with world-class equipment
                        and elite coaches.
                    </p>

                    <div ref={ctaRef} className="flex flex-col sm:flex-row gap-6">
                        <button
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-primary group relative overflow-hidden"
                        >
                            <span className="relative z-10">Start Your Journey</span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={() => setShowVideo(true)}
                            className="btn-outline flex items-center gap-2 group"
                        >
                            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:border-primary transition-colors">
                                <div className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[10px] border-l-white ml-1" />
                            </div>
                            <span>Watch Video</span>
                        </button>
                    </div>
                </div>

            </section>

            {/* Floating Video Modal */}
            <AnimatePresence>
                {showVideo && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8"
                        onClick={() => setShowVideo(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />

                        {/* Video Container */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 40 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(255,45,45,0.15)]"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setShowVideo(false)}
                                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:border-primary/50 hover:bg-primary/20 transition-all duration-300"
                            >
                                <X size={18} />
                            </button>

                            <iframe
                                src="https://www.youtube.com/embed/qEkPIoYN2Pg?autoplay=1&rel=0&modestbranding=1"
                                title="Gym Promo Video"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
