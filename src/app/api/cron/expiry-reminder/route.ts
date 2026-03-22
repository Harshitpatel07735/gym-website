import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { verifyCronSecret } from '@/lib/cron-auth'
import { sendExpiryReminder } from '@/lib/whatsapp'

export async function GET(request: NextRequest) {
    const authError = verifyCronSecret(request)
    if (authError) return authError

    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    const threeDaysFromNowEnd = new Date(threeDaysFromNow)
    threeDaysFromNowEnd.setHours(23, 59, 59, 999)
    threeDaysFromNow.setHours(0, 0, 0, 0)

    const { data: members } = await adminSupabase
        .from('memberships')
        .select('user_id, plan, expiry_date, profiles(full_name, whatsapp_number)')
        .eq('status', 'active')
        .gte('expiry_date', threeDaysFromNow.toISOString())
        .lte('expiry_date', threeDaysFromNowEnd.toISOString())

    let sent = 0
    for (const m of members ?? []) {
        const profile = (m as any).profiles
        if (!profile?.whatsapp_number) continue

        const { data: alreadySent } = await adminSupabase
            .from('whatsapp_notification_log')
            .select('id').eq('user_id', m.user_id).eq('message_type', 'expiry_reminder')
            .gte('sent_at', threeDaysFromNow.toISOString()).single()
        if (alreadySent) continue

        const result = await sendExpiryReminder(
            profile.whatsapp_number, profile.full_name ?? 'Member', m.plan, 3
        )
        if (result.success) {
            await adminSupabase.from('whatsapp_notification_log').insert({
                user_id: m.user_id, whatsapp_number: profile.whatsapp_number,
                message_type: 'expiry_reminder', status: 'sent',
            })
            sent++
        }
    }

    return NextResponse.json({ sent })
}