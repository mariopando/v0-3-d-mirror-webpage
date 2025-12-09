// API Route: /api/payments/status/[id]
// This route retrieves payment status on the server side

import { NextRequest, NextResponse } from 'next/server'
import { getPaymentStatus } from '@/lib/payment-service'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { searchParams } = new URL(request.url)
    const provider = searchParams.get('provider')

    if (!id || !provider) {
      return NextResponse.json(
        { error: 'Missing transaction ID or provider' },
        { status: 400 }
      )
    }

    const result = await getPaymentStatus(id, provider as 'transbank' | 'mercado_pago')

    return NextResponse.json(result)
  } catch (error) {
    console.error('Get payment status error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve payment status' },
      { status: 500 }
    )
  }
}
