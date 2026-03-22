const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN
const BASE_URL = 'https://graph.facebook.com/v18.0'

interface WAResult { success: boolean; error?: string }

async function send(to: string, message: string): Promise<WAResult> {
    if (!PHONE_NUMBER_ID || !ACCESS_TOKEN) {
        console.warn('WhatsApp not configured')
        return { success: false, error: 'Not configured' }
    }
    try {
        const res = await fetch(`${BASE_URL}/${PHONE_NUMBER_ID}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify({
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to,
                type: 'text',
                text: { body: message },
            }),
        })
        if (!res.ok) return { success: false, error: await res.text() }
        return { success: true }
    } catch (err: any) {
        return { success: false, error: err.message }
    }
}

export const sendWelcomeMessage = (to: string, name: string, plan: string) =>
    send(to, `Welcome to YOGI FITNESS, ${name}! 🏋️\n\nYour *${plan} Plan* is now active.\n\nSee you at the gym! 💪\n\n— Team Yogi`)

export const sendExpiryReminder = (to: string, name: string, plan: string, days: number) =>
    send(to, `Hey ${name} 👋\n\nYour *${plan} membership* expires in *${days} days*.\n\nRenew now to keep your streak going! 💪\n\n— Team Yogi`)

export const sendMembershipExpired = (to: string, name: string) =>
    send(to, `Hi ${name}, your membership has expired. 😔\n\nRejoin today and pick up right where you left off.\n\n— Team Yogi`)

export const sendAbsenceAlert = (to: string, name: string) =>
    send(to, `We miss you, ${name}! 😢\n\nIt's been a while. Come back strong! 💪\n\n— Team Yogi`)

export const sendAppointmentConfirmation = (to: string, name: string, trainer: string, date: string, time: string) =>
    send(to, `Hi ${name}! ✅\n\nSession confirmed:\n👤 Trainer: *${trainer}*\n📅 Date: *${date}*\n⏰ Time: *${time}*\n\n— Team Yogi`)

export const sendAppointmentReminder = (to: string, name: string, trainer: string, time: string) =>
    send(to, `Reminder, ${name}! ⏰\n\nYour session with *${trainer}* starts in 1 hour at *${time}*.\n\n— Team Yogi`)

export const sendMonthlyProgress = (to: string, name: string, month: string, checkins: number, streak: number, daysLeft: number) =>
    send(to, `Monthly Report — ${month} 📊\n\nHey ${name}:\n✅ Gym visits: *${checkins} days*\n🔥 Best streak: *${streak} days*\n📅 Membership: *${daysLeft} days remaining*\n\nKeep pushing! 💪\n\n— Team Yogi`)

export const sendBroadcast = (to: string, name: string, message: string) =>
    send(to, message.replace('{{name}}', name))

export { send as sendWhatsAppMessage }