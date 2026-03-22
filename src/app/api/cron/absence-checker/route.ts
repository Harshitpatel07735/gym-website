import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { verifyCronSecret } from '@/lib/cron-auth'
import { sendAbsenceAlert } from '@/lib/whatsapp'

export async function GET(request: NextRequest) {
    const authError = verifyCronSecret(request)
    if (authError) return authError

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: activeMembers } = await adminSupabase
        .from('profiles').select('id, full_name, whatsapp_number, memberships!inner(status)')
        .eq('memberships.status', 'active').not('whatsapp_number', 'is', null)

    let alerted = 0
    for (const member of activeMembers ?? []) {
        const { data: recentCheckin } = await adminSupabase
            .from('workout_checkins').select('id').eq('user_id', member.id)
            .gte('checked_in_at', sevenDaysAgo.toISOString()).single()
        if (recentCheckin) continue

        const { data: recentAlert } = await adminSupabase
            .from('whatsapp_notification_log').select('id').eq('user_id', member.id)
            .eq('message_type', 'absence_alert').gte('sent_at', sevenDaysAgo.toISOString()).single()
        if (recentAlert) continue

        const result = await sendAbsenceAlert(member.whatsapp_number!, member.full_name ?? 'Member')
        if (result.success) {
            await adminSupabase.from('whatsapp_notification_log').insert({
                user_id: member.id, whatsapp_number: member.whatsapp_number,
                message_type: 'absence_alert', status: 'sent',
            })
            alerted++
        }
    }

    return NextResponse.json({ alerted })
}