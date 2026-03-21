"use client";

import { Instagram } from "lucide-react";

const images = [
    "/gallery/gym_view_1.jpg",
    "/gallery/gym_view_2.jpg",
    "/gallery/gym_view_3.jpg",
    "/gallery/gym_view_4.jpg",
    "/gallery/gym_view_5.jpg",
    "/gallery/gym_view_6.jpg",
    "/gallery/gym_view_7.jpg",
    "/gallery/gym_view_8.jpg",
    "/gallery/gym_view_9.jpg",
];

export default function Gallery() {
    return (
        <section className="bg-background">
            <div className="px-12 py-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Follow us @yogifitness</span>
                <Instagram size={20} className="text-primary" />
            </div>
            <div className="flex w-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {images.map((img, i) => (
                    <div key={i} className="relative aspect-square w-[50vw] md:w-[33.333vw] lg:w-[16.666vw] shrink-0 snap-start overflow-hidden group cursor-pointer">
                        <img src={img} alt="Gym Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Instagram size={32} className="text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
