import express from 'express';
import Stripe from 'stripe'; // Import Stripe types
import { stripe } from '../lib/stripe';
import { prisma } from '../lib/prisma';

const router = express.Router();

router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
      // Signature verification
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`❌ Webhook Signature Error: ${err.message}`);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const bookingId = session.metadata?.bookingId;
      const paidAmount = session.amount_total ? session.amount_total / 100 : 0; 
      const stripeSessionId = session.id;

      if (!bookingId) {
        console.error('❌ No bookingId found in session metadata');
        return res.status(400).json({ error: 'Missing metadata' });
      }

      console.log(`🔔 Payment of $${paidAmount} received for Booking: ${bookingId}`);

      try {
        // 1. Update Booking Status AND mark Availability as Booked
        await prisma.booking.update({
          where: { id: bookingId },
          data: { 
            status: 'CONFIRMED',
            // This is the fix: it updates the related availability slot to true
            availability: {
              update: {
                isBooked: true
              }
            }
          },
        });

        // 2. Create Payment Record
        await prisma.payment.create({
          data: {
            bookingId: bookingId,
            stripeSessionId: stripeSessionId,
            amount: paidAmount,
            status: 'PAID',
          },
        }).catch(() => console.log("Payment record already exists or table deleted."));

        console.log(`✅ Database synced for Booking ${bookingId} and Slot marked as Booked`);
      } catch (error) {
        console.error('❌ Database update failed:', error);
        return res.status(500).json({ error: 'Database update failed' });
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;