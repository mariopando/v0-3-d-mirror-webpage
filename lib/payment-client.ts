// Client-side payment service wrapper
// This calls the backend API routes instead of directly accessing payment providers
// 
// This file should only be imported on the client-side

'use client'

import { PaymentInitializeRequest, PaymentResponse, PaymentStatusResponse } from './payment-service'

export async function clientInitializePayment(
  provider: 'transbank' | 'mercado_pago',
  paymentData: PaymentInitializeRequest
): Promise<PaymentResponse> {
  const response = await fetch('/api/payments/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
      ...paymentData,
    }),
  })

  if (!response.ok) {
    throw new Error(`Payment initialization failed: ${response.statusText}`)
  }

  return response.json()
}

export async function clientConfirmPayment(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago',
  token?: string
): Promise<PaymentResponse> {
  const response = await fetch('/api/payments/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionId,
      provider,
      token,
    }),
  })

  if (!response.ok) {
    throw new Error(`Payment confirmation failed: ${response.statusText}`)
  }

  return response.json()
}

export async function clientGetPaymentStatus(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago'
): Promise<PaymentStatusResponse> {
  const response = await fetch(
    `/api/payments/status/${transactionId}?provider=${provider}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to get payment status: ${response.statusText}`)
  }

  return response.json()
}

export async function clientRefundPayment(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago'
): Promise<PaymentResponse> {
  const response = await fetch('/api/payments/refund', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      transactionId,
      provider,
    }),
  })

  if (!response.ok) {
    throw new Error(`Refund failed: ${response.statusText}`)
  }

  return response.json()
}


