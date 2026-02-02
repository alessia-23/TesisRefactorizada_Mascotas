import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripeKey = process.env.STRIPE_API_KEY;

if (!stripeKey) {
    throw new Error("❌ STRIPE_SECRET_KEY no está definida");
}

const stripe = new Stripe(stripeKey);

export const createPaymentIntent = async (amount, currency = "usd") => {
    return await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: { enabled: true },
    });
};

export default stripe;
