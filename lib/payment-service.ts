// Direct Next.js Payment Service Integration
// Supports Transbank (Webpay Plus) and Mercado Pago payment processing

import crypto from 'crypto'

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
  apiKey: process.env.TRANSBANK_API_KEY || '579B532A7440BB0C9170D10D8E3CAC2638144F42',
  environment: (process.env.TRANSBANK_ENVIRONMENT || 'test') as 'test' | 'production',
  getApiUrl: function() {
    return this.environment === 'production'
      ? 'https://webpay3g.transbank.cl/webpayserver'
      : 'https://webpay3gint.transbank.cl/webpayserver'
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
    
    // Create the request signature
    const requestData = {
      buy_order: paymentData.orderId,
      session_id: crypto.randomUUID(),
      amount: Math.round(paymentData.amount),
      return_url: paymentData.returnUrl,
      commerce_code: TRANSBANK_CONFIG.commerceCode
    }

    // Build the request string for signing
    const requestString = `${requestData.buy_order}${requestData.session_id}${requestData.amount}${requestData.return_url}`
    const signature = crypto
      .createHmac('sha256', TRANSBANK_CONFIG.apiKey)
      .update(requestString)
      .digest('hex')

    const response = await fetch(`${baseUrl}/wsInitTransaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        commerce_code: TRANSBANK_CONFIG.commerceCode,
        buy_order: requestData.buy_order,
        session_id: requestData.session_id,
        amount: requestData.amount.toString(),
        return_url: requestData.return_url,
        commerce_code_sign: TRANSBANK_CONFIG.commerceCode,
        signature: signature,
      }).toString(),
    })

    if (!response.ok) {
      throw new Error(`Transbank initialization failed: ${response.statusText}`)
    }

    const responseData: TransbankInitResponse = await response.json()

    return {
      transactionId: requestData.buy_order,
      provider: 'transbank',
      token: responseData.token,
      redirectUrl: `${baseUrl}/webpay/initTransaction?token_ws=${responseData.token}`,
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

    const response = await fetch(`${baseUrl}/wsAcknowledge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        commerce_code: TRANSBANK_CONFIG.commerceCode,
        token_ws: token,
      }).toString(),
    })

    if (!response.ok) {
      throw new Error(`Transbank confirmation failed: ${response.statusText}`)
    }

    const data = await response.json()

    return {
      transactionId: data.buy_order,
      provider: 'transbank',
      redirectUrl: data.urlRedirection || '',
      message: `Payment ${data.response_code === 0 ? 'authorized' : 'declined'}`,
      authorizationCode: data.authorization_code,
    }
  } catch (error) {
    console.error('Transbank confirmation error:', error)
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
  provider: 'transbank' | 'mercado_pago'
): Promise<PaymentStatusResponse> {
  if (provider === 'mercado_pago') {
    return mercadoPagoGetPaymentStatus(transactionId)
  } else {
    throw new Error(`Status retrieval not yet implemented for ${provider}`)
  }
}

export async function refundPayment(
  transactionId: string,
  provider: 'transbank' | 'mercado_pago'
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
  } else {
    throw new Error(`Refund not yet implemented for ${provider}`)
  }
}