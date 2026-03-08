"use client";

import { motion } from "framer-motion";

export default function GradientOrbs() {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-background">
            <motion.div
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 100, 0],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -top-[10%] -left-[10%] w-[600px] h-[600px] rounded-full bg-primary/20 blur-[120px]"
            />
            <motion.div
                animate={{
                    x: [0, -100, 50, 0],
                    y: [0, 100, -50, 0],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -bottom-[10%] -right-[10%] w-[800px] h-[800px] rounded-full bg-secondary/10 blur-[150px]"
            />
        </div>
    );
}
