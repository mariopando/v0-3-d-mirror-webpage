// API Route: /api/payments/refund
// This route processes refunds on the server side

import { NextRequest, NextResponse } from 'next/server'
import { refundPayment } from '@/lib/payment-service'

export async function POST(request: NextRequest) {
  try {
    const { transactionId, provider } = await request.json()

    if (!transactionId || !provider) {
      return NextResponse.json(
        { error: 'Missing transaction ID or provider' },
        { status: 400 }
      )
    }

    const result = await refundPayment(
      transactionId,
      provider as 'transbank' | 'mercado_pago'
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment refund error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Refund failed' },
      { status: 500 }
    )
  }
}
