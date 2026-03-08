"use client";

import { Instagram } from "lucide-react";

const images = [
    "https://images.unsplash.com/photo-1541534741688-6078c64b52d2?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1593079831268-3381b0dd4a77?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
];

export default function Gallery() {
    return (
        <section className="bg-background">
            <div className="px-12 py-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.3em] text-muted">Follow us @apexfitness</span>
                <Instagram size={20} className="text-primary" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 grayscale">
                {images.map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden group cursor-pointer">
                        <img src={img} alt="Gym Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 group-hover:grayscale-0" />
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Instagram size={32} className="text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
