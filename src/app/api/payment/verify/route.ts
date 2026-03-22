import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { adminSupabase } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { sendWelcomeMessage } from '@/lib/whatsapp'

const PLAN_PRICES: Record<string, number> = { basic: 199900, pro: 399900, elite: 699900 }

export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = await request.json()

    // Verify signature
    const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex')

    if (expectedSig !== razorpay_signature) {
        return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Check for duplicate payment
    const { data: existing } = await adminSupabase
        .from('memberships').select('id').eq('razorpay_payment_id', razorpay_payment_id).single()
    if (existing) return NextResponse.json({ success: true })

    const startDate = new Date()
    const expiryDate = new Date()
    expiryDate.setMonth(expiryDate.getMonth() + 1)

    await adminSupabase
        .from('memberships').update({ status: 'expired' })
        .eq('user_id', user.id).eq('status', 'active')

    await adminSupabase.from('memberships').insert({
        user_id: user.id, plan, status: 'active',
        price_paid: PLAN_PRICES[plan],
        razorpay_order_id, razorpay_payment_id, razorpay_signature,
        start_date: startDate.toISOString(),
        expiry_date: expiryDate.toISOString(),
    })

    const { data: profile } = await adminSupabase
        .from('profiles').select('full_name, whatsapp_number').eq('id', user.id).single()

    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1)
    const expiryStr = expiryDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

    if (user.email) {
        sendEmail('membership', user.email, { name: profile?.full_name ?? 'Member', plan: planLabel, expiry: expiryStr })
    }
    if (profile?.whatsapp_number) {
        sendWelcomeMessage(profile.whatsapp_number, profile?.full_name ?? 'Member', planLabel)
    }

    return NextResponse.json({ success: true })
}