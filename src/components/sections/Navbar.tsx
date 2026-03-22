'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/app/actions/auth'

interface UserState {
    email: string
    role: string
    full_name: string | null
}

const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#about' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Contact', href: '#contact' },
]

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<UserState | null>(null)
    const [showUserMenu, setShowUserMenu] = useState(false)

    // Scroll listener
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Auth state
    useEffect(() => {
        const supabase = createClient()

        const loadUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('role, full_name')
                        .eq('id', user.id)
                        .single()
                    setCurrentUser({
                        email: user.email ?? '',
                        role: profile?.role ?? 'member',
                        full_name: profile?.full_name ?? null,
                    })
                } else {
                    setCurrentUser(null)
                }
            } catch {
                setCurrentUser(null)
            }
        }

        loadUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                // Clear user immediately on sign out
                if (event === 'SIGNED_OUT' || !session?.user) {
                    setCurrentUser(null)
                    setShowUserMenu(false)
                    return
                }

                // Load profile for signed in user
                if (session?.user) {
                    try {
                        const { data: profile } = await supabase
                            .from('profiles')
                            .select('role, full_name')
                            .eq('id', session.user.id)
                            .single()
                        setCurrentUser({
                            email: session.user.email ?? '',
                            role: profile?.role ?? 'member',
                            full_name: profile?.full_name ?? null,
                        })
                    } catch {
                        setCurrentUser(null)
                    }
                }
            }
        )

        return () => subscription.unsubscribe()
    }, [])

    const handleSignOut = async () => {
        setShowUserMenu(false)
        setIsMobileMenuOpen(false)
        const supabase = createClient()
        await supabase.auth.signOut()
        // onAuthStateChange fires SIGNED_OUT in all components
        // Navbar clears via the listener automatically
        // MembershipTracker clears via its listener automatically
    }

    const displayName = currentUser?.full_name || currentUser?.email || ''

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 w-full z-[100] transition-all duration-300 px-6 py-4 md:px-12',
                isScrolled ? 'glass py-3' : 'bg-transparent'
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

                    {/* Auth area */}
                    {currentUser ? (
                        /* Logged in */
                        <div className="relative">
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-primary/50 transition-all"
                            >
                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black">
                                    {displayName.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                                    {currentUser.role === 'admin' ? '⚡ Admin' : displayName.split(' ')[0] || 'Member'}
                                </span>
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {showUserMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 top-12 w-52 glass rounded-2xl border border-white/10 overflow-hidden shadow-2xl z-50"
                                    >
                                        {/* User info */}
                                        <div className="px-4 py-3 border-b border-white/5">
                                            <p className="text-[10px] text-muted uppercase tracking-widest">
                                                Signed in as
                                            </p>
                                            <p className="text-xs text-white font-bold truncate mt-0.5">
                                                {displayName || currentUser.email}
                                            </p>
                                        </div>

                                        {/* Member Dashboard */}
                                        <Link
                                            href="/#member-login"
                                            onClick={() => setShowUserMenu(false)}
                                            className="flex items-center gap-3 px-4 py-3 text-xs text-muted hover:text-white hover:bg-white/5 transition-all font-bold uppercase tracking-widest"
                                        >
                                            My Dashboard
                                        </Link>

                                        {/* Admin Panel — admin only */}
                                        {currentUser.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center gap-3 px-4 py-3 text-xs text-primary hover:bg-primary/10 transition-all font-bold uppercase tracking-widest border-t border-white/5"
                                            >
                                                ⚡ Admin Panel
                                            </Link>
                                        )}

                                        {/* Sign out */}
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-xs text-muted hover:text-red-400 hover:bg-red-500/5 transition-all font-bold uppercase tracking-widest border-t border-white/5"
                                        >
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        /* Logged out — show Sign In/Up button */
                        <Link
                            href="/login"
                            className="text-xs uppercase tracking-[0.2em] font-black text-white hover:text-primary transition-colors border border-white/20 px-6 py-2 rounded-full hover:border-primary"
                        >
                            Sign In / Up
                        </Link>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden text-white p-1"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[90] bg-background/95 backdrop-blur-xl flex flex-col items-center justify-center gap-6 md:hidden"
                    >
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-6 right-6 text-white"
                        >
                            <X size={24} />
                        </button>

                        {navLinks.map((link, i) => (
                            <motion.div
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-3xl font-black uppercase tracking-tighter hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </Link>
                            </motion.div>
                        ))}

                        {/* Mobile auth */}
                        <div className="flex flex-col items-center gap-3 mt-4 w-full px-8">
                            {currentUser ? (
                                <>
                                    <p className="text-muted text-xs">{displayName || currentUser.email}</p>
                                    <Link
                                        href="/#member-login"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-full py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-center text-muted hover:text-white transition-colors"
                                    >
                                        My Dashboard
                                    </Link>
                                    {currentUser.role === 'admin' && (
                                        <Link
                                            href="/admin"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="w-full py-3 bg-primary/10 border border-primary/20 rounded-xl text-xs font-bold uppercase tracking-widest text-center text-primary hover:bg-primary hover:text-white transition-colors"
                                        >
                                            ⚡ Admin Panel
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleSignOut}
                                        className="text-sm text-muted hover:text-red-400 transition-colors uppercase tracking-widest font-bold mt-2"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-3 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-center text-white hover:border-primary hover:text-primary transition-colors"
                                >
                                    Sign In / Up
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
