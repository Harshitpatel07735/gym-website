"use client";

import { motion } from "framer-motion";
import { CreditCard, ArrowUpRight, ArrowDownLeft, Filter, Download, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
    { id: "#BRV-201", user: "Samual Ray", task: "Monthly Sub", amount: "+ 2,500", type: "credit", date: "21 Mar, 2026", status: "Paid" },
    { id: "#BRV-200", user: "John Doe", task: "Personal Train", amount: "- 1,200", type: "debit", date: "20 Mar, 2026", status: "Due" },
    { id: "#BRV-199", user: "Maria Hill", task: "Supplements", amount: "+ 850", type: "credit", date: "20 Mar, 2026", status: "Paid" },
    { id: "#BRV-198", user: "Tony Stark", task: "Annual Plan", amount: "+ 15,000", type: "credit", date: "19 Mar, 2026", status: "Paid" },
];

export default function PaymentsView() {
    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">Payments & Finance</h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Real-time revenue and expense tracking</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search Bills..." 
                            className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-primary/50 transition-all w-64"
                        />
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
                        <Filter size={20} />
                    </button>
                    <button className="flex items-center gap-3 px-8 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                        <Download size={18} />
                        Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                 <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Bill ID</th>
                                <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Client Name</th>
                                <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Category</th>
                                <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Amount (₹)</th>
                                <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Status</th>
                                <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {transactions.map((tx, i) => (
                                <motion.tr 
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <td className="p-8">
                                        <span className="text-[11px] font-black text-white/40 group-hover:text-primary transition-colors">{tx.id}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-white transition-all">
                                                <ArrowUpRight size={18} />
                                            </div>
                                            <span className="text-[13px] font-black text-white italic">{tx.user}</span>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{tx.task}</span>
                                    </td>
                                    <td className="p-8">
                                        <span className={cn(
                                            "text-sm font-black italic",
                                            tx.type === 'credit' ? "text-emerald-400" : "text-rose-400"
                                        )}>{tx.amount}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                            tx.status === 'Paid' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10" : "bg-primary/10 text-primary border border-primary/10"
                                        )}>
                                            <div className={cn("w-1.5 h-1.5 rounded-full", tx.status === 'Paid' ? "bg-emerald-500" : "bg-primary")} />
                                            {tx.status}
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <span className="text-[10px] font-bold text-white/20">{tx.date}</span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
}
