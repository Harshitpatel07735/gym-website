import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const GYM_NAME = 'Yogi Fitness Studio'
const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? ''

const templates: Record<string, (d: Record<string, string>) => { subject: string; html: string }> = {
    free_trial: (d) => ({
        subject: `Free Trial Confirmed — ${GYM_NAME}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;">
      <h1 style="color:#ff2d2d;">YOGI.</h1>
      <h2>Hey ${d.name}, your free trial is confirmed! 🔥</h2>
      <p style="color:#888;">Walk in and show this email at the front desk.</p>
      <div style="margin:24px 0;padding:20px;background:#111;border-radius:8px;border-left:4px solid #ff2d2d;">
        <p style="margin:0;font-weight:700;">Our team will call you within 24 hours to schedule your first session.</p>
      </div>
      <p style="color:#444;font-size:12px;margin-top:32px;">© ${new Date().getFullYear()} ${GYM_NAME}</p>
    </div>`,
    }),
    contact: (d) => ({
        subject: `We received your message — ${GYM_NAME}`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;">
      <h1 style="color:#ff2d2d;">YOGI.</h1>
      <h2>Thanks ${d.name}, we got your message.</h2>
      <p style="color:#888;">Our team will reply within 24 hours.</p>
      <p style="color:#444;font-size:12px;margin-top:32px;">© ${new Date().getFullYear()} ${GYM_NAME}</p>
    </div>`,
    }),
    newsletter: (_d) => ({
        subject: `Welcome to the Yogi Fitness community 💪`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;">
      <h1 style="color:#ff2d2d;">YOGI.</h1>
      <h2>You're in. Welcome to the community.</h2>
      <p style="color:#888;">Training tips and member-only offers — straight to your inbox.</p>
      <p style="color:#444;font-size:12px;margin-top:32px;">© ${new Date().getFullYear()} ${GYM_NAME}</p>
    </div>`,
    }),
    membership: (d) => ({
        subject: `Membership Activated — ${d.plan} Plan 🏋️`,
        html: `<div style="font-family:sans-serif;max-width:600px;margin:auto;background:#0a0a0a;color:#fff;padding:40px;border-radius:12px;">
      <h1 style="color:#ff2d2d;">YOGI.</h1>
      <h2>Welcome, ${d.name}! Your ${d.plan} Plan is active.</h2>
      <div style="margin:24px 0;padding:20px;background:#111;border-radius:8px;">
        <p style="margin:0;color:#888;font-size:12px;text-transform:uppercase;">Valid until</p>
        <p style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ff2d2d;">${d.expiry}</p>
      </div>
      <p style="color:#444;font-size:12px;margin-top:32px;">© ${new Date().getFullYear()} ${GYM_NAME}</p>
    </div>`,
    }),
    admin_alert: (d) => ({
        subject: `[YOGI Admin] New ${d.type}: ${d.name}`,
        html: `<div style="font-family:sans-serif;padding:24px;">
      <h2 style="color:#ff2d2d;">New ${d.type}</h2>
      <p><strong>Name:</strong> ${d.name}</p>
      <p><strong>Email:</strong> ${d.email}</p>
      <p><strong>Phone:</strong> ${d.phone ?? 'N/A'}</p>
      <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN')}</p>
    </div>`,
    }),
}

serve(async (req) => {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

    const auth = req.headers.get('Authorization')
    if (auth !== `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    const { type, to, data } = await req.json()
    const template = templates[type]
    if (!template) return new Response('Unknown type', { status: 400 })

    const { subject, html } = template(data)
    const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error } = await supabase.auth.admin.sendRawEmail({ to, subject, html })

    if (!error && (type === 'free_trial' || type === 'contact') && ADMIN_EMAIL) {
        const alert = templates['admin_alert']({ ...data, type })
        await supabase.auth.admin.sendRawEmail({
            to: ADMIN_EMAIL, subject: alert.subject, html: alert.html
        }).catch(() => { })
    }

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify({ success: true }), { status: 200 })
})