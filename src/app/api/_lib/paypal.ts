import paypal from '@paypal/checkout-server-sdk'

const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,   // aus deiner Sandbox
  process.env.PAYPAL_SECRET!       // aus deiner Sandbox
)

export const paypalClient = new paypal.core.PayPalHttpClient(environment)
