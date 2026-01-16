import { NextResponse } from 'next/server'
import { paypalClient } from '../../_lib/paypal'
import paypal from '@paypal/checkout-server-sdk'
import pool from '@/app/db/client' // dein vorhandenes client.ts

export async function POST(req: Request) {
  const { orderId } = await req.json()

  if (!orderId) {
    return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
  }

  const TEST_USER_ID = 1   // Demo-User aus init.sql
  const TEST_AMOUNT = 10   // fester Betrag für Test

  const request = new paypal.orders.OrdersCaptureRequest(orderId)
  request.requestBody({})

  try {
    const response = await paypalClient.execute(request)

    if (response.result.status === 'COMPLETED') {
      // Balance des Test-Users erhöhen
      await pool.query(
        'UPDATE users SET balance = balance + $1 WHERE id = $2',
        [TEST_AMOUNT, TEST_USER_ID]
      )
    }

    return NextResponse.json({
      paypal: response.result,
      userId: TEST_USER_ID,
      amountAdded: TEST_AMOUNT,
    })
  } catch (err: any) {
    console.error('PayPal capture error:', err)
    return NextResponse.json({ error: 'Capture failed' }, { status: 500 })
  }
}
