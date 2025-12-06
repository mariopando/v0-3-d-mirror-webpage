// API Route: /api/payments/test-transbank
// This route is for testing Transbank connectivity

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const commerceCode = process.env.TRANSBANK_COMMERCE_CODE || '597055555532'
    const apiKey = process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9170D10D8E3CAC2638144F42'
    const environment = process.env.TRANSBANK_ENVIRONMENT || 'test'
    
    const baseUrl = environment === 'production'
      ? 'https://webpay3g.transbank.cl/webpayserver'
      : 'https://webpay3gint.transbank.cl/webpayserver'

    // Test the connection to Transbank endpoint
    const testResponse = await fetch(`${baseUrl}/webpayserver/initTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        commerce_code: commerceCode,
        buy_order: 'TEST-001',
        session_id: 'TEST-SESSION-001',
        amount: '1000',
        return_url: 'http://localhost:3000/test',
        commerce_code_sign: commerceCode,
        signature: 'test-signature',
      }).toString(),
    })

    const responseText = await testResponse.text()

    return NextResponse.json({
      status: testResponse.status,
      statusText: testResponse.statusText,
      baseUrl: baseUrl,
      environment: environment,
      commerceCode: commerceCode,
      response: responseText,
      headers: {
        'content-type': testResponse.headers.get('content-type'),
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Test failed',
      stack: error instanceof Error ? error.stack : '',
    }, { status: 500 })
  }
}
