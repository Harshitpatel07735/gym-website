import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { verifyCronSecret } from '@/lib/cron-auth'
import { sendAppointmentReminder } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
    const authError = verifyCronSecret(request)
    if (authError) return authError

    const now = new Date()
    const inOneHr = new Date(now.getTime() + 60 * 60 * 1000)

    const { data: upcoming } = await adminSupabase
        .from('appointments')
        .select('*, trainers(name), profiles(full_name, email, whatsapp_number)')
        .eq('status', 'upcoming').eq('reminder_sent', false)
        .gte('scheduled_at', now.toISOString()).lte('scheduled_at', inOneHr.toISOString())

    let reminded = 0
    for (const appt of upcoming ?? []) {
        const trainer = (appt as any).trainers?.name ?? 'Your trainer'
        const member = (appt as any).profiles
        const timeStr = new Date(appt.scheduled_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

        if (member?.whatsapp_number) {
            sendAppointmentReminder(member.whatsapp_number, member.full_name ?? 'Member', trainer, timeStr)
        }
        if (member?.email) {
            sendEmail('appointment_reminder', member.email, { name: member.full_name ?? 'Member', trainer, time: timeStr })
        }

        await adminSupabase.from('appointments').update({ reminder_sent: true }).eq('id', appt.id)
        reminded++
    }

    return NextResponse.json({ reminded })
}