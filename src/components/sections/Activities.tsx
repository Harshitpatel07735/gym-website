"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Dumbbell, Zap, Target, Heart, Shield, Workflow, Clock, User } from "lucide-react";

const activities = [
    {
        name: "Olympic Weightlifting",
        desc: "Clean & jerk. Snatch. Technique-driven power that demands discipline and precision.",
        duration: "90 min",
        level: "Intermediate",
        coach: "Marcus Kane",
        coachInitial: "M",
        icon: Dumbbell,
    },
    {
        name: "Boxing Elite",
        desc: "Footwork. Combos. Conditioning. Learn to throw hands and build iron lungs.",
        duration: "60 min",
        level: "All Levels",
        coach: "Zara Mitchell",
        coachInitial: "Z",
        icon: Target,
    },
    {
        name: "Mobility & Recovery",
        desc: "Foam rolling, stretching, and movement work. Because longevity matters more than ego.",
        duration: "45 min",
        level: "Beginner",
        coach: "Priya Sharma",
        coachInitial: "P",
        icon: Zap,
    },
];

function Card({ activity }: { activity: typeof activities[0] }) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - left) / width;
        const y = (e.clientY - top) / height;

        const rotateX = (y - 0.5) * 10;
        const rotateY = (x - 0.5) * -10;

        gsap.to(cardRef.current, {
            rotateX,
            rotateY,
            duration: 0.5,
            ease: "power2.out",
        });
    };

    const handleMouseLeave = () => {
        if (!cardRef.current) return;
        gsap.to(cardRef.current, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.5,
            ease: "power2.out",
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="group relative bg-[#0a0a0a] border border-white/5 p-8 rounded-2xl flex flex-col gap-6 transition-all duration-300 hover:border-primary/30"
            style={{ perspective: "1000px" }}
        >
            {/* Upper Content */}
            <div className="space-y-6">
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
                    <activity.icon size={28} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-primary transition-colors italic">
                        {activity.name}
                    </h3>
                    <p className="text-muted text-sm leading-relaxed">
                        {activity.desc}
                    </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 border border-white/5 text-[11px] font-bold uppercase tracking-widest text-[#00e5ff]">
                        <Clock size={12} />
                        {activity.duration}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-black border border-white/5 text-[11px] font-bold uppercase tracking-widest text-muted">
                        {activity.level}
                    </div>
                </div>
            </div>

            {/* Coach Section */}
            <div className="mt-4 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-primary font-bold text-sm">
                    {activity.coachInitial}
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-muted">
                    Coach <span className="text-white">{activity.coach}</span>
                </div>
            </div>

            {/* Grain/Glass Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
        </div>
    );
}

export default function Activities() {
    return (
        <section id="activities" className="py-24 md:py-40 px-6 md:px-12 bg-background">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 md:mb-24 space-y-4">
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-primary block">
                        Our Sessions
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.9]">
                        Detailed Classes
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activities.map((activity) => (
                        <Card key={activity.name} activity={activity} />
                    ))}
                </div>
            </div>
        </section>
    );
}
