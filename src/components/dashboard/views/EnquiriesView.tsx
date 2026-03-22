'use client'

import { motion } from 'framer-motion'
import { UserPlus, Mail, Clock, ChevronRight, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, useTransition } from 'react'
import { getEnquiries, updateEnquiryStatus } from '@/app/actions/admin-data'

interface Enquiry {
    id: string
    full_name: string
    email: string
    message: string
    status: string
    created_at: string
}

const STATUS_COLORS: Record<string, string> = {
    unread: 'text-primary bg-primary/10 border-primary/20',
    read: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
    replied: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
}

export default function EnquiriesView() {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const load = async () => {
        setLoading(true)
        const data = await getEnquiries()
        setEnquiries(data as Enquiry[])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const handleStatus = (id: string, status: string) => {
        startTransition(async () => {
            await updateEnquiryStatus(id, status)
            await load()
        })
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">
                        Pending Enquiries
                    </h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">
                        {enquiries.length} total enquiries
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={load}
                        className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="bg-white/5 p-1 rounded-2xl border border-white/10 flex gap-2">
                        <button className="px-6 py-2 bg-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest">
                            Active
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 animate-pulse h-48" />
                    ))}
                </div>
            ) : enquiries.length === 0 ? (
                <div className="text-center py-20 text-muted">
                    <p className="text-lg font-bold uppercase tracking-widest">No enquiries yet</p>
                    <p className="text-sm mt-2">Contact form submissions will appear here</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {enquiries.map((item, i) => (
                        <motion.div key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/5 backdrop-blur-md rounded-[2.5rem] border border-white/10 p-8 group hover:bg-white/10 transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[80px] -mr-16 -mt-16 group-hover:bg-primary/20 transition-all" />

                            <div className="flex flex-col gap-6 relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className="w-16 h-16 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-center text-primary shadow-inner">
                                        <UserPlus size={32} />
                                    </div>
                                    <div className={cn('px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border', STATUS_COLORS[item.status])}>
                                        {item.status}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-white italic tracking-tight">
                                        {item.full_name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-2 text-white/30">
                                        <Mail size={14} className="text-primary" />
                                        <span className="text-[9px] font-bold uppercase tracking-widest">
                                            {item.email}
                                        </span>
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="bg-white/5 rounded-xl p-3">
                                    <p className={cn('text-xs text-white/60', expanded !== item.id && 'line-clamp-2')}>
                                        {item.message}
                                    </p>
                                    {item.message.length > 100 && (
                                        <button
                                            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                                            className="text-[10px] text-primary mt-1 font-bold"
                                        >
                                            {expanded === item.id ? 'Show less' : 'Read more'}
                                        </button>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-white/20">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-bold italic">
                                            {new Date(item.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        {item.status !== 'read' && (
                                            <button
                                                disabled={isPending}
                                                onClick={() => handleStatus(item.id, 'read')}
                                                className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-50"
                                            >
                                                Mark Read
                                            </button>
                                        )}
                                        {item.status !== 'replied' && (
                                            <button
                                                disabled={isPending}
                                                onClick={() => handleStatus(item.id, 'replied')}
                                                className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                                            >
                                                Replied
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    )
}
