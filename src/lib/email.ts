export async function sendEmail(
    type: string,
    to: string,
    data: Record<string, string>
): Promise<void> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn('Email not configured')
        return
    }
    try {
        await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-email`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
                },
                body: JSON.stringify({ type, to, data }),
            }
        )
    } catch {
        console.error(`Email failed: type=${type} to=${to}`)
    }
}