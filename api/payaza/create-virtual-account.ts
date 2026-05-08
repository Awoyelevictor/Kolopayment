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
    const { email, first_name, last_name, phone_number } = req.body;
    
    const txnRef = `VA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const isTest = PAYAZA_SECRET_KEY.includes("TEST") || PAYAZA_SECRET_KEY.includes("test");
    
    const payload = {
      service_name: "Virtual Account",
      service_method: "Create Virtual Account",
      service_payload: {
        action: "create_virtual_account",
        transaction_reference: txnRef,
        merch_txnref: txnRef,
        email: email,
        email_address: email,
        first_name: first_name,
        last_name: last_name,
        phone_number: phone_number || "08000000000",
        phone: phone_number || "08000000000",
        connection_mode: isTest ? "test" : "live"
      }
    };

    const response = await axios.post('https://api.payaza.africa/live/virtual-account/create', payload, {
      headers: {
        'Authorization': `Payaza ${PAYAZA_SECRET_KEY.replace('Payaza ', '').trim()}`,
        'Content-Type': 'application/json'
      }
    });

    const result = response.data;
    const flattened = {
      ...result,
      ...(result.data || {})
    };

    return res.status(200).json(flattened);
  } catch (error: any) {
    console.error("Payaza VA Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(
      error.response?.data || { message: "Virtual account creation failed", error: error.message }
    );
  }
}
