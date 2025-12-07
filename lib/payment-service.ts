// Direct Next.js Payment Service Integration
// Supports Transbank (Webpay Plus) and Mercado Pago payment processing
// 
// NOTE: This file should only be imported on the server-side
// For client-side payment operations, use lib/payment-client.ts

'use server'

// Browser-compatible UUID generator
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback for browsers that don't support randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

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
  sessionId?: string
  authorizationCode?: string
}

export interface PaymentStatusResponse {
  transactionId: string
  status: 'pending' | 'authorized' | 'captured' | 'declined' | 'cancelled' | 'refunded' | 'error'
  amount: number
  provider: string
  createdAt: string
  updatedAt: string
  authorizationCode?: string
  cardLastFour?: string
}

// ============================================================================
// TRANSBANK (WEBPAY PLUS) INTEGRATION
// ============================================================================

const TRANSBANK_CONFIG = {
  commerceCode: process.env.TRANSBANK_COMMERCE_CODE || '597055555532',
  apiKey: process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  environment: (process.env.TRANSBANK_ENVIRONMENT || 'test') as 'test' | 'production',
  getApiUrl: function() {
    return this.environment === 'production'
      ? 'https://webpay3g.transbank.cl'
      : 'https://webpay3gint.transbank.cl'
  }
}

interface TransbankInitResponse {
  token: string
  url: string
}

export async function transbankInitialize(
  paymentData: PaymentInitializeRequest
): Promise<PaymentResponse> {
  try {
    const baseUrl = TRANSBANK_CONFIG.getApiUrl()
    
    // Create the request payload according to Transbank API v1.2
    const requestData = {
      buy_order: paymentData.orderId,
      session_id: generateUUID(),
      amount: Math.round(paymentData.amount),
      return_url: paymentData.returnUrl
    }

    console.log('Transbank Request:', {
      url: `${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`,
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: requestData
    })

    const response = await fetch(`${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions`, {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData),
    })

    console.log('Transbank Response Status:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Transbank Error Response:', errorText)
      throw new Error(`Transbank initialization failed: ${response.statusText} - ${errorText}`)
    }

    const responseData = await response.json()
    console.log('Transbank Response Data:', responseData)

    // IMPORTANTE: Usar la URL exacta proporcionada por Transbank sin modificaciones
    return {
      transactionId: requestData.buy_order,
      provider: 'transbank',
      token: responseData.token,
      redirectUrl: responseData.url, // Usar exactamente la URL proporcionada por Transbank
      message: 'Transaction initialized successfully',
      sessionId: requestData.session_id,
    }
  } catch (error) {
    console.error('Transbank initialization error:', error)
    throw error
  }
}

