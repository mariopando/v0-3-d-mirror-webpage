// API Route: /api/payments/confirm
// This route confirms payment status on the server side

import { NextRequest, NextResponse } from 'next/server'
import { confirmPayment } from '@/lib/payment-service'

export async function POST(request: NextRequest) {
  try {
    const { transactionId, provider, token } = await request.json()

    if (!transactionId || !provider) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      )
    }

    const result = await confirmPayment(
      transactionId,
      provider as 'transbank' | 'mercado_pago',
      token
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment confirmation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment confirmation failed' },
      { status: 500 }
    )
  }
}
