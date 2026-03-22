import { NextRequest, NextResponse } from 'next/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { verifyCronSecret } from '@/lib/cron-auth'
import { sendMonthlyProgress } from '@/lib/whatsapp'
import { sendEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
    const authError = verifyCronSecret(request)
    if (authError) return authError

    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59)
    const monthStr = lastMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

    const { data: activeMembers } = await adminSupabase
        .from('memberships').select('user_id, plan, expiry_date, profiles(full_name, email, whatsapp_number)')
        .eq('status', 'active')

    let processed = 0
    for (const member of activeMembers ?? []) {
        const profile = (member as any).profiles

        const { data: checkins } = await adminSupabase
            .from('workout_checkins').select('checked_in_at').eq('user_id', member.user_id)
            .gte('checked_in_at', lastMonth.toISOString()).lte('checked_in_at', lastMonthEnd.toISOString())
            .order('checked_in_at')

        let longestStreak = 0, currentStreak = 0
        let prevDate: Date | null = null
        for (const c of checkins ?? []) {
            const d = new Date(c.checked_in_at)
            d.setHours(0, 0, 0, 0)
            if (prevDate) {
                const diff = (d.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
                currentStreak = diff === 1 ? currentStreak + 1 : 1
            } else { currentStreak = 1 }
            if (currentStreak > longestStreak) longestStreak = currentStreak
            prevDate = d
        }

        const daysLeft = Math.max(0, Math.floor(
            (new Date(member.expiry_date).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        ))
        const checkinCount = checkins?.length ?? 0
        const avgWeekly = parseFloat((checkinCount / 4.3).toFixed(1))

        await adminSupabase.from('monthly_progress_reports').upsert({
            user_id: member.user_id, report_month: lastMonth.toISOString().split('T')[0],
            checkin_count: checkinCount, longest_streak: longestStreak,
            days_remaining: daysLeft, current_plan: member.plan, avg_weekly_visits: avgWeekly,
        }, { onConflict: 'user_id,report_month' })

        if (profile?.email) {
            sendEmail('membership', profile.email, {
                name: profile.full_name ?? 'Member', plan: member.plan,
                expiry: new Date(member.expiry_date).toLocaleDateString('en-IN')
            })
        }
        if (profile?.whatsapp_number) {
            const result = await sendMonthlyProgress(
                profile.whatsapp_number, profile.full_name ?? 'Member',
                monthStr, checkinCount, longestStreak, daysLeft
            )
            if (result.success) {
                await adminSupabase.from('whatsapp_notification_log').insert({
                    user_id: member.user_id, whatsapp_number: profile.whatsapp_number,
                    message_type: 'monthly_progress', status: 'sent',
                })
            }
        }

        // Achievement checks with try/catch to handle conflicts
        if (longestStreak >= 7) {
            try {
                await adminSupabase.from('achievements').upsert({ user_id: member.user_id, badge_type: 'streak_7' }, { onConflict: 'user_id,badge_type' })
            } catch { /* ignore conflict errors */ }
        }
        if (longestStreak >= 30) {
            try {
                await adminSupabase.from('achievements').upsert({ user_id: member.user_id, badge_type: 'streak_30' }, { onConflict: 'user_id,badge_type' })
            } catch { /* ignore conflict errors */ }
        }
        if (longestStreak >= 100) {
            try {
                await adminSupabase.from('achievements').upsert({ user_id: member.user_id, badge_type: 'streak_100' }, { onConflict: 'user_id,badge_type' })
            } catch { /* ignore conflict errors */ }
        }

        processed++
    }

    return NextResponse.json({ processed, month: monthStr })
}