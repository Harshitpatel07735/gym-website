'use server'

import { adminSupabase } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function verifyAdmin() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    const { data: profile } = await adminSupabase
        .from('profiles').select('role').eq('id', user.id).single()
    return profile?.role === 'admin' ? user : null
}

export async function getAdminStats() {
    try {
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

        const [
            { count: activeMembers },
            { count: newLeads },
            { count: unreadEnquiries },
            { count: subscribers },
            { data: revenue },
        ] = await Promise.all([
            adminSupabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
            adminSupabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo.toISOString()),
            adminSupabase.from('enquiries').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
            adminSupabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }).eq('status', 'active'),
            adminSupabase.from('memberships').select('price_paid').gte('created_at', monthStart.toISOString()),
        ])

        const totalRevenue = (revenue ?? []).reduce((sum, m) => sum + (m.price_paid / 100), 0)

        return {
            activeMembers: activeMembers ?? 0,
            newLeads: newLeads ?? 0,
            unreadEnquiries: unreadEnquiries ?? 0,
            subscribers: subscribers ?? 0,
            revenue: totalRevenue,
        }
    } catch {
        return { activeMembers: 0, newLeads: 0, unreadEnquiries: 0, subscribers: 0, revenue: 0 }
    }
}

export async function getMembers() {
    try {
        const { data } = await adminSupabase
            .from('profiles')
            .select('id, full_name, email, whatsapp_number, created_at, memberships(plan, status, expiry_date)')
            .order('created_at', { ascending: false })
        return data ?? []
    } catch { return [] }
}

export async function getLeads() {
    try {
        const { data } = await adminSupabase
            .from('leads').select('*').order('created_at', { ascending: false })
        return data ?? []
    } catch { return [] }
}

export async function updateLeadStatus(id: string, status: string) {
    const admin = await verifyAdmin()
    if (!admin) return { error: 'Unauthorized' }
    await adminSupabase.from('leads').update({ status }).eq('id', id)
    revalidatePath('/admin')
    return { success: true }
}

export async function getEnquiries() {
    try {
        const { data } = await adminSupabase
            .from('enquiries').select('*').order('created_at', { ascending: false })
        return data ?? []
    } catch { return [] }
}

export async function updateEnquiryStatus(id: string, status: string) {
    const admin = await verifyAdmin()
    if (!admin) return { error: 'Unauthorized' }
    await adminSupabase.from('enquiries').update({ status }).eq('id', id)
    revalidatePath('/admin')
    return { success: true }
}

export async function getPayments() {
    try {
        const { data } = await adminSupabase
            .from('memberships')
            .select('id, plan, status, price_paid, created_at, profiles(full_name, email)')
            .order('created_at', { ascending: false })
            .limit(50)
        return data ?? []
    } catch { return [] }
}

export async function addWalkIn(formData: FormData) {
    const admin = await verifyAdmin()
    if (!admin) return { error: 'Unauthorized' }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const source = (formData.get('source') as string) || 'walk_in'
    const interest = formData.get('interest') as string

    const { error } = await adminSupabase.from('leads').insert({
        full_name: name, email, phone, source, interest, status: 'new'
    })
    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}