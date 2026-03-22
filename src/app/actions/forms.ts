'use server'

import { adminSupabase } from '@/lib/supabase/admin'
import { contactSchema, freeTrialSchema, newsletterSchema } from '@/lib/validations'
import { sendEmail } from '@/lib/email'
import { sendWhatsAppMessage } from '@/lib/whatsapp'

export async function submitContactForm(formData: FormData) {
    const parsed = contactSchema.safeParse({
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        message: formData.get('message'),
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const { error } = await adminSupabase.from('enquiries').insert(parsed.data)
    if (error) return { error: 'Submission failed. Please try again.' }

    sendEmail('contact', parsed.data.email, { name: parsed.data.full_name, email: parsed.data.email })

    const adminWA = process.env.ADMIN_WHATSAPP_NUMBER
    if (adminWA) {
        sendWhatsAppMessage(adminWA,
            `📩 New Contact Form\n\nFrom: ${parsed.data.full_name}\nEmail: ${parsed.data.email}\n\nMessage: ${parsed.data.message}`
        )
    }

    return { success: true }
}

export async function submitFreeTrial(formData: FormData) {
    const parsed = freeTrialSchema.safeParse({
        full_name: formData.get('full_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const { error } = await adminSupabase.from('leads').insert({
        ...parsed.data,
        source: 'free_trial',
    })
    if (error) return { error: 'Submission failed. Please try again.' }

    sendEmail('free_trial', parsed.data.email, {
        name: parsed.data.full_name, email: parsed.data.email, phone: parsed.data.phone
    })

    const adminWA = process.env.ADMIN_WHATSAPP_NUMBER
    if (adminWA) {
        sendWhatsAppMessage(adminWA,
            `🎉 New Free Trial!\n\nName: ${parsed.data.full_name}\nEmail: ${parsed.data.email}\nPhone: +91${parsed.data.phone}`
        )
    }

    return { success: true }
}

export async function subscribeNewsletter(formData: FormData) {
    const parsed = newsletterSchema.safeParse({ email: formData.get('email') })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const { error } = await adminSupabase
        .from('newsletter_subscribers')
        .upsert({ email: parsed.data.email, status: 'active' }, { onConflict: 'email' })
    if (error) return { error: 'Could not subscribe. Please try again.' }

    sendEmail('newsletter', parsed.data.email, {})
    return { success: true }
}