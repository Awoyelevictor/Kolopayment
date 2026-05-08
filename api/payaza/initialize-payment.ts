import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const PAYAZA_SECRET_KEY = process.env.PAYAZA_SECRET_KEY;
  if (!PAYAZA_SECRET_KEY) {
    return res.status(500).json({ message: 'PAYAZA_SECRET_KEY is not configured' });
  }

  try {
    const { amount, email, first_name, last_name, phone_number, currency } = req.body;
    
    const txnRef = `KOLO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const isTest = PAYAZA_SECRET_KEY.includes("TEST") || PAYAZA_SECRET_KEY.includes("test");
    
    // Payaza v2 (Pro) Service Payload structure
    const payload = {
      service_name: "Checkout",
      service_method: "Initialize Checkout Payment",
      service_payload: {
        action: "initialize_checkout_payment",
        amount: Number(amount),
        amount_to_pay: Number(amount),
        currency: currency || "NGN",
        email: email,
        first_name: first_name || "Kolo",
        last_name: last_name || "User",
        phone_number: phone_number || "08000000000",
        transaction_reference: txnRef,
        merch_txnref: txnRef,
        callback_url: `https://${req.headers.host}/payment-success`,
        description: "KoloPay Wallet Topup",
        connection_mode: isTest ? "test" : "live"
      }
    };

    const response = await axios.post('https://api.payaza.africa/live/transaction/initiate', payload, {
      headers: {
        'Authorization': `Payaza ${PAYAZA_SECRET_KEY.replace('Payaza ', '').trim()}`,
        'Content-Type': 'application/json'
      }
    });

    // Flatten for frontend compatibility as done in server.ts
    const result = response.data;
    const flattened = {
      ...result,
      ...(result.data || {}),
      checkout_url: result.data?.checkout_url || result.checkout_url
    };

    return res.status(200).json(flattened);
  } catch (error: any) {
    console.error("Payaza Initialize Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Payment initialization failed", error: error.message }
    );
  }
}
