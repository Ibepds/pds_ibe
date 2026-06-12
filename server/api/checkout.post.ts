export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string }>(event)
  const email = body?.email?.trim()

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Adresse e-mail invalide.' })
  }

  const stripe = getStripe()
  const origin = getRequestURL(event).origin
  const priceId = await getDonationPriceId(stripe)

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer_email: email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/don/merci?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/donate`,
  })

  return { url: session.url }
})
