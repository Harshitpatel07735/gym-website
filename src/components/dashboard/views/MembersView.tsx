'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  UserPlus, Search, Trash2, Edit2, CheckCircle2,
  Mail, Phone, Crown, X, Calendar, CreditCard, Activity
} from 'lucide-react'
import { useState, useEffect, useTransition } from 'react'
import { cn } from '@/lib/utils'
import { getMembers, updateLeadStatus } from '@/app/actions/admin-data'
import { createClient } from '@/lib/supabase/client'

interface Member {
  id: string
  full_name: string | null
  email: string | null
  whatsapp_number: string | null
  created_at: string
  memberships: {
    plan: string
    status: string
    expiry_date: string
    price_paid: number
    start_date: string
  }[] | null
}

export default function MembersView() {
  const [members, setMembers]           = useState<Member[]>([])
  const [loading, setLoading]           = useState(true)
  const [searchTerm, setSearchTerm]     = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [newName, setNewName]           = useState('')
  const [newEmail, setNewEmail]         = useState('')
  const [newPhone, setNewPhone]         = useState('')
  const [newPlan, setNewPlan]           = useState('basic')
  const [isPending, startTransition]    = useTransition()

  const load = async () => {
    setLoading(true)
    const data = await getMembers()
    setMembers(data as Member[])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const filteredMembers = members.filter(m =>
    (m.full_name?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (m.email?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  )

  const getActiveMembership = (member: Member) =>
    member.memberships?.find(m => m.status === 'active') ?? member.memberships?.[0] ?? null

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault()
    // In real usage members sign up via OTP
    // Admin can add walk-ins via leads table
    setShowAddModal(false)
    alert('To add a member, they need to sign up via the login page with their email OTP. For walk-ins, add them as a lead in Follow-ups.')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative group w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm w-full focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all text-white placeholder:text-white/20"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
            {filteredMembers.length} members
          </span>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-[0_0_20px_rgba(255,45,45,0.3)] hover:scale-105 active:scale-95"
          >
            <UserPlus size={16} />
            Add Member
          </button>
        </div>
      </div>

      <div className="bg-[#050505]/50 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Member</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Contact</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Plan</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Expiry</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td colSpan={6} className="p-4">
                        <div className="h-10 bg-white/5 rounded-xl animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredMembers.map((member) => {
                  const membership = getActiveMembership(member)
                  return (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                      onClick={() => setSelectedMember(member)}
                    >
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black">
                            {(member.full_name ?? member.email ?? 'M').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-white capitalize">
                              {member.full_name ?? 'No name'}
                            </p>
                            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                              Click to view details
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Mail size={12} className="text-primary/50" />
                            {member.email ?? '—'}
                          </div>
                          <div className="flex items-center gap-2 text-white/60 text-xs">
                            <Phone size={12} className="text-primary/50" />
                            {member.whatsapp_number ? `+${member.whatsapp_number}` : '—'}
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/80 inline-flex items-center gap-2">
                          {membership?.plan === 'elite' && <Crown size={12} className="text-yellow-500" />}
                          {membership?.plan ?? 'No plan'}
                        </span>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-bold text-white/60">
                          {membership?.expiry_date
                            ? new Date(membership.expiry_date).toLocaleDateString('en-IN', {
                                day: 'numeric', month: 'short', year: 'numeric'
                              })
                            : '—'}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2',
                          membership?.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                            : 'bg-white/5 text-white/40 border border-white/10'
                        )}>
                          {membership?.status === 'active' && <CheckCircle2 size={10} />}
                          {membership?.status ?? 'inactive'}
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedMember(member) }}
                          className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
              {!loading && filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/40 font-bold uppercase tracking-widest text-[10px]">
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Detail Side Panel */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setSelectedMember(null)}
            />
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 overflow-y-auto p-8"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black uppercase tracking-tight">Member Details</h3>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Profile */}
              <div className="glass p-6 rounded-2xl border border-white/5 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-black text-2xl">
                    {(selectedMember.full_name ?? selectedMember.email ?? 'M').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">
                      {selectedMember.full_name ?? 'No name set'}
                    </h4>
                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                      {getActiveMembership(selectedMember)?.plan
                        ? `${getActiveMembership(selectedMember)!.plan} member`
                        : 'No active plan'}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Mail size={16} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-[9px] text-muted uppercase tracking-widest font-bold">Email</p>
                      <p className="text-sm text-white font-bold">{selectedMember.email ?? '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Phone size={16} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-[9px] text-muted uppercase tracking-widest font-bold">WhatsApp</p>
                      <p className="text-sm text-white font-bold">
                        {selectedMember.whatsapp_number ? `+${selectedMember.whatsapp_number}` : 'Not set'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Calendar size={16} className="text-primary flex-shrink-0" />
                    <div>
                      <p className="text-[9px] text-muted uppercase tracking-widest font-bold">Member Since</p>
                      <p className="text-sm text-white font-bold">
                        {new Date(selectedMember.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Membership history */}
              <div className="glass p-6 rounded-2xl border border-white/5">
                <h5 className="text-xs uppercase tracking-widest text-muted font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={14} className="text-primary" />
                  Membership History
                </h5>
                {selectedMember.memberships && selectedMember.memberships.length > 0 ? (
                  <div className="space-y-3">
                    {selectedMember.memberships.map((m, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn(
                            'text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full',
                            m.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-white/5 text-white/40 border border-white/10'
                          )}>
                            {m.plan} — {m.status}
                          </span>
                          <span className="text-xs font-bold text-emerald-400">
                            ₹{(m.price_paid / 100).toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-white/40">
                          <span>From: {new Date(m.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          <span>To: {new Date(m.expiry_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-xs text-center py-4">No membership history</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Add Member Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-white italic uppercase">Add Member</h3>
                <button onClick={() => setShowAddModal(false)}
                  className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
                <p className="text-xs text-primary font-bold">
                  💡 Members can self-register by going to /login and entering their email.
                  For walk-ins, add them as a lead in the Follow-ups section instead.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
                >
                  Close
                </button>
                <a
                  href="/admin?view=follow-ups"
                  className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest text-center hover:bg-primary/80 transition-all"
                >
                  Add Walk-in Lead
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
