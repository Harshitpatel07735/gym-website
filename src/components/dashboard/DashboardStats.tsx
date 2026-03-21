"use client";

import { motion } from "framer-motion";
import { 
    Users, 
    CircleDollarSign, 
    TrendingUp, 
    Receipt, 
    UserCheck, 
    UserX, 
    Zap,
    MessageSquare,
    Calculator
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
    { label: "New Clients", value: "20", icon: Zap, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Total Collection", value: "20", icon: CircleDollarSign, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Total Expense", value: "20", icon: Receipt, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "Total PT Collection", value: "20", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Profit/Loss", value: "0.00", icon: Calculator, color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
    { label: "Pending Enquiry(s)", value: "20", icon: MessageSquare, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { label: "Live Clients", value: "20", icon: UserCheck, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
    { label: "In Active Client", value: "20", icon: UserX, color: "text-slate-400", bg: "bg-white/5", border: "border-white/10" },
    { label: "PT Booked", value: "2", icon: Zap, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    { label: "Follow-ups to be Done", value: "13", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
    { label: "Present Clients", value: "0", icon: Users, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
];

export default function DashboardStats() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={cn(
                        "bg-white/5 backdrop-blur-md p-6 rounded-[2rem] border transition-all hover:bg-white/10 group",
                        stat.border
                    )}
                >
                    <div className="flex items-center gap-5">
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-lg", stat.bg)}>
                            <stat.icon className={cn("transition-transform leading-none", stat.color)} size={28} />
                        </div>
                        <div>
                            <p className={cn("text-2xl font-black tracking-tight", stat.color)}>{stat.value}</p>
                            <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">{stat.label}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
