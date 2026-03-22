'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

declare global { interface Window { Razorpay: any } }

export function useRazorpay() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function initiatePayment(plan: string): Promise<{ success?: boolean; error?: string }> {
        setLoading(true)
        try {
            if (!window.Razorpay) {
                await new Promise<void>((resolve, reject) => {
                    const s = document.createElement('script')
                    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
                    s.onload = () => resolve()
                    s.onerror = () => reject(new Error('Razorpay SDK failed to load'))
                    document.body.appendChild(s)
                })
            }

            const res = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan }),
            })
            const { orderId, amount, currency, error } = await res.json()
            if (error) throw new Error(error)

            await new Promise<void>((resolve, reject) => {
                const rzp = new window.Razorpay({
                    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                    amount, currency,
                    name: 'Yogi Fitness Studio',
                    description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Membership — 1 Month`,
                    order_id: orderId,
                    theme: { color: '#ff2d2d' },
                    handler: async (response: any) => {
                        const verify = await fetch('/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ ...response, plan }),
                        })
                        const result = await verify.json()
                        if (result.success) { router.refresh(); resolve() }
                        else reject(new Error('Verification failed'))
                    },
                    modal: { ondismiss: () => reject(new Error('Cancelled')) },
                })
                rzp.open()
            })

            return { success: true }
        } catch (err: any) {
            return { error: err.message }
        } finally {
            setLoading(false)
        }
    }

    return { initiatePayment, loading }
}