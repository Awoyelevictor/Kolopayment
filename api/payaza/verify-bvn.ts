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
    const { bvn, firstName, lastName } = req.body;
    
    const isTest = PAYAZA_SECRET_KEY.includes("TEST") || PAYAZA_SECRET_KEY.includes("test");
    
    const payload = {
      service_name: "Verification",
      service_method: "Verify BVN",
      service_payload: {
        action: "verify_bvn",
        bvn: bvn,
        first_name: firstName,
        last_name: lastName,
        connection_mode: isTest ? "test" : "live"
      }
    };

    const response = await axios.post('https://api.payaza.africa/live/identity/bvn', payload, {
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
    console.error("Payaza BVN Error:", error.response?.data || error.message);
    return res.status(error.response?.status || 500).json(
      error.response?.data || { message: "BVN verification failed", error: error.message }
    );
  }
}
