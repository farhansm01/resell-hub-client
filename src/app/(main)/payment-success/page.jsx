import { redirect } from 'next/navigation'
import Link from 'next/link'
import { stripe } from '@/lib/stripe'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000'
const INTERNAL_SECRET = process.env.INTERNAL_API_SECRET

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id } = await searchParams
  if (!session_id) redirect('/products')

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  if (session.status !== 'complete') redirect('/products')

  const {
    productId, productTitle,
    buyerId, buyerName, buyerEmail,
    sellerId, sellerName, sellerEmail,
    deliveryName, deliveryPhone, deliveryAddress,
  } = session.metadata

  const amount = session.amount_total / 100
  const transactionId = session.payment_intent?.id || session.id

  const orderRes = await fetch(`${BASE_URL}/api/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Internal ${INTERNAL_SECRET}`,
    },
    body: JSON.stringify({
      productId, productTitle,
      buyerId, buyerName, buyerEmail,
      sellerId, sellerName, sellerEmail,
      amount,
      stripeSessionId: session.id,
      deliveryInfo: {
        name: deliveryName || '',
        phone: deliveryPhone || '',
        address: deliveryAddress || '',
      },
    }),
  })
  const order = await orderRes.json()

  await fetch(`${BASE_URL}/api/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Internal ${INTERNAL_SECRET}`,
    },
    body: JSON.stringify({
      orderId: order._id,
      transactionId,
      buyerId,
      amount,
      paymentDate: new Date(),
    }),
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center" style={{ backgroundColor: "#ffffff" }}>
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#18020c' }}>
        Payment Successful!
      </h1>
      <p className="text-sm mb-6" style={{ color: '#7a6c5d' }}>
        A confirmation has been sent to {buyerEmail}.
      </p>

      <div className="rounded-xl border p-5 text-left mb-8" style={{ borderColor: 'rgba(122, 108, 93, 0.25)', backgroundColor: "#ffffff" }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: '#7a6c5d' }}>Amount Paid</span>
          <span className="font-semibold" style={{ color: '#18020c' }}>৳{amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: '#7a6c5d' }}>Transaction ID</span>
          <span className="font-mono text-xs" style={{ color: '#18020c' }}>{transactionId}</span>
        </div>
        {deliveryName && (
          <div className="border-t pt-3 mt-3 space-y-2" style={{ borderColor: 'rgba(122, 108, 93, 0.2)' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#7a6c5d' }}>
              Delivery Information
            </p>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#7a6c5d' }}>Name</span>
              <span style={{ color: '#18020c' }}>{deliveryName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#7a6c5d' }}>Phone</span>
              <span style={{ color: '#18020c' }}>{deliveryPhone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#7a6c5d' }}>Address</span>
              <span style={{ color: '#18020c' }}>{deliveryAddress}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/dashboard/buyer/my-orders" className="px-5 py-2.5 rounded-xl text-sm font-bold" style={{ backgroundColor: '#f1b055', color: '#18020c' }}>
          View My Orders
        </Link>
        <Link href="/products" className="px-5 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: 'rgba(122, 108, 93, 0.3)', color: '#18020c' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}