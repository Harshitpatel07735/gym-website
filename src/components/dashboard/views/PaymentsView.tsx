'use client'

import { motion } from 'framer-motion'
import { CreditCard, ArrowUpRight, Filter, Download, Search, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { getPayments } from '@/app/actions/admin-data'

interface Payment {
    id: string
    plan: string
    status: string
    price_paid: number
    created_at: string
    profiles: { full_name: string | null; email: string }[] | null
}

export default function PaymentsView() {
    const [payments, setPayments] = useState<Payment[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    const load = async () => {
        setLoading(true)
        const data = await getPayments()
        setPayments(data as Payment[])
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const filtered = payments.filter(p => {
        const name = p.profiles?.[0]?.full_name?.toLowerCase() ?? ''
        const email = p.profiles?.[0]?.email?.toLowerCase() ?? ''
        const q = search.toLowerCase()
        return name.includes(q) || email.includes(q)
    })

    const totalRevenue = payments.reduce((sum, p) => sum + (p.price_paid || 0), 0) / 100

    return (
        <div className="space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">
                        Payments & Finance
                    </h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">
                        Total collected: ₹{totalRevenue.toLocaleString('en-IN')}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-hover:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-[10px] font-bold focus:outline-none focus:border-primary/50 transition-all w-56"
                        />
                    </div>
                    <button onClick={load}
                        className="p-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 hover:text-white transition-all">
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Member</th>
                            <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Plan</th>
                            <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Amount (₹)</th>
                            <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20">Status</th>
                            <th className="p-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/20 text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <tr key={i}>
                                    <td colSpan={5} className="p-6">
                                        <div className="h-8 bg-white/5 rounded-xl animate-pulse" />
                                    </td>
                                </tr>
                            ))
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                    {payments.length === 0 ? 'No payments yet — Razorpay integration coming soon' : 'No results found'}
                                </td>
                            </tr>
                        ) : (
                            filtered.map((tx, i) => (
                                <motion.tr key={tx.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                                >
                                    <td className="p-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/20">
                                                <ArrowUpRight size={18} />
                                            </div>
                                            <div>
                                                <span className="text-[13px] font-black text-white italic block">
                                                    {tx.profiles?.[0]?.full_name ?? 'Unknown'}
                                                </span>
                                                <span className="text-[10px] text-white/30">
                                                    {tx.profiles?.[0]?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                            {tx.plan}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-sm font-black italic text-emerald-400">
                                            + ₹{(tx.price_paid / 100).toLocaleString('en-IN')}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <div className={cn(
                                            'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest',
                                            tx.status === 'active'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                                                : 'bg-white/5 text-white/40 border border-white/10'
                                        )}>
                                            <div className={cn('w-1.5 h-1.5 rounded-full', tx.status === 'active' ? 'bg-emerald-500' : 'bg-white/20')} />
                                            {tx.status}
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <span className="text-[10px] font-bold text-white/20">
                                            {new Date(tx.created_at).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
