import { NextRequest, NextResponse } from 'next/server'

export function verifyCronSecret(request: NextRequest): NextResponse | null {
    const secret = request.headers.get('x-cron-secret')
    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return null
}