import { NextResponse } from 'next/server'
import { paypalClient } from '../../_lib/paypal'
import paypal from '@paypal/checkout-server-sdk'

export async function POST(req: Request) {
  const { amount } = await req.json()

  // Validation
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  // PayPal Order erstellen
  const request = new paypal.orders.OrdersCreateRequest()
  request.prefer('return=representation')
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount.toFixed(2)
        }
      }
    ]
  })

  try {
    const response = await paypalClient.execute(request)
    return NextResponse.json({
      orderId: response.result.id,
      links: response.result.links
    })
  } catch (err: any) {
    console.error('PayPal create order error:', err)
    return NextResponse.json({ error: 'PayPal order creation failed' }, { status: 500 })
  }
}
