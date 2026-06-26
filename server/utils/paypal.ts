interface PayPalAccessToken {
  access_token: string
  expires_in: number
}

interface PayPalLink {
  href: string
  rel: string
  method: string
}

export interface PayPalOrder {
  id: string
  status: string
  purchase_units?: Array<{
    amount?: { value: string; currency_code: string }
    custom_id?: string
    payments?: {
      captures?: Array<{ amount: { value: string }; status: string }>
    }
  }>
  payer?: { email_address?: string }
}

let cachedToken: { token: string; expiresAt: number } | null = null

function getPayPalApiBase(): string {
  const config = useRuntimeConfig()
  if (config.paypalApiBase) return config.paypalApiBase
  return config.paypalMode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'
}

function getPayPalCredentials(): { clientId: string; clientSecret: string } {
  const config = useRuntimeConfig()
  const clientId = String(config.paypalClientId || '').trim()
  const clientSecret = String(config.paypalClientSecret || '').trim()
  if (!clientId || !clientSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'PayPal non configuré (NUXT_PAYPAL_CLIENT_ID / NUXT_PAYPAL_CLIENT_SECRET manquants)',
    })
  }
  return { clientId, clientSecret }
}

function paypalAuthErrorMessage(mode: string): string {
  const env = mode === 'live' ? 'live (production)' : 'sandbox (test)'
  return `Authentification PayPal refusée (${env}). Vérifiez que NUXT_PAYPAL_CLIENT_ID et NUXT_PAYPAL_CLIENT_SECRET correspondent au même environnement (NUXT_PAYPAL_MODE=${mode}) dans le dashboard developer.paypal.com.`
}

async function getPayPalAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }
  const { clientId, clientSecret } = getPayPalCredentials()
  const config = useRuntimeConfig()
  const apiBase = getPayPalApiBase()
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  try {
    const data = await $fetch<PayPalAccessToken>(`${apiBase}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    })
    cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    }
    return data.access_token
  } catch (e: unknown) {
    const status = (e as { statusCode?: number })?.statusCode
    if (status === 401 || status === 403) {
      cachedToken = null
      throw createError({
        statusCode: 502,
        statusMessage: paypalAuthErrorMessage(String(config.paypalMode || 'sandbox')),
      })
    }
    throw e
  }
}

async function paypalApi<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = await getPayPalAccessToken()
  return $fetch<T>(`${getPayPalApiBase()}${path}`, {
    method: options.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: options.body,
  })
}

export async function createPayPalOrder(params: {
  totalEuros: string
  donationCents: number
  feeCents: number
  email: string
  returnUrl: string
  cancelUrl: string
}): Promise<{ orderId: string; approvalUrl: string }> {
  const customId = JSON.stringify({
    donationCents: params.donationCents,
    feeCents: params.feeCents,
    email: params.email,
  })
  const order = await paypalApi<PayPalOrder & { links: PayPalLink[] }>('/v2/checkout/orders', {
    method: 'POST',
    body: {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: params.totalEuros,
          },
          description: 'Don — PDS Humanity',
          custom_id: customId.slice(0, 127),
        },
      ],
      payer: { email_address: params.email },
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        brand_name: 'PDS Humanity',
        user_action: 'PAY_NOW',
        shipping_preference: 'NO_SHIPPING',
      },
    },
  })
  const approve = order.links?.find((l) => l.rel === 'approve')
  if (!approve?.href) {
    throw createError({ statusCode: 502, statusMessage: 'PayPal : lien de paiement indisponible' })
  }
  return { orderId: order.id, approvalUrl: approve.href }
}

export async function getPayPalOrder(orderId: string): Promise<PayPalOrder> {
  return paypalApi<PayPalOrder>(`/v2/checkout/orders/${orderId}`)
}

export async function capturePayPalOrder(orderId: string): Promise<PayPalOrder> {
  return paypalApi<PayPalOrder>(`/v2/checkout/orders/${orderId}/capture`, { method: 'POST' })
}

export function parsePayPalCustomId(customId?: string): {
  donationCents?: number
  feeCents?: number
  email?: string
} {
  if (!customId) return {}
  try {
    return JSON.parse(customId) as { donationCents?: number; feeCents?: number; email?: string }
  } catch {
    return {}
  }
}

export function isPayPalOrderPaid(order: PayPalOrder): boolean {
  return order.status === 'COMPLETED' || order.status === 'APPROVED'
}
