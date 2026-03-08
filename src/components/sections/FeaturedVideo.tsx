"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedVideo() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        gsap.from(textRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 60%",
            },
        });
    }, []);

    return (
        <section ref={sectionRef} id="featured-video" className="relative h-[60vh] md:h-screen w-full overflow-hidden">
            {/* Background with themed runner */}
            <div className="absolute inset-0 bg-black flex items-center justify-center">
                <div className="w-full h-full animate-ken-burns bg-[url('/runner-theme.png')] bg-contain bg-center bg-no-repeat" />
            </div>

            <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-6">
                <div ref={textRef} className="max-w-4xl">
                    <h2 className="text-4xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none italic mb-12">
                        "The only bad workout <br /> is the one that <span className="text-primary">didn't</span> happen"
                    </h2>

                    <button className="w-20 h-20 md:w-32 md:h-32 rounded-full border border-white/20 flex items-center justify-center group hover:border-primary transition-all duration-500 hover:scale-110">
                        <div className="w-0 h-0 border-y-[10px] md:border-y-[15px] border-y-transparent border-l-[16px] md:border-l-[24px] border-l-white ml-2 group-hover:border-l-primary transition-colors" />
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-ken-burns {
          animation: ken-burns 20s infinite alternate ease-in-out;
        }
      `}</style>
        </section>
    );
}
