"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Dumbbell, Zap, Target, Heart, Shield, Workflow, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const programs = [
    {
        name: "Strength",
        suffix: "Training",
        desc: "Build massive power and lean muscle with our elite equipment.",
        icon: Dumbbell,
        color: "#ff2d2d",
    },
    {
        name: "HIIT",
        suffix: "Intensity",
        desc: "Burn fat and boost metabolism with high-intensity intervals.",
        icon: Zap,
        color: "#ff6b2b",
    },
    {
        name: "Boxing",
        suffix: "Elite",
        desc: "Master technique and speed with our professional ring training.",
        icon: Target,
        color: "#ff2d2d",
    },
    {
        name: "Yoga",
        suffix: "& Flow",
        desc: "Improve flexibility and find mental clarity in our serene studio.",
        icon: Heart,
        color: "#ff6b2b",
    },
    {
        name: "CrossFit",
        suffix: "Core",
        desc: "High-performance functional training for the modern athlete.",
        icon: Workflow,
        color: "#ff2d2d",
    },
    {
        name: "Personal",
        suffix: "Coaching",
        desc: "One-on-one sessions tailored to your specific fitness goals.",
        icon: Shield,
        color: "#ff6b2b",
    },
];

function Card({
    program,
    index,
    hoveredIndex,
    setHoveredIndex,
    containerScrollX
}: {
    program: typeof programs[0];
    index: number;
    hoveredIndex: number | null;
    setHoveredIndex: (idx: number | null) => void;
    containerScrollX: any;
}) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [cardOffset, setCardOffset] = useState(0);

    useEffect(() => {
        if (cardRef.current) {
            setCardOffset(cardRef.current.offsetLeft);
        }
    }, []);

    const isHovered = hoveredIndex === index;
    const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;

    // 3D Scroll Transformation Logic (Cylindrical distortion)
    const relativeScroll = useTransform(
        containerScrollX,
        [cardOffset - 1000, cardOffset, cardOffset + 1000],
        [-1, 0, 1]
    );

    const rotateY = useTransform(relativeScroll, [-1, 0, 1], [35, 0, -35]);
    const z = useTransform(relativeScroll, [-1, 0, 1], [-200, 0, -200]);
    const opacity = useTransform(relativeScroll, [-1, -0.5, 0, 0.5, 1], [0.1, 0.5, 1, 0.5, 0.1]);

    const springRotateY = useSpring(rotateY, { stiffness: 100, damping: 20 });
    const springZ = useSpring(z, { stiffness: 100, damping: 20 });

    const hoverRotateX = useSpring(0, { stiffness: 300, damping: 30 });
    const hoverRotateY = useSpring(0, { stiffness: 300, damping: 30 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        hoverRotateX.set((y - 0.5) * -15);
        hoverRotateY.set((x - 0.5) * 15);
    };

    const handleMouseLeave = () => {
        setHoveredIndex(null);
        hoverRotateX.set(0);
        hoverRotateY.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateY: isHovered ? hoverRotateY : springRotateY,
                rotateX: hoverRotateX,
                z: isHovered ? 150 : isOtherHovered ? -100 : springZ,
                opacity: isOtherHovered ? 0.3 : opacity,
                transformStyle: "preserve-3d",
            }}
            animate={{
                scale: isHovered ? 1.1 : isOtherHovered ? 0.9 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "relative shrink-0 w-[340px] md:w-[450px] h-[580px] glass rounded-[3rem] p-12 cursor-pointer overflow-hidden border-white/5 snap-center transition-shadow duration-500",
                isHovered ? "z-50 border-primary/50 shadow-[0_40px_100px_rgba(255,45,45,0.25)]" : "z-10"
            )}
        >
            <div className={cn(
                "absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent transition-opacity duration-1000",
                isHovered ? "opacity-100" : "opacity-0"
            )} />

            <div className={cn(
                "absolute -right-16 -bottom-16 transition-all duration-1000 pointer-events-none blur-[2px]",
                isHovered ? "text-primary/10 scale-110 opacity-100" : "text-white/[0.02] scale-100 opacity-50"
            )}>
                <program.icon size={400} strokeWidth={1} />
            </div>

            <div className="relative h-full flex flex-col justify-between z-10 pointer-events-none" style={{ transform: "translateZ(60px)" }}>
                <div>
                    <div className={cn(
                        "w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-700",
                        isHovered ? "bg-primary text-white shadow-[0_0_50px_rgba(255,45,45,0.5)] rotate-[360deg]" : "bg-white/5 border border-white/10 text-primary"
                    )}>
                        <program.icon size={36} />
                    </div>

                    <div className="mt-12 space-y-2">
                        <h3 className="text-6xl font-black uppercase tracking-tighter leading-[0.75] flex flex-col">
                            <span className={cn("transition-colors duration-500", isHovered ? "text-primary" : "text-white")}>{program.name}</span>
                            <span className={cn("transition-colors duration-700", isHovered ? "text-white" : "text-white/10")}>{program.suffix}</span>
                        </h3>
                    </div>

                    <p className={cn(
                        "mt-10 text-lg transition-all duration-500 leading-relaxed max-w-[280px]",
                        isHovered ? "text-white/90 translate-y-0" : "text-white/30 -translate-y-2"
                    )}>
                        {program.desc}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={cn(
                            "w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-500",
                            isHovered ? "bg-primary border-primary text-white scale-110" : "border-white/10 text-white/50"
                        )}>
                            <ArrowRight size={24} className={cn("transition-transform duration-500", isHovered && "rotate-[-45deg]")} />
                        </div>
                        <span className={cn(
                            "text-xs font-black uppercase tracking-[0.4em] transition-all duration-500",
                            isHovered ? "text-white opacity-100 translate-x-0" : "text-white/20 opacity-0 -translate-x-4"
                        )}>
                            View Space
                        </span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        exit={{ opacity: 0 }}
                        className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function Programs() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const { scrollX } = useScroll({ container: scrollContainerRef });
    const scrollProgress = useTransform(scrollX, [0, 2500], [0, 1]);
    const smoothProgress = useSpring(scrollProgress, { stiffness: 100, damping: 30 });

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const { scrollLeft } = scrollContainerRef.current;
            const scrollTo = direction === "left" ? scrollLeft - 450 : scrollLeft + 450;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
        }
    };

    const handleScrollStatus = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setCanScrollLeft(scrollLeft > 20);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
        }
    };

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener("scroll", handleScrollStatus);
            handleScrollStatus();
            return () => container.removeEventListener("scroll", handleScrollStatus);
        }
    }, []);

    return (
        <section id="facilities" className="py-24 md:py-48 bg-background relative overflow-hidden perspective-1000">
            <div className="max-w-7xl mx-auto px-6 md:px-12 mb-24 relative z-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-12 h-[1px] bg-primary" />
                            <span className="text-xs uppercase tracking-[0.5em] font-black text-primary/80">
                                The Forge Spaces
                            </span>
                        </div>
                        <h2 className="text-7xl md:text-[9vw] font-black uppercase tracking-tighter leading-[0.8]">
                            Elite <br /> <span className="text-gradient italic pr-4">Facilities</span>
                        </h2>
                    </motion.div>

                    {/* Custom Long-Tail Navigation */}
                    <div className="flex flex-col items-end gap-6 group/nav cursor-pointer" onClick={() => scroll("right")}>
                        <div className="flex items-center gap-4">
                            <span className="text-xs font-black uppercase tracking-[0.6em] text-white/40 group-hover/nav:text-primary transition-colors duration-500 italic">
                                View More
                            </span>
                            <div className="relative flex items-center">
                                {/* The "Long Tail" */}
                                <motion.div
                                    className="h-[1px] bg-white/20 group-hover/nav:bg-primary transition-colors duration-500"
                                    initial={{ width: 80 }}
                                    whileHover={{ width: 140 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                />
                                <ChevronRight
                                    size={24}
                                    className="text-white/20 group-hover/nav:text-primary transition-all duration-500 group-hover/nav:translate-x-2"
                                />
                            </div>
                        </div>

                        {/* Secondary Nav for Back */}
                        <div
                            className={cn(
                                "flex items-center gap-3 transition-all duration-500",
                                canScrollLeft ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"
                            )}
                            onClick={(e) => { e.stopPropagation(); scroll("left"); }}
                        >
                            <ChevronLeft size={16} className="text-white/40 hover:text-white transition-colors" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Go Back</span>
                        </div>
                    </div>
                </div>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-12 overflow-x-auto py-12 px-6 md:px-[calc((100vw-1280px)/2+48px)] scrollbar-hide snap-x snap-mandatory relative z-10 lg:perspective-1500"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', transformStyle: "preserve-3d" }}
            >
                {programs.map((program, i) => (
                    <Card
                        key={program.name}
                        program={program}
                        index={i}
                        hoveredIndex={hoveredIndex}
                        setHoveredIndex={setHoveredIndex}
                        containerScrollX={scrollX}
                    />
                ))}
                <div className="shrink-0 w-48 h-1" />
            </div>

            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 relative z-20">
                <div className="w-full h-[1px] bg-white/5 relative">
                    <motion.div
                        style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                        className="absolute inset-0 h-full bg-gradient-to-r from-primary via-secondary to-primary shadow-[0_0_20px_rgba(255,45,45,0.5)]"
                    />
                </div>
                <div className="mt-4 flex justify-between text-[10px] uppercase tracking-[0.4em] font-black text-white/20 italic">
                    <span>Navigation Start</span>
                    <span>Scroll to explore</span>
                    <span>Forge End</span>
                </div>
            </div>

        </section>
    );
}
