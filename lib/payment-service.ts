export interface PaymentInitializeRequest {
  amount: number
  currency: string
  orderId: string
  description: string
  customerEmail: string
  customerName: string
  returnUrl: string
}

export interface PaymentResponse {
  transactionId: string
  provider: 'transbank' | 'mercado_pago'
  redirectUrl: string
  token?: string
  message: string
}

export interface PaymentStatusResponse {
  transactionId: string
  status: 'pending' | 'authorized' | 'captured' | 'declined' | 'cancelled' | 'refunded' | 'error'
  amount: number
  provider: string
  createdAt: string
  updatedAt: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function initializePayment(
  provider: 'transbank' | 'mercado_pago',
  paymentData: PaymentInitializeRequest
): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
      },
      body: JSON.stringify({
        provider,
        ...paymentData
      })
    })

    if (!response.ok) {
      throw new Error(`Payment initialization failed: ${response.statusText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Payment initialization error:', error)
    throw error
  }
}

export async function confirmPayment(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago'
): Promise<PaymentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/payments/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
      },
      body: JSON.stringify({
        transactionId,
        provider
      })
    })

    if (!response.ok) {
      throw new Error(`Payment confirmation failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Payment confirmation error:', error)
    throw error
  }
}

export async function getPaymentStatus(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago'
): Promise<PaymentStatusResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/status/${transactionId}?provider=${provider}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Get payment status error:', error)
    throw error
  }
}

export async function refundPayment(transactionId: string): Promise<PaymentResponse> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/refund/${transactionId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Refund failed: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Refund error:', error)
    throw error
  }
}

export async function listPayments(
  limit?: number,
  status?: string
): Promise<PaymentStatusResponse[]> {
  try {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (status) params.append('status', status)

    const response = await fetch(
      `${API_BASE_URL}/api/v1/payments/list?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to list payments: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('List payments error:', error)
    throw error
  }
}