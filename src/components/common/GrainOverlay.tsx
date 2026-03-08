"use client";

import { useEffect, useRef } from "react";

export default function GrainOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03] noise-overlay mix-blend-overlay" />
    );
}
