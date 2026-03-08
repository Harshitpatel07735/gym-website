"use client";

import { motion } from "framer-motion";

const marqueeText = "STRENGTH • POWER • DISCIPLINE • TRANSFORM • ENDURE • CONQUER • ";

export default function Marquee() {
    return (
        <div className="relative w-full py-12 md:py-20 overflow-hidden bg-background border-y border-white/5">
            <div className="flex whitespace-nowrap">
                <motion.div
                    animate={{ x: [0, "-50%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex items-center"
                >
                    <span className="text-6xl md:text-8xl font-black uppercase tracking-tight text-background stroke-text opacity-30 px-4">
                        {marqueeText.repeat(4)}
                    </span>
                </motion.div>
                <motion.div
                    animate={{ x: [0, "-50%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="flex items-center"
                >
                    <span className="text-6xl md:text-8xl font-black uppercase tracking-tight text-background stroke-text opacity-30 px-4">
                        {marqueeText.repeat(4)}
                    </span>
                </motion.div>
            </div>

            <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8);
          paint-order: stroke fill;
        }
      `}</style>
        </div>
    );
}
