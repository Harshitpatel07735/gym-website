import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

const PLAN_PRICES: Record<string, number> = {
    basic: 199900,
    pro: 399900,
    elite: 699900,
}

export async function POST(request: NextRequest) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Please log in first' }, { status: 401 })

    const { plan } = await request.json()
    if (!PLAN_PRICES[plan]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    try {
        const order = await razorpay.orders.create({
            amount: PLAN_PRICES[plan],
            currency: 'INR',
            receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
            notes: { user_id: user.id, plan },
        })
        return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}