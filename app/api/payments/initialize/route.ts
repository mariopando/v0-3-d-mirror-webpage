// API Route: /api/payments/initialize
// This route handles payment initialization on the server side

import { NextRequest, NextResponse } from 'next/server'
import { initializePayment, PaymentInitializeRequest } from '@/lib/payment-service'

export async function POST(request: NextRequest) {
  try {
    const { provider, amount, currency, orderId, description, customerEmail, customerName, returnUrl } = await request.json()

    // Validate required fields
    if (!provider || !amount || !orderId || !customerEmail) {
      return NextResponse.json(
        { error: 'Missing required payment fields' },
        { status: 400 }
      )
    }

    // Check if test mode is enabled
    const testMode = process.env.PAYMENT_TEST_MODE === 'true'

    if (testMode && provider === 'transbank') {
      // Return mock Transbank response for testing
      console.log('⚠️  Running in TEST MODE - Returning mock Transbank payment')
      return NextResponse.json({
        transactionId: orderId,
        provider: 'transbank',
        token: `TEST_TOKEN_${orderId}`,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/carrito/confirmacion?token=TEST_TOKEN_${orderId}&status=approved`,
        message: 'Test payment - redirecting to confirmation page',
        sessionId: `TEST_SESSION_${Date.now()}`,
      })
    }

    const paymentData: PaymentInitializeRequest = {
      amount,
      currency: currency || 'CLP',
      orderId,
      description,
      customerEmail,
      customerName,
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/carrito/confirmacion`,
    }

    const result = await initializePayment(provider as 'transbank' | 'mercado_pago', paymentData)

    return NextResponse.json(result)
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment initialization failed' },
      { status: 500 }
    )
  }
}
