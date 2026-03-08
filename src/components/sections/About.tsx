"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(textRef.current, {
                x: -100,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: textRef.current,
                    start: "top 80%",
                },
            });

            gsap.from(imageRef.current, {
                x: 100,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: imageRef.current,
                    start: "top 80%",
                },
            });

            // Parallax for image
            gsap.to(imageRef.current, {
                y: -100,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            id="about"
            className="relative py-24 md:py-40 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
                <div ref={textRef}>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary mb-4 block">
                        About Us
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
                        More than <br /> Just a Gym
                    </h2>
                    <div className="space-y-6 text-muted text-lg leading-relaxed">
                        <p>
                            At APEX FITNESS, we believe in pushing boundaries. Our facility is
                            designed for those who demand the best from themselves and their
                            environment.
                        </p>
                        <p>
                            Equipped with state-of-the-art machinery and led by a team of elite
                            coaches, we provide a high-energy community that drives results.
                            Whether you're an athlete or just starting, we have the tools you need.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-8 mt-12">
                        <div>
                            <div className="text-3xl font-black text-white">10+</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted mt-1">
                                Years Exp
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">50+</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted mt-1">
                                Coaches
                            </div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white">10k+</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted mt-1">
                                Members
                            </div>
                        </div>
                    </div>
                </div>

                <div ref={imageRef} className="relative group">
                    <div className="absolute -inset-4 border border-primary/20 rounded-2xl -z-10 translate-x-4 translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500" />
                    <div className="aspect-[4/5] bg-[#111] rounded-2xl overflow-hidden shadow-2xl relative">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80"
                            alt="Apex Facility"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                    <div className="absolute bottom-6 left-6 p-4 glass rounded-xl">
                        <div className="text-sm font-bold uppercase tracking-widest text-primary">State-of-the-art</div>
                        <div className="text-[10px] text-muted uppercase tracking-widest">Premium Equipment</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
