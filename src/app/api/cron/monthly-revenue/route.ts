import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { verifyCronSecret } from '@/lib/cron-auth'
import { sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
    const authError = verifyCronSecret(request)
    if (authError) return authError

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const monthStr = lastMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

    const [
        { count: activeMembers },
        { data: newMemberships },
        { data: expiredMemberships },
    ] = await Promise.all([
        adminSupabase.from('memberships').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        adminSupabase.from('memberships').select('plan, price_paid').gte('created_at', lastMonth.toISOString()).lt('created_at', now.toISOString()),
        adminSupabase.from('memberships').select('id').eq('status', 'expired').gte('updated_at', lastMonth.toISOString()).lt('updated_at', now.toISOString()),
    ])

    const totalRevenue = (newMemberships ?? []).reduce((sum, m) => sum + m.price_paid, 0) / 100

    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
        sendEmail('membership', adminEmail, {
            name: 'Admin',
            plan: `Revenue Report — ${monthStr}`,
            expiry: `Total: ₹${totalRevenue.toLocaleString('en-IN')} | Active: ${activeMembers} | New: ${newMemberships?.length ?? 0} | Expired: ${expiredMemberships?.length ?? 0}`,
        })
    }

    return NextResponse.json({ month: monthStr, total_revenue: totalRevenue })
}