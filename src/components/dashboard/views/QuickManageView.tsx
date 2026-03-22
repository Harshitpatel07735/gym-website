'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MoreVertical, RefreshCw, UserPlus, X, Trash2, Edit2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useEffect, useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { adminSupabase } from '@/lib/supabase/admin'

interface Trainer {
    id: string
    name: string
    role: string
    bio: string | null
    image_url: string | null
    instagram_url: string | null
    twitter_url: string | null
    is_active: boolean
    display_order: number
}

interface TrainerForm {
    name: string
    role: string
    bio: string
    image_url: string
    instagram_url: string
    twitter_url: string
    display_order: number
    is_active: boolean
}

const emptyForm: TrainerForm = {
    name: '', role: '', bio: '', image_url: '',
    instagram_url: '', twitter_url: '', display_order: 0, is_active: true
}

export default function QuickManageView() {
    const [trainers, setTrainers] = useState<Trainer[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [form, setForm] = useState<TrainerForm>(emptyForm)
    const [formError, setFormError] = useState('')
    const [isPending, startTransition] = useTransition()

    const load = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const { data } = await supabase
                .from('trainers')
                .select('*')
                .order('display_order')
            setTrainers(data ?? [])
        } catch {
            setTrainers([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const openAddForm = () => {
        setEditingId(null)
        setForm(emptyForm)
        setFormError('')
        setShowForm(true)
    }

    const openEditForm = (trainer: Trainer) => {
        setEditingId(trainer.id)
        setForm({
            name: trainer.name,
            role: trainer.role,
            bio: trainer.bio ?? '',
            image_url: trainer.image_url ?? '',
            instagram_url: trainer.instagram_url ?? '',
            twitter_url: trainer.twitter_url ?? '',
            display_order: trainer.display_order,
            is_active: trainer.is_active,
        })
        setFormError('')
        setShowForm(true)
    }

    const handleSave = () => {
        if (!form.name.trim()) { setFormError('Name is required'); return }
        if (!form.role.trim()) { setFormError('Role is required'); return }

        startTransition(async () => {
            try {
                const supabase = createClient()
                if (editingId) {
                    // Update existing trainer
                    const { error } = await supabase
                        .from('trainers')
                        .update({
                            name: form.name.trim(),
                            role: form.role.trim(),
                            bio: form.bio.trim() || null,
                            image_url: form.image_url.trim() || null,
                            instagram_url: form.instagram_url.trim() || null,
                            twitter_url: form.twitter_url.trim() || null,
                            display_order: form.display_order,
                            is_active: form.is_active,
                        })
                        .eq('id', editingId)
                    if (error) { setFormError(error.message); return }
                } else {
                    // Add new trainer
                    const { error } = await supabase
                        .from('trainers')
                        .insert({
                            name: form.name.trim(),
                            role: form.role.trim(),
                            bio: form.bio.trim() || null,
                            image_url: form.image_url.trim() || null,
                            instagram_url: form.instagram_url.trim() || null,
                            twitter_url: form.twitter_url.trim() || null,
                            display_order: form.display_order,
                            is_active: form.is_active,
                        })
                    if (error) { setFormError(error.message); return }
                }
                setShowForm(false)
                setEditingId(null)
                setForm(emptyForm)
                await load()
            } catch (err: any) {
                setFormError(err.message)
            }
        })
    }

    const handleDelete = (id: string, name: string) => {
        if (!confirm(`Delete trainer "${name}"? This cannot be undone.`)) return
        startTransition(async () => {
            try {
                const supabase = createClient()
                await supabase.from('trainers').delete().eq('id', id)
                await load()
            } catch { }
        })
    }

    const handleToggleActive = (id: string, current: boolean) => {
        startTransition(async () => {
            try {
                const supabase = createClient()
                await supabase.from('trainers').update({ is_active: !current }).eq('id', id)
                await load()
            } catch { }
        })
    }

    return (
        <div className="space-y-10">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-l-2 border-primary/20 pl-6">
                <div>
                    <h2 className="text-xl font-black text-white italic uppercase tracking-wider">
                        Trainer Management
                    </h2>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">
                        {trainers.length} trainers · {trainers.filter(t => t.is_active).length} active
                    </p>
                </div>
                <div className="flex gap-3">
                    <button onClick={load}
                        className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-all">
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={openAddForm}
                        className="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                        <UserPlus size={16} />
                        Add Trainer
                    </button>
                </div>
            </div>

            {/* Trainer Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 animate-pulse h-48" />
                    ))}
                </div>
            ) : trainers.length === 0 ? (
                <div className="text-center py-20 text-muted">
                    <p className="text-lg font-bold uppercase tracking-widest mb-2">No trainers yet</p>
                    <p className="text-sm mb-6">Add your first trainer to get started</p>
                    <button onClick={openAddForm} className="btn-primary py-3 px-8 text-xs">
                        + Add First Trainer
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trainers.map((trainer, i) => (
                        <motion.div key={trainer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 group hover:bg-white/10 transition-all"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {trainer.image_url ? (
                                        <img
                                            src={trainer.image_url}
                                            alt={trainer.name}
                                            className="w-14 h-14 rounded-2xl object-cover border-2 border-primary/20"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 rounded-2xl bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-black text-xl">
                                            {trainer.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-black text-white">{trainer.name}</h3>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em]">
                                            {trainer.role}
                                        </p>
                                    </div>
                                </div>
                                <span className={cn(
                                    'text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full border',
                                    trainer.is_active
                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                        : 'bg-white/5 text-white/30 border-white/10'
                                )}>
                                    {trainer.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            {trainer.bio && (
                                <p className="text-[11px] text-white/40 mb-4 line-clamp-2">{trainer.bio}</p>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                <button
                                    onClick={() => openEditForm(trainer)}
                                    disabled={isPending}
                                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                                >
                                    <Edit2 size={12} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleToggleActive(trainer.id, trainer.is_active)}
                                    disabled={isPending}
                                    className={cn(
                                        'flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-widest transition-all disabled:opacity-50',
                                        trainer.is_active
                                            ? 'bg-white/5 border-white/10 text-white/40 hover:text-amber-400 hover:border-amber-500/20'
                                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                    )}
                                >
                                    {trainer.is_active ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => handleDelete(trainer.id, trainer.name)}
                                    disabled={isPending}
                                    className="ml-auto p-2 rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add / Edit Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] w-full max-w-lg p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-black text-white italic uppercase">
                                        {editingId ? 'Edit Trainer' : 'Add New Trainer'}
                                    </h3>
                                    <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1">
                                        {editingId ? 'Update trainer details' : 'Add to your team'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowForm(false)}
                                    className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Form */}
                            <div className="space-y-4">

                                {/* Name */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Alex Johnson"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                    />
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                        Role / Specialization *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.role}
                                        onChange={(e) => setForm({ ...form, role: e.target.value })}
                                        placeholder="Strength & Conditioning Coach"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                    />
                                </div>

                                {/* Bio */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                        Bio
                                    </label>
                                    <textarea
                                        value={form.bio}
                                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                        placeholder="Brief description about the trainer..."
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all resize-none placeholder:text-white/20"
                                    />
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                        Profile Photo URL
                                    </label>
                                    <input
                                        type="url"
                                        value={form.image_url}
                                        onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                        placeholder="https://example.com/photo.jpg"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                    />
                                    <p className="text-[10px] text-muted mt-1 ml-1">
                                        Paste a direct image URL (upload to Imgur, Cloudinary, etc.)
                                    </p>
                                </div>

                                {/* Instagram + Twitter */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                            Instagram URL
                                        </label>
                                        <input
                                            type="url"
                                            value={form.instagram_url}
                                            onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                                            placeholder="https://instagram.com/..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                            Twitter URL
                                        </label>
                                        <input
                                            type="url"
                                            value={form.twitter_url}
                                            onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                                            placeholder="https://twitter.com/..."
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
                                        />
                                    </div>
                                </div>

                                {/* Display order + Active toggle */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                            Display Order
                                        </label>
                                        <input
                                            type="number"
                                            value={form.display_order}
                                            onChange={(e) => setForm({ ...form, display_order: Number(e.target.value) })}
                                            min={0}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                                        />
                                        <p className="text-[10px] text-muted mt-1 ml-1">0 = first</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 block mb-1.5 ml-1">
                                            Status
                                        </label>
                                        <select
                                            value={form.is_active ? 'true' : 'false'}
                                            onChange={(e) => setForm({ ...form, is_active: e.target.value === 'true' })}
                                            className="w-full bg-[#111] border border-white/10 rounded-2xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-all"
                                        >
                                            <option value="true">Active</option>
                                            <option value="false">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Error */}
                                {formError && (
                                    <div className="bg-primary/10 border border-primary/20 text-primary text-xs py-3 px-4 rounded-xl text-center">
                                        {formError}
                                    </div>
                                )}

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 py-3 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-white/60 hover:text-white transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSave}
                                        disabled={isPending}
                                        className="flex-[2] py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <Save size={14} />
                                        {isPending ? 'Saving...' : (editingId ? 'Update Trainer' : 'Add Trainer')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
