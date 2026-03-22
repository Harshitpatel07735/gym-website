'use server'

import { createClient } from '@/lib/supabase/server'
import { adminSupabase } from '@/lib/supabase/admin'
import { emailOtpSchema, otpVerifySchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'

export async function sendOtp(formData: FormData) {
    const parsed = emailOtpSchema.safeParse({ email: formData.get('email') })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOtp({
        email: parsed.data.email,
        options: { shouldCreateUser: true },
    })
    if (error) return { error: error.message }
    return { success: true }
}

export async function verifyOtp(formData: FormData) {
    const parsed = otpVerifySchema.safeParse({
        email: formData.get('email'),
        token: formData.get('token'),
    })
    if (!parsed.success) return { error: parsed.error.issues[0].message }

    const supabase = createClient()
    const { data, error } = await supabase.auth.verifyOtp({
        email: parsed.data.email,
        token: parsed.data.token,
        type: 'email',
    })
    if (error) return { error: error.message }
    if (!data.user) return { error: 'Login failed. Please try again.' }

    // Check if profile is complete
    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single()

    const role         = profile?.role ?? 'member'
    const isNewMember  = !profile?.full_name // no name = first time login

    revalidatePath('/', 'layout')

    return {
        success:    true,
        role,
        isNewMember,
        redirectTo: role === 'admin' ? '/admin' : '/',
    }
}

export async function saveProfile(formData: FormData) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not logged in' }

    const full_name = formData.get('full_name') as string
    const phone     = formData.get('phone') as string
    const age       = formData.get('age') as string

    if (!full_name || full_name.trim().length < 2) {
        return { error: 'Please enter your full name' }
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
        return { error: 'Enter a valid 10-digit Indian mobile number' }
    }
    if (!age || isNaN(Number(age)) || Number(age) < 10 || Number(age) > 100) {
        return { error: 'Enter a valid age between 10 and 100' }
    }

    const { error } = await adminSupabase
        .from('profiles')
        .update({
            full_name:       full_name.trim(),
            whatsapp_number: `91${phone}`,
            age:             Number(age),
        })
        .eq('id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
}
