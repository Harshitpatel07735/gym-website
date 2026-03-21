"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, ShieldCheck, Activity, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const staff = [
    { name: "Vikram Rathore", role: "Head Trainer", shift: "Morning", status: "On Duty", intensity: "85%" },
    { name: "Sonia Mirza", role: "Yoga Expert", shift: "Evening", status: "On Duty", intensity: "92%" },
    { name: "Rajesh Koothrappali", role: "Dietitian", shift: "Full-time", status: "Off Duty", intensity: "70%" },
    { name: "Monica Geller", role: "Floor Manager", shift: "Morning", status: "On Duty", intensity: "98%" },
];

export default function QuickManageView() {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">Staff & Quick Manage</h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Manage trainers and operational staff</p>
                </div>
                <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white hover:border-primary transition-all shadow-xl shadow-black/20">
                    Add New Staff
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {staff.map((member, i) => (
                    <motion.div
                        key={member.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 group hover:bg-white/10 transition-all relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6">
                            <button className="text-white/20 hover:text-white transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center space-y-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-[2rem] bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-black text-3xl shadow-2xl shadow-primary/20">
                                    {member.name[0]}
                                </div>
                                <div className={cn(
                                    "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center",
                                    member.status === "On Duty" ? "bg-emerald-500" : "bg-white/20"
                                )}>
                                    {member.status === "On Duty" && <UserCheck size={10} className="text-white" />}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-black text-white italic">{member.name}</h3>
                                <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">{member.role}</p>
                            </div>

                            <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                <div className="text-left">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 block">Shift</span>
                                    <span className="text-[10px] font-bold text-white/60">{member.shift}</span>
                                </div>
                                <div className="text-left">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-white/20 block">Efficiency</span>
                                    <span className="text-[10px] font-bold text-emerald-400">{member.intensity}</span>
                                </div>
                            </div>

                            <div className="w-full flex gap-3">
                                <button className="flex-1 py-3 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5">
                                    Logs
                                </button>
                                <button className="flex-1 py-3 bg-primary/10 text-primary rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all border border-primary/20">
                                    Assign
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
