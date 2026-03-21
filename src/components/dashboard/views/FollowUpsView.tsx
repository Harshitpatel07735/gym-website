"use client";

import { motion } from "framer-motion";
import { Phone, MessageSquare, CheckCircle2, Clock, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const followUps = [
    { name: "Rahul Sharma", reason: "Membership Expired", date: "Today, 10:30 AM", status: "High Priority", color: "text-rose-400", bg: "bg-rose-400/10" },
    { name: "Priya Patel", reason: "Class Absentee", date: "Today, 11:45 AM", status: "Medium", color: "text-amber-400", bg: "bg-amber-400/10" },
    { name: "Amit Kumar", reason: "Renewal Inquiry", date: "Today, 02:15 PM", status: "Urgent", color: "text-rose-400", bg: "bg-rose-400/10" },
    { name: "Sneha Reddy", reason: "Diet Plan Feedback", date: "Today, 04:00 PM", status: "Scheduled", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { name: "Vikas Singh", reason: "Payment Pending", date: "Today, 05:30 PM", status: "Pending", color: "text-cyan-400", bg: "bg-cyan-400/10" },
];

export default function FollowUpsView() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">All Follow-ups</h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Manage client engagement tasks</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">Export PDF</button>
                    <button className="px-6 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 transition-all">Add New</button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {followUps.map((item, i) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/10 transition-all border-l-4 border-l-primary/50"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                                <User size={28} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white italic">{item.name}</h3>
                                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{item.reason}</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 md:gap-12">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block">Scheduled For</span>
                                <div className="flex items-center gap-2 text-white/60">
                                    <Clock size={14} />
                                    <span className="text-[11px] font-bold">{item.date}</span>
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block">Priority Status</span>
                                <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest", item.bg, item.color)}>
                                    {item.status}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                    <Phone size={18} />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-500 border border-cyan-500/20 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all">
                                    <MessageSquare size={18} />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-primary/20 text-primary border border-primary/20 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                    <CheckCircle2 size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
