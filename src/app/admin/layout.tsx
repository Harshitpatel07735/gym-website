"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
    LayoutDashboard, 
    Users, 
    CreditCard, 
    Calendar, 
    Settings, 
    Bell, 
    Search, 
    Menu, 
    X,
    LogOut,
    Zap,
    ChevronRight,
    ClipboardList,
    Clock,
    UserPlus,
    BarChart3,
    Heart
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const sidebarLinks = [
    { name: "Quick Manage", icon: LayoutDashboard, href: "/admin" },
    { name: "All Follow-ups", icon: ClipboardList, href: "#" },
    { name: "Pending Enquiry", icon: Clock, href: "#" },
    { name: "Pending Payment", icon: CreditCard, href: "#" },
    { name: "Upcoming Renewal", icon: Calendar, href: "#" },
    { name: "Frequent Absent Client", icon: Users, href: "#" },
    { name: "Birthday's", icon: Heart, href: "#" },
    { name: "Anniversary's", icon: Heart, href: "#" },
    { name: "Today Schedule", icon: Calendar, href: "#" },
];

const topNavLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Enquiry", href: "#" },
    { name: "Clients", href: "#" },
    { name: "Billing & Payments", href: "#" },
    { name: "Attendance", href: "#" },
    { name: "Reports", href: "#" },
    { name: "Manage & Settings", href: "#" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            router.push("/login");
        } else {
            setIsLoaded(true);
        }
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        router.push("/login");
    };

    if (!isLoaded) return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    );
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const currentView = searchParams?.get('view') || 'dashboard';

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
        { icon: LayoutDashboard, label: "Quick Manage", view: "quick-manage" },
        { icon: Users, label: "All Members", view: "members" },
        { icon: ClipboardList, label: "All Follow-ups", view: "follow-ups" }, // Changed icon from Bell
        { icon: Clock, label: "Pending Enquiry", view: "enquiries" }, // Changed icon from Bell
        { icon: CreditCard, label: "Pending Payment", view: "payments" },
        { icon: Calendar, label: "Upcoming Renewal", view: "renewals" }, // Changed icon from Bell
        { icon: Users, label: "Frequent Absent Client", view: "absents" },
        { icon: Heart, label: "Birthday's", view: "birthdays" }, // Changed icon from Bell
        { icon: Heart, label: "Anniversary's", view: "anniversaries" }, // Changed icon from Bell
        { icon: Calendar, label: "Today Schedule", view: "schedule" },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex selection:bg-primary selection:text-white">
            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-full bg-[#0a0a0a] border-r border-white/5 transition-all duration-500 z-50 flex flex-col",
                isSidebarCollapsed ? "w-20" : "w-72"
            )}>
                {/* Logo Area */}
                <div className="p-8 pb-12 flex items-center justify-between">
                    {!isSidebarCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,45,45,0.4)]">
                                <Zap size={24} className="text-white" />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter">YOGI<span className="text-primary prose-invert">.</span></span>
                        </motion.div>
                    )}
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="p-2.5 rounded-xl hover:bg-white/5 text-white/40 hover:text-white transition-all border border-transparent hover:border-white/10"
                    >
                        {isSidebarCollapsed ? <ChevronRight size={20} /> : <X size={20} />} {/* Changed icon from Search/Zap to ChevronRight/X for consistency with original toggle behavior */}
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item) => {
                        const isActive = currentView === item.view;
                        return (
                            <Link
                                key={item.label}
                                href={`/admin?view=${item.view}`}
                                className={cn(
                                    "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative",
                                    isActive
                                        ? "bg-primary text-white shadow-[0_10px_30px_rgba(255,45,45,0.3)]"
                                        : "text-white/40 hover:text-white hover:bg-white/5"
                                )}
                            >
                                <item.icon size={22} className={cn(
                                    "transition-transform",
                                    isActive ? "scale-110" : "group-hover:scale-110"
                                )} />
                                {!isSidebarCollapsed && (
                                    <span className="text-[10px] font-black uppercase tracking-[0.25em] whitespace-nowrap">{item.label}</span>
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeIndicator"
                                        className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full"
                                    />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <button 
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl w-full text-white/40 hover:bg-red-500/10 hover:text-red-500 transition-all group border border-transparent hover:border-red-500/20",
                            isSidebarCollapsed && "md:justify-center"
                        )}
                    >
                        <LogOut size={20} className="shrink-0 group-hover:text-red-500" />
                        <span className={cn("text-sm transition-all font-bold uppercase tracking-widest text-[10px]", isSidebarCollapsed && "md:hidden")}>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Header */}
                <header className="h-20 bg-[#050505]/50 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between shrink-0 z-40">
                    <div className="flex items-center gap-4">
                        {isSidebarCollapsed && (
                            <button onClick={() => setIsSidebarCollapsed(false)} className="text-white/40 hover:text-white mr-2">
                                <Menu size={24} />
                            </button>
                        )}
                        <div className="hidden lg:flex items-center gap-1">
                            {topNavLinks.map((link, i) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                        pathname === link.href ? "bg-primary text-white shadow-[0_0_20px_rgba(255,45,45,0.3)]" : "text-white/40 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                        <div className="lg:hidden uppercase tracking-[0.2em]">
                             <h2 className="text-sm font-black italic">Admin <span className="text-primary">Portal</span></h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={16} />
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
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white">Yogi Admin</p>
                                    <p className="text-[9px] text-primary font-bold uppercase tracking-tight">Manager Mode</p>
                                </div>
                                <div className="w-9 h-9 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black shadow-[0_0_15px_rgba(255,45,45,0.2)]">
                                    Y
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div data-lenis-prevent className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-background relative">
                    {/* Background Ambient Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/2 rounded-full blur-[150px] pointer-events-none" />
                    
                    <div className="relative z-10 max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
