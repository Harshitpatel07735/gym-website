'use client'

import { motion } from 'framer-motion'
import { Phone, MessageSquare, CheckCircle2, Clock, User, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, useTransition } from 'react'
import { getLeads, updateLeadStatus } from '@/app/actions/admin-data'

interface Lead {
    id: string
    full_name: string
    email: string
    phone: string
    source: string
    status: string
    interest: string | null
    created_at: string
}

const STATUS_COLORS: Record<string, string> = {
    new: 'text-primary bg-primary/10 border-primary/20',
    contacted: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
    converted: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
    dropped: 'text-slate-400 bg-white/5 border-white/10',
}

const STATUS_NEXT: Record<string, string[]> = {
    new: ['contacted', 'dropped'],
    contacted: ['converted', 'dropped'],
    converted: [],
    dropped: ['new'],
}

export default function FollowUpsView() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()

    const load = async () => {
        setLoading(true)
        const data = await getLeads()
        setLeads(data as Lead[])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const handleStatus = (id: string, status: string) => {
        startTransition(async () => {
            await updateLeadStatus(id, status)
            await load()
        })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">
                        All Follow-ups
                    </h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">
                        {leads.length} total leads
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button className="px-6 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                        {leads.filter(l => l.status === 'new').length} New
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white/5 rounded-[2rem] border border-white/10 p-6 animate-pulse h-24" />
                    ))}
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-20 text-muted">
                    <p className="text-lg font-bold uppercase tracking-widest">No leads yet</p>
                    <p className="text-sm mt-2">Free trial and walk-in submissions will appear here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {leads.map((item, i) => (
                        <motion.div key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:bg-white/10 transition-all border-l-4 border-l-primary/50"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                                    <User size={28} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-white italic">{item.full_name}</h3>
                                    <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">
                                        {item.email} · +91{item.phone}
                                    </p>
                                    {item.interest && (
                                        <p className="text-[10px] text-primary font-bold mt-0.5">
                                            Interested in: {item.interest}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block">
                                        Source
                                    </span>
                                    <span className="text-[10px] font-bold text-white/60 uppercase">
                                        {item.source}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block">
                                        Status
                                    </span>
                                    <div className={cn('px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border', STATUS_COLORS[item.status])}>
                                        {item.status}
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20 block">
                                        Date
                                    </span>
                                    <div className="flex items-center gap-2 text-white/60">
                                        <Clock size={12} />
                                        <span className="text-[10px] font-bold">
                                            {new Date(item.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short'
                                            })}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {STATUS_NEXT[item.status]?.map(next => (
                                        <button
                                            key={next}
                                            disabled={isPending}
                                            onClick={() => handleStatus(item.id, next)}
                                            className={cn(
                                                'text-[9px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border transition-all disabled:opacity-50',
                                                next === 'converted'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                                                    : next === 'contacted'
                                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                                                        : 'bg-white/5 text-white/40 border-white/10 hover:bg-white/10'
                                            )}
                                        >
                                            → {next}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
