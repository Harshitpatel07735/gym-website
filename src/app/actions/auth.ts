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

    const { data: profile } = await adminSupabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

    const role = profile?.role ?? 'member'
    revalidatePath('/', 'layout')

    return {
        success: true,
        role,
        redirectTo: role === 'admin' ? '/admin' : '/',
    }
}

export async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
}