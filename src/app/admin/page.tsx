"use client";

import { motion } from "framer-motion";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardActions from "@/components/dashboard/DashboardActions";
import FollowUpsView from "@/components/dashboard/views/FollowUpsView";
import EnquiriesView from "@/components/dashboard/views/EnquiriesView";
import PaymentsView from "@/components/dashboard/views/PaymentsView";
import QuickManageView from "@/components/dashboard/views/QuickManageView";
import MembersView from "@/components/dashboard/views/MembersView";
import { Filter, Calendar, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AdminPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const searchParams = useSearchParams();
    const currentView = searchParams.get('view') || 'dashboard';

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const renderContent = () => {
        switch (currentView) {
            case 'dashboard':
                return (
                    <>
                        {/* Summary Statistics */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between border-l-2 border-primary/20 pl-6">
                                <div>
                                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">Summary Statistics</h2>
                                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Real-time gym performance metrics</p>
                                </div>
                                <button className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2 hover:text-white transition-colors group">
                                    Full Reports <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                            <DashboardStats />
                        </section>

                        {/* Quick Actions */}
                        <section className="space-y-8 pt-6">
                            <div className="flex items-center justify-between border-l-2 border-primary/20 pl-6">
                                <div>
                                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">Action Center</h2>
                                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Automated client management & engagement</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                     <span className="text-[9px] font-black uppercase tracking-widest text-white/20">AI Automation Active</span>
                                </div>
                            </div>
                            <DashboardActions />
                        </section>
                    </>
                );
            case 'quick-manage':
                return <QuickManageView />;
            case 'follow-ups':
                return <FollowUpsView />;
            case 'enquiries':
                return <EnquiriesView />;
            case 'payments':
                return <PaymentsView />;
            case 'members':
                return <MembersView />;
            default:
                return (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                        <div className="w-20 h-20 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-primary animate-pulse">
                            <Calendar size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-white italic uppercase">Coming Soon</h3>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-2">The <span className="text-primary">{currentView}</span> module is being optimized.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-4 italic uppercase">
                        <span className="w-2 h-10 bg-primary rounded-full shadow-[0_0_20px_rgba(255,45,45,0.5)]" />
                        {currentView === 'dashboard' ? 'Dashboard' : currentView.replace('-', ' ')}
                    </h1>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em] mt-2 ml-6">{formatDate(currentTime)}</p>
                </motion.div>

                <div className="flex items-center gap-4 bg-white/5 p-2 rounded-[2rem] border border-white/10 backdrop-blur-md">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-2xl border border-white/5">
                        <Calendar size={18} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">01 Mar - 21 Mar</span>
                    </div>
                    <button className="flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-[0_10px_30px_rgba(255,45,45,0.3)] hover:scale-105 active:scale-95">
                        <Filter size={18} />
                        Filter Data
                    </button>
                </div>
            </div>

            {renderContent()}

            {/* Footer / Status */}
            <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-white/20">
                <div className="flex items-center gap-4">
                    <p className="text-[9px] uppercase font-black tracking-[0.4em]">Yogi Fitness Studio</p>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <p className="text-[9px] uppercase font-bold tracking-widest">Management v1.0.4</p>
                </div>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                        <span className="text-[9px] uppercase font-black tracking-widest">Server Secure</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        <span className="text-[9px] uppercase font-black tracking-widest">Cloud Sync Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
