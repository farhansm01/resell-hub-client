import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'

export async function POST(request) {
  try {
    const body = await request.json()
    const {
      productId, productTitle, price,
      buyerId, buyerName, buyerEmail,
      sellerId, sellerName, sellerEmail,
      deliveryInfo, // added — comes from checkout page form
    } = body

    if (!productId || !price || !buyerId || !sellerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const headersList = await headers()
    const origin = headersList.get('origin')

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name: productTitle },
            unit_amount: Math.round(price * 100), // cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`, // go back to checkout, not product page
      // metadata values MUST be strings - Stripe rejects non-string values
      metadata: {
        productId: String(productId),
        buyerId: String(buyerId),
        buyerName: buyerName || '',
        buyerEmail: buyerEmail || '',
        sellerId: String(sellerId),
        sellerName: sellerName || '',
        sellerEmail: sellerEmail || '',
        // delivery info from checkout form
        deliveryName: deliveryInfo?.name || '',
        deliveryPhone: deliveryInfo?.phone || '',
        deliveryAddress: deliveryInfo?.address || '',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout session error:', err)
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 })
  }
}