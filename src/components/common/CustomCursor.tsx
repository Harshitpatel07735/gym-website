"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const onMouseMove = (e: MouseEvent) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.05,
                ease: "power2.out"
            });
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.25,
                ease: "power3.out"
            });
        };

        const onMouseEnter = () => setIsHovering(true);
        const onMouseLeave = () => setIsHovering(false);

        window.addEventListener("mousemove", onMouseMove);

        const clickables = document.querySelectorAll("a, button, .clickable");
        clickables.forEach((el) => {
            el.addEventListener("mouseenter", onMouseEnter);
            el.addEventListener("mouseleave", onMouseLeave);
        });

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            clickables.forEach((el) => {
                el.removeEventListener("mouseenter", onMouseEnter);
                el.removeEventListener("mouseleave", onMouseLeave);
            });
        };
    }, [mounted]);

    if (!mounted) return null;

    return (
        <>
            <div
                ref={cursorRef}
                className={`fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference hidden lg:block transition-transform duration-300 ${isHovering ? "scale-0" : "scale-100"}`}
            />
            <div
                ref={followerRef}
                className={`fixed top-0 left-0 w-10 h-10 border border-white rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 mix-blend-difference hidden lg:block ${isHovering ? "w-20 h-20 bg-white/10 border-white" : "w-10 h-10 border-white/50"
                    }`}
            />
        </>
    );
}
