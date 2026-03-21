"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Facilities", href: "#facilities" },
    { name: "Trainers", href: "#trainers" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
    { name: "Login", href: "#member-login" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdminPage, setIsAdminPage] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        
        // Check login state
        const loggedIn = localStorage.getItem("isLoggedIn") === "true";
        setIsLoggedIn(loggedIn);
        
        // Check if on admin page
        setIsAdminPage(window.location.pathname.startsWith("/admin"));

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 w-full z-[100] transition-all duration-300 px-6 py-4 md:px-12",
                isScrolled ? "glass py-3" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-black tracking-tighter text-white">
                    YOGI<span className="text-primary">.</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-xs uppercase tracking-[0.2em] font-medium text-white/70 hover:text-white transition-colors relative group"
                        >
                            {link.name}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                    
                    {isLoggedIn ? (
                        <div className="flex items-center gap-4">
                            {!isAdminPage && (
                                <Link href="/admin" className="text-xs uppercase tracking-[0.2em] font-black text-primary hover:text-white transition-colors">
                                    Admin Dashboard
                                </Link>
                            )}
                            <button onClick={handleLogout} className="btn-outline py-2 px-6 text-xs border-white/20 hover:border-red-500 hover:text-red-500 uppercase tracking-widest font-bold">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6">
                            <Link href="/login" className="text-xs uppercase tracking-[0.2em] font-black text-white hover:text-primary transition-colors">
                                Login
                            </Link>
                            <Link href="/login" className="text-xs uppercase tracking-[0.2em] font-black text-primary hover:text-white transition-colors">
                                Admin
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[90] bg-background flex flex-col items-center justify-center gap-8 md:hidden"
                    >
                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-4xl font-black uppercase tracking-tighter hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}
                        
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href="/admin"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-black uppercase tracking-tighter text-primary"
                                >
                                    Admin Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="btn-outline mt-4"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col items-center gap-6 mt-4">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-4xl font-black uppercase tracking-tighter hover:text-primary transition-colors text-white"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-2xl font-black uppercase tracking-tighter text-primary hover:text-white transition-colors"
                                >
                                    Admin
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
