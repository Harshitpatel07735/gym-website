import { createClient } from '@/lib/supabase/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import {
    LayoutDashboard, Users, CreditCard, Calendar,
    Bell, Search, Menu, X, LogOut, Zap, ChevronRight,
    ClipboardList, Clock, Heart,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
    { icon: LayoutDashboard, label: 'Quick Manage', view: 'quick-manage' },
    { icon: Users, label: 'All Members', view: 'members' },
    { icon: ClipboardList, label: 'All Follow-ups', view: 'follow-ups' },
    { icon: Clock, label: 'Pending Enquiry', view: 'enquiries' },
    { icon: CreditCard, label: 'Pending Payment', view: 'payments' },
    { icon: Calendar, label: 'Upcoming Renewal', view: 'renewals' },
    { icon: Users, label: 'Frequent Absent Client', view: 'absents' },
    { icon: Heart, label: "Birthday's", view: 'birthdays' },
    { icon: Heart, label: "Anniversary's", view: 'anniversaries' },
    { icon: Calendar, label: 'Today Schedule', view: 'schedule' },
]

const topNavLinks = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Enquiry', href: '#' },
    { name: 'Clients', href: '#' },
    { name: 'Billing & Payments', href: '#' },
    { name: 'Attendance', href: '#' },
    { name: 'Reports', href: '#' },
    { name: 'Manage & Settings', href: '#' },
]

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Server-side auth check — no browser round trip needed
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'admin') {
        redirect('/login')
    }

    const adminName = profile.full_name || user.email || 'Admin'

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex selection:bg-primary selection:text-white">

            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-50">

                {/* Logo */}
                <div className="p-8 pb-12 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,45,45,0.4)]">
                            <Zap size={24} className="text-white" />
                        </div>
                        <span className="text-2xl font-black italic tracking-tighter">
                            YOGI<span className="text-primary">.</span>
                        </span>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.label}
                            href={`/admin?view=${item.view}`}
                            className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-white/40 hover:text-white hover:bg-white/5"
                        >
                            <item.icon size={22} />
                            <span className="text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* Bottom — admin info + logout */}
                <div className="p-4 border-t border-white/5 space-y-2">
                    <div className="px-5 py-3">
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                            Signed in as
                        </p>
                        <p className="text-sm text-white font-bold truncate mt-0.5">
                            {adminName}
                        </p>
                        <p className="text-[9px] text-primary font-bold uppercase tracking-tight mt-0.5">
                            Administrator
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-5 py-3 rounded-xl w-full text-white/40 hover:text-white hover:bg-white/5 transition-all text-[10px] font-black uppercase tracking-widest"
                    >
                        ← View Site
                    </Link>
                    <form action={async () => {
                        'use server'
                        const { createClient } = await import('@/lib/supabase/server')
                        const { redirect } = await import('next/navigation')
                        const s = createClient()
                        await s.auth.signOut()
                        redirect('/login')
                    }}>
                        <button
                            type="submit"
                            className="flex items-center gap-3 px-5 py-3 rounded-xl w-full text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest text-left border border-transparent hover:border-red-500/20"
                        >
                            <LogOut size={20} className="shrink-0" />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative ml-72">

                {/* Header */}
                <header className="h-20 bg-[#050505]/50 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-40">
                    <div className="hidden lg:flex items-center gap-1">
                        {topNavLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:bg-white/5 hover:text-white transition-all"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="lg:hidden uppercase tracking-[0.2em]">
                        <h2 className="text-sm font-black italic">
                            Admin <span className="text-primary">Portal</span>
                        </h2>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex relative group">
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors"
                                size={16}
                            />
                            <input
                                type="text"
                                placeholder="Search clients, bills..."
                                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs w-64 focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all border border-transparent hover:border-white/10">
                                <Bell size={20} />
                                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-primary rounded-full" />
                            </button>
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">
                                        {adminName}
                                    </p>
                                    <p className="text-[9px] text-primary font-bold uppercase tracking-tight">
                                        Manager Mode
                                    </p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black shadow-[0_0_15px_rgba(255,45,45,0.2)]">
                                    {adminName.charAt(0).toUpperCase()}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div
                    data-lenis-prevent
                    className="flex-1 overflow-y-auto p-6 md:p-8 bg-background relative"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[150px] pointer-events-none" />
                    <div className="relative z-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
