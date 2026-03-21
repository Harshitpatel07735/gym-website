"use client";

import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Search, Trash2, Edit2, CheckCircle2, Mail, Phone, Crown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const initialMembers = [
    { id: "1", name: "Alex Mercer", email: "alex.m@example.com", phone: "+1 234-567-8901", plan: "Elite Pro", joinDate: "Jan 12, 2024", status: "Active" },
    { id: "2", name: "Sarah Connor", email: "sarah.c@example.com", phone: "+1 234-567-8902", plan: "Basic", joinDate: "Feb 05, 2024", status: "Active" },
    { id: "3", name: "John Wick", email: "john.w@example.com", phone: "+1 234-567-8903", plan: "Elite Pro", joinDate: "Nov 20, 2023", status: "Inactive" },
    { id: "4", name: "Diana Prince", email: "diana.p@example.com", phone: "+1 234-567-8904", plan: "Premium", joinDate: "Mar 01, 2024", status: "Active" },
    { id: "5", name: "Bruce Wayne", email: "bruce.w@example.com", phone: "+1 234-567-8905", plan: "Elite Pro + Training", joinDate: "Dec 15, 2023", status: "Active" },
    { id: "6", name: "Clark Kent", email: "clark.k@example.com", phone: "+1 234-567-8906", plan: "Premium", joinDate: "Mar 10, 2024", status: "Active" },
    { id: "7", name: "Barry Allen", email: "barry.a@example.com", phone: "+1 234-567-8907", plan: "Basic", joinDate: "Jan 02, 2024", status: "Inactive" },
    { id: "8", name: "Natasha Romanoff", email: "natasha.r@example.com", phone: "+1 234-567-8908", plan: "Elite Pro", joinDate: "Feb 18, 2024", status: "Active" },
];

export default function MembersView() {
    const [members, setMembers] = useState(initialMembers);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
    
    // Add/Edit Member form state
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newPlan, setNewPlan] = useState("Basic");

    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const openAddModal = () => {
        setEditingMemberId(null);
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        setNewPlan("Basic");
        setShowAddModal(true);
    };

    const openEditModal = (member: any) => {
        setEditingMemberId(member.id);
        setNewName(member.name);
        setNewEmail(member.email);
        setNewPhone(member.phone);
        setNewPlan(member.plan);
        setShowAddModal(true);
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newEmail) return;

        if (editingMemberId) {
            setMembers(members.map(m => m.id === editingMemberId ? {
                ...m,
                name: newName,
                email: newEmail,
                phone: newPhone || "N/A",
                plan: newPlan
            } : m));
        } else {
            const newMember = {
                id: Math.random().toString(36).substr(2, 9),
                name: newName,
                email: newEmail,
                phone: newPhone || "N/A",
                plan: newPlan,
                joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                status: "Active"
            };
            setMembers([newMember, ...members]);
        }

        setShowAddModal(false);
        setEditingMemberId(null);
        setNewName("");
        setNewEmail("");
        setNewPhone("");
        setNewPlan("Basic");
    };

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
                <button 
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-[0_0_20px_rgba(255,45,45,0.3)] hover:scale-105 active:scale-95"
                >
                    <UserPlus size={16} />
                    Add Member
                </button>
            </div>

            <div className="bg-[#050505]/50 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5">
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Member</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Contact</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Plan</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40">Join Date</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-center">Status</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-white/40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredMembers.map((member) => (
                                    <motion.tr 
                                        key={member.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                                    >
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black shadow-[0_0_15px_rgba(255,45,45,0.1)]">
                                                    {member.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white capitalize">{member.name}</p>
                                                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">ID: #{member.id.padStart(5, '0')}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-white/60 text-xs">
                                                    <Mail size={12} className="text-primary/50" /> {member.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-white/60 text-xs">
                                                    <Phone size={12} className="text-primary/50" /> {member.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/80 inline-flex items-center gap-2">
                                                {member.plan.includes('Elite') && <Crown size={12} className="text-yellow-500" />}
                                                {member.plan}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{member.joinDate}</span>
                                        </td>
                                        <td className="p-6 text-center">
                                            <span className={cn(
                                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] inline-flex items-center gap-2 shadow-lg",
                                                member.status === "Active" 
                                                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" 
                                                    : "bg-white/5 text-white/40 border border-white/10"
                                            )}>
                                                {member.status === "Active" && <CheckCircle2 size={10} />}
                                                {member.status}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={() => openEditModal(member)}
                                                    className="p-2 rounded-xl border border-white/10 text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(member.id)}
                                                    className="p-2 rounded-xl border border-transparent text-white/40 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                            {filteredMembers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                        No members found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Member Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
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
                                className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] w-full max-w-md p-8 relative shadow-2xl overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
                                
                                <div className="flex items-center justify-between mb-8 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-wider">
                                            {editingMemberId ? "Edit Member" : "New Member"}
                                        </h3>
                                        <p className="text-[10px] text-primary font-black uppercase tracking-[0.2em] mt-1">
                                            {editingMemberId ? "Update details" : "Enroll a client"}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(255,45,45,0.2)]">
                                        <UserPlus size={24} />
                                    </div>
                                </div>

                                <form onSubmit={handleAddMember} className="space-y-4 relative z-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Full Name</label>
                                        <input 
                                            type="text" 
                                            required
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20 font-medium"
                                            placeholder="e.g. Clark Kent"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Email Address</label>
                                        <input 
                                            type="email" 
                                            required
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20 font-medium"
                                            placeholder="client@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            value={newPhone}
                                            onChange={(e) => setNewPhone(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-white/20 font-medium"
                                            placeholder="+1 234-567-8900"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-2">Membership Plan</label>
                                        <select 
                                            value={newPlan}
                                            onChange={(e) => setNewPlan(e.target.value)}
                                            className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="Basic">Basic Plan</option>
                                            <option value="Premium">Premium Plan</option>
                                            <option value="Elite Pro">Elite Pro (Full Access)</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center gap-3 pt-6">
                                        <button 
                                            type="button"
                                            onClick={() => setShowAddModal(false)}
                                            className="flex-1 py-3 px-4 rounded-xl border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-all text-center"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            className="flex-[2] py-3 px-4 rounded-xl bg-primary text-[10px] font-black uppercase tracking-widest text-white hover:bg-primary/80 hover:shadow-[0_0_20px_rgba(255,45,45,0.4)] transition-all text-center"
                                        >
                                            {editingMemberId ? "Update Member" : "Enroll Member"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
