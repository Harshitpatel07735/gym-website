"use client";

import { motion } from "framer-motion";
import { UserPlus, Mail, MapPin, Calendar, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const enquiries = [
    { name: "Vikram Malhotra", source: "Website", interest: "Yoga Basics", time: "2 hours ago", status: "New", color: "text-primary", bg: "bg-primary/10" },
    { name: "Ananya Deshmukh", source: "Instagram", interest: "Weight Loss", time: "5 hours ago", status: "Processing", color: "text-indigo-400", bg: "bg-indigo-400/10" },
    { name: "Karan Johar", source: "Referral", interest: "PT Session", time: "Yesterday", status: "New", color: "text-primary", bg: "bg-primary/10" },
    { name: "Isabel Grace", source: "Google", interest: "Monthly Pass", time: "Yesterday", status: "Followed Up", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

export default function EnquiriesView() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">Pending Enquiries</h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Track and convert potential leads</p>
                </div>
                <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-2">
                    <button className="px-6 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">Active</button>
                    <button className="px-6 py-2 text-white/40 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-colors">Archive</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {enquiries.map((item, i) => (
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 group hover:bg-white/10 transition-all relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />
                         
                         <div className="flex flex-col gap-6 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-primary shadow-inner">
                                    <UserPlus size={32} />
                                </div>
                                <div className={cn("px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/5", item.bg, item.color)}>
                                    {item.status}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-black text-white italic tracking-tight">{item.name}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-white/30">
                                        <MapPin size={14} className="text-primary" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{item.source}</span>
                                    </div>
                                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                                    <div className="flex items-center gap-2 text-white/30">
                                        <Calendar size={14} className="text-indigo-400" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{item.interest}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-white/20">
                                    <Clock size={14} />
                                    <span className="text-[10px] font-bold italic">{item.time}</span>
                                </div>
                                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-colors group/btn">
                                    Details <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                         </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