export async function transbankConfirm(
  token: string
): Promise<PaymentResponse> {
  try {
    const baseUrl = TRANSBANK_CONFIG.getApiUrl()

    console.log('Transbank Confirm Request:', {
      url: `${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    })

    // According to the documentation, we need to use PUT method
    const response = await fetch(`${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Transbank Confirm Error Response:', errorText)
      throw new Error(`Transbank confirmation failed: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Transbank Confirm Response:', data)

    return {
      transactionId: data.buy_order,
      provider: 'transbank',
      redirectUrl: '',
      message: `Payment ${data.response_code === 0 ? 'authorized' : 'declined'}`,
      authorizationCode: data.authorization_code,
    }
  } catch (error) {
    console.error('Transbank confirmation error:', error)
    throw error
  }
}

export async function transbankGetStatus(
  token: string
): Promise<PaymentStatusResponse> {
  try {
    const baseUrl = TRANSBANK_CONFIG.getApiUrl()

    console.log('Transbank Get Status Request:', {
      url: `${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`,
      method: 'GET',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    })

    const response = await fetch(`${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}`, {
      method: 'GET',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Transbank Get Status Error Response:', errorText)
      throw new Error(`Failed to get transaction status: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Transbank Get Status Response:', data)

    // Map Transbank status to our standard status format
    let status: PaymentStatusResponse['status'] = 'pending';
    if (data.response_code === 0) {
      status = data.status === 'AUTHORIZED' ? 'authorized' : 'captured';
    } else {
      status = 'declined';
    }

    return {
      transactionId: data.buy_order,
      status: status,
      amount: data.amount,
      provider: 'transbank',
      createdAt: new Date().toISOString(), // Transbank doesn't return timestamps
      updatedAt: new Date().toISOString(),
      authorizationCode: data.authorization_code,
    }
  } catch (error) {
    console.error('Get Transbank status error:', error)
    throw error
  }
}

export async function transbankRefund(
  token: string,
  amount?: number
): Promise<PaymentResponse> {
  try {
    const baseUrl = TRANSBANK_CONFIG.getApiUrl()

    const requestData = amount ? { amount } : {};

    console.log('Transbank Refund Request:', {
      url: `${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}/refunds`,
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: requestData
    })

    const response = await fetch(`${baseUrl}/rswebpaytransaction/api/webpay/v1.2/transactions/${token}/refunds`, {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': TRANSBANK_CONFIG.commerceCode,
        'Tbk-Api-Key-Secret': TRANSBANK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Transbank Refund Error Response:', errorText)
      throw new Error(`Transbank refund failed: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    console.log('Transbank Refund Response:', data)

    return {
      transactionId: data.buy_order || token,
      provider: 'transbank',
      redirectUrl: '',
      message: 'Refund processed successfully',
      authorizationCode: data.authorization_code,
    }
  } catch (error) {
    console.error('Transbank refund error:', error)
    throw error
  }
}

// ============================================================================
// MERCADO PAGO INTEGRATION
// ============================================================================

const MERCADO_PAGO_CONFIG = {
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN || '',
  publicKey: process.env.MERCADO_PAGO_PUBLIC_KEY || '',
  apiUrl: 'https://api.mercadopago.com/v1',
  notificationUrl: process.env.MERCADO_PAGO_NOTIFICATION_URL || '',
}

interface MercadoPagoPreference {
  id: string
  init_point: string
  sandbox_init_point: string
}

export async function mercadoPagoInitialize(
  paymentData: PaymentInitializeRequest
): Promise<PaymentResponse> {
  try {
    if (!MERCADO_PAGO_CONFIG.accessToken) {
      throw new Error('Mercado Pago access token not configured')
    }

    const preferenceData = {
      items: [
        {
          title: paymentData.description,
          quantity: 1,
          unit_price: paymentData.amount,
          currency_id: paymentData.currency === 'CLP' ? 'CLP' : 'USD',
        },
      ],
      payer: {
        email: paymentData.customerEmail,
        name: paymentData.customerName,
      },
      back_urls: {
        success: paymentData.returnUrl,
        failure: `${paymentData.returnUrl}?status=failure`,
        pending: `${paymentData.returnUrl}?status=pending`,
      },
      auto_return: 'approved',
      notification_url: MERCADO_PAGO_CONFIG.notificationUrl,
      external_reference: paymentData.orderId,
    }

    const response = await fetch(`${MERCADO_PAGO_CONFIG.apiUrl}/checkout/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferenceData),
    })

    if (!response.ok) {
      throw new Error(`Mercado Pago initialization failed: ${response.statusText}`)
    }

    const data: MercadoPagoPreference = await response.json()

    return {
      transactionId: data.id,
      provider: 'mercado_pago',
      redirectUrl: data.init_point,
      message: 'Preference created successfully',
    }
  } catch (error) {
    console.error('Mercado Pago initialization error:', error)
    throw error
  }
}

export async function mercadoPagoGetPaymentStatus(
  paymentId: string
): Promise<PaymentStatusResponse> {
  try {
    if (!MERCADO_PAGO_CONFIG.accessToken) {
      throw new Error('Mercado Pago access token not configured')
    }

    const response = await fetch(
      `${MERCADO_PAGO_CONFIG.apiUrl}/payments/${paymentId}`,
      {
        headers: {
          'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Failed to get payment status: ${response.statusText}`)
    }

    const data = await response.json()

    const statusMap: { [key: string]: PaymentStatusResponse['status'] } = {
      'pending': 'pending',
      'approved': 'captured',
      'authorized': 'authorized',
      'in_process': 'pending',
      'in_mediation': 'pending',
      'rejected': 'declined',
      'cancelled': 'cancelled',
      'refunded': 'refunded',
      'charged_back': 'refunded',
    }

    return {
      transactionId: data.external_reference || data.id.toString(),
      status: statusMap[data.status] || 'pending',
      amount: data.transaction_amount,
      provider: 'mercado_pago',
      createdAt: data.date_created,
      updatedAt: data.date_last_updated,
      authorizationCode: data.authorization_code,
      cardLastFour: data.card?.last_four_digits,
    }
  } catch (error) {
    console.error('Get Mercado Pago payment status error:', error)
    throw error
  }
}

// ============================================================================
// UNIFIED PAYMENT SERVICE
// ============================================================================

export async function initializePayment(
  provider: 'transbank' | 'mercado_pago',
  paymentData: PaymentInitializeRequest
): Promise<PaymentResponse> {
  if (provider === 'transbank') {
    return transbankInitialize(paymentData)
  } else if (provider === 'mercado_pago') {
    return mercadoPagoInitialize(paymentData)
  } else {
    throw new Error(`Unsupported payment provider: ${provider}`)
  }
}

export async function confirmPayment(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago',
  token?: string
): Promise<PaymentResponse> {
  if (provider === 'transbank' && token) {
    return transbankConfirm(token)
  } else if (provider === 'mercado_pago') {
    const status = await mercadoPagoGetPaymentStatus(transactionId)
    return {
      transactionId,
      provider: 'mercado_pago',
      redirectUrl: '',
      message: `Payment status: ${status.status}`,
    }
  } else {
    throw new Error(`Unsupported payment provider: ${provider}`)
  }
}

export async function getPaymentStatus(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago',
  token?: string
): Promise<PaymentStatusResponse> {
  if (provider === 'mercado_pago') {
    return mercadoPagoGetPaymentStatus(transactionId)
  } else if (provider === 'transbank' && token) {
    return transbankGetStatus(token)
  } else {
    throw new Error(`Status retrieval not implemented for ${provider} or missing token`)
  }
}

export async function refundPayment(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago',
  token?: string,
  amount?: number
): Promise<PaymentResponse> {
  if (provider === 'mercado_pago') {
    try {
      if (!MERCADO_PAGO_CONFIG.accessToken) {
        throw new Error('Mercado Pago access token not configured')
      }

      const response = await fetch(
        `${MERCADO_PAGO_CONFIG.apiUrl}/payments/${transactionId}/refunds`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${MERCADO_PAGO_CONFIG.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Refund failed: ${response.statusText}`)
      }

      const data = await response.json()

      return {
        transactionId: data.id,
        provider: 'mercado_pago',
        redirectUrl: '',
        message: 'Refund processed successfully',
      }
    } catch (error) {
      console.error('Mercado Pago refund error:', error)
      throw error
    }
  } else if (provider === 'transbank' && token) {
    return transbankRefund(token, amount)
  } else {
    throw new Error(`Refund not implemented for ${provider} or missing token`)
  }
}