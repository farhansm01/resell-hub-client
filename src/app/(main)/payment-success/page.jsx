import { redirect } from 'next/navigation'
import Link from 'next/link'
import { stripe } from '@/lib/stripe'
import { createOrder } from '@/lib/actions/orders'
import { createPayment } from '@/lib/actions/payments'

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id } = await searchParams
  if (!session_id) redirect('/products')

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent'],
  })

  if (session.status !== 'complete') redirect('/products')

  const {
    productId, buyerId, buyerName, buyerEmail,
    sellerId, sellerName, sellerEmail,
    // delivery info added in Step 4
    deliveryName, deliveryPhone, deliveryAddress,
  } = session.metadata

  const amount = session.amount_total / 100
  const transactionId = session.payment_intent?.id || session.id

  // create order — server dedupes on stripeSessionId
  const order = await createOrder({
    productId, buyerId, buyerName, buyerEmail,
    sellerId, sellerName, sellerEmail,
    amount,
    stripeSessionId: session.id,
    // pass delivery info to Express
    deliveryInfo: {
      name: deliveryName || '',
      phone: deliveryPhone || '',
      address: deliveryAddress || '',
    },
  })

  // create payment record — server dedupes on transactionId
  await createPayment({
    orderId: order._id,
    transactionId,
    buyerId,
    amount,
    paymentDate: new Date(),
  })

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold mb-2" style={{ color: '#1C1917' }}>
        Payment Successful!
      </h1>
      <p className="text-sm mb-6" style={{ color: '#78716C' }}>
        A confirmation has been sent to {buyerEmail}.
      </p>

      <div className="rounded-xl border p-5 text-left mb-8" style={{ borderColor: '#E7E5E4' }}>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: '#78716C' }}>Amount Paid</span>
          <span className="font-semibold" style={{ color: '#1C1917' }}>${amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: '#78716C' }}>Transaction ID</span>
          <span className="font-mono text-xs" style={{ color: '#1C1917' }}>{transactionId}</span>
        </div>
        {/* show delivery info if available */}
        {deliveryName && (
          <div className="border-t pt-3 mt-3 space-y-2" style={{ borderColor: '#E7E5E4' }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: '#78716C' }}>
              Delivery Information
            </p>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#78716C' }}>Name</span>
              <span style={{ color: '#1C1917' }}>{deliveryName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#78716C' }}>Phone</span>
              <span style={{ color: '#1C1917' }}>{deliveryPhone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: '#78716C' }}>Address</span>
              <span style={{ color: '#1C1917' }}>{deliveryAddress}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-center">
        <Link href="/dashboard/buyer/my-orders" className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: '#F97316' }}>
          View My Orders
        </Link>
        <Link href="/products" className="px-5 py-2.5 rounded-xl text-sm font-semibold border" style={{ borderColor: '#E7E5E4', color: '#1C1913' }}>
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}