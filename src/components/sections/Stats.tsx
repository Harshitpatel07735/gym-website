"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

const stats = [
    { value: 15, label: "Years of Experience", suffix: "+" },
    { value: 200, label: "Pieces of Equipment", suffix: "+" },
    { value: 50, label: "Expert Trainers", suffix: "+" },
    { value: 10, label: "Happy Members", suffix: "k+", factor: 1 },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

export default function Stats() {
    return (
        <section className="py-20 bg-accent border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center text-center group">
                            <div className="text-5xl md:text-6xl font-black tracking-tighter mb-2 group-hover:text-primary transition-colors">
                                <Counter value={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-muted group-hover:text-white transition-colors">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
