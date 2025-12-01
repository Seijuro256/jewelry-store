import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
})

export async function POST(req: NextRequest) {
    try {
        const { items } = await req.json()

        // Validate items exist
        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            )
        }

        // Create line items for Stripe
        const lineItems = items.map((item: any) => ({
            price_data: {
                currency: 'aud',
                product_data: {
                    name: item.product.name,
                    images: item.product.images.filter((img: string) => img && img !== ''),
                },
                unit_amount: Math.round(item.product.price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }))

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
            shipping_address_collection: {
                allowed_countries: ['AU', 'US', 'GB', 'CA', 'NZ'],
            },
        })

        return NextResponse.json({ url: session.url })

    } catch (error) {
        console.error('Stripe checkout error:', error)
        return NextResponse.json(
            { error: 'Failed to create a checkout session' },
            { status: 500 }
        )
    }
}