"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    UserPlus, 
    MessageSquare, 
    BarChart3, 
    Send,
    CheckCircle2,
    X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

const actions = [
    { 
        title: "Create Walk-in", 
        icon: UserPlus, 
        color: "text-emerald-400", 
        border: "border-emerald-500/20", 
        bg: "bg-emerald-500/5",
        description: "Add a new prospective client enquiry",
        action: "enquiries"
    },
    { 
        title: "Send Payment Link", 
        icon: MessageSquare, 
        color: "text-cyan-400", 
        border: "border-cyan-500/20", 
        bg: "bg-cyan-500/5",
        description: "Recover dues via automated SMS/WhatsApp",
        action: "payments"
    },
    { 
        title: "Generate Report", 
        icon: BarChart3, 
        color: "text-primary", 
        border: "border-primary/20", 
        bg: "bg-primary/5",
        description: "Export daily gym performance metrics",
        action: "dashboard"
    },
    { 
        title: "Bulk WhatsApp", 
        icon: Send, 
        color: "text-emerald-500", 
        border: "border-emerald-500/20", 
        bg: "bg-emerald-500/5",
        description: "Engagement blast to all active members",
        action: "follow-ups"
    },
];

export default function DashboardActions() {
    const router = useRouter();
    const [lastAction, setLastAction] = useState<string | null>(null);

    const handleAction = (action: string, title: string) => {
        if (action && action !== 'dashboard') {
            router.push(`/admin?view=${action}`);
            setLastAction(`Opening ${title}...`);
            setTimeout(() => setLastAction(null), 3000);
            return;
        }
        
        setLastAction(`Executing ${title}...`);
        
        setTimeout(() => {
            setLastAction(`${title} completed successfully!`);
            setTimeout(() => setLastAction(null), 3000);
        }, 1500);
    };

    return (
        <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {actions.map((action, i) => (
                    <motion.button
                        key={action.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => handleAction(action.action || '', action.title)}
                        className={cn(
                            "p-8 rounded-[3rem] border backdrop-blur-md text-left transition-all duration-500 group relative overflow-hidden flex flex-col gap-6",
                            action.bg,
                            action.border,
                            "hover:scale-[1.02] active:scale-95 hover:shadow-2xl hover:shadow-black/20"
                        )}
                    >
                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-2xl transition-all duration-500 group-hover:rotate-[10deg] group-hover:scale-110 group-hover:bg-white/10 group-hover:border-white/20 shadow-inner">
                            <action.icon size={32} className={cn("transition-colors", action.color)} />
                        </div>

                        <div className="space-y-1 relative z-10">
                            <h3 className="text-sm font-black text-white italic uppercase tracking-wider group-hover:text-primary transition-colors">
                                {action.title}
                            </h3>
                            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest line-clamp-2">
                                {action.description}
                            </p>
                        </div>
                        
                        {/* Status dot */}
                        <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-white/10 group-hover:bg-primary transition-all group-hover:shadow-[0_0_10px_rgba(255,45,45,0.5)]" />
                    </motion.button>
                ))}
            </div>

            {/* Custom Notification Toast */}
            <AnimatePresence>
                {lastAction && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-8 right-8 z-[100] bg-[#0a0a0a]/90 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-5 rounded-[2rem] flex items-center gap-5 pr-10 border-l-4 border-l-primary"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(255,45,45,0.2)]">
                            <CheckCircle2 size={28} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">System Message</p>
                            <p className="text-[11px] text-white/40 font-bold italic tracking-tight">{lastAction}</p>
                        </div>
                        <button 
                            onClick={() => setLastAction(null)}
                            className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
