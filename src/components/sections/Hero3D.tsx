"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";

function Scene() {
    return (
        <>
            <ambientLight intensity={1} />
            <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={5} color="#ff2d2d" />
            <pointLight position={[-5, -5, -5]} intensity={3} color="#ff6b2b" />

            <Float speed={2} rotationIntensity={1} floatIntensity={2}>
                <Sphere args={[1, 100, 200]} scale={2}>
                    <MeshDistortMaterial
                        color="#111111"
                        attach="material"
                        distort={0.4}
                        speed={2}
                        roughness={0.2}
                        metalness={0.9}
                    />
                </Sphere>
            </Float>

            <OrbitControls enableZoom={false} />
        </>
    );
}

export default function Hero3D() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="absolute inset-0 z-0 bg-background" />;

    return (
        <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
}
