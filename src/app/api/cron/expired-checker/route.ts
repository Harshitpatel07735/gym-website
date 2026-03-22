import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { verifyCronSecret } from '@/lib/cron-auth'
import { sendMembershipExpired } from '@/lib/whatsapp'

export async function GET(request: NextRequest) {
    const authError = verifyCronSecret(request)
    if (authError) return authError

    const { data: expired } = await adminSupabase
        .from('memberships').update({ status: 'expired' })
        .eq('status', 'active').lt('expiry_date', new Date().toISOString())
        .select('user_id, profiles(full_name, whatsapp_number)')

    for (const m of expired ?? []) {
        const profile = (m as any).profiles
        if (!profile?.whatsapp_number) continue
        const result = await sendMembershipExpired(profile.whatsapp_number, profile.full_name ?? 'Member')
        if (result.success) {
            await adminSupabase.from('whatsapp_notification_log').insert({
                user_id: m.user_id, whatsapp_number: profile.whatsapp_number,
                message_type: 'membership_expired', status: 'sent',
            })
        }
    }

    return NextResponse.json({ expired: expired?.length ?? 0 })
}