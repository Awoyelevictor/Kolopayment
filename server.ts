import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  const PAYAZA_SECRET_KEY = process.env.PAYAZA_SECRET_KEY || "";
  // Payaza v2 (Pro) uses /v2/main/ endpoints
  const PAYAZA_BASE_URL = "https://api.payaza.africa/v2/main";

  // Helper for Authorization header
  const getAuthHeader = () => {
    if (!PAYAZA_SECRET_KEY) return "";
    // Payaza v2 (Pro) usually requires "Payaza " prefix or raw secret key.
    if (PAYAZA_SECRET_KEY.startsWith('Payaza ')) return PAYAZA_SECRET_KEY;
    return `Payaza ${PAYAZA_SECRET_KEY}`;
  };

  // API Routes
  app.post("/api/payaza/initialize-payment", async (req, res) => {
    try {
      if (!PAYAZA_SECRET_KEY) {
        throw new Error("PAYAZA_SECRET_KEY is not configured");
      }

      console.log("Initializing Payaza v2 Payment (Pro) for:", req.body.email);
      
      const origin = req.headers.referer || req.headers.origin || "https://kolo-ajo.com";
      const txnRef = req.body.transaction_reference || `KOLO-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      
      const payload = {
        service_payload: {
          action: "initialize_checkout_payment",
          amount: Number(req.body.amount),
          amount_to_pay: Number(req.body.amount),
          currency: req.body.currency || "NGN",
          email: req.body.email,
          first_name: req.body.first_name || "Kolo",
          last_name: req.body.last_name || "User",
          phone_number: req.body.phone_number || "08000000000",
          transaction_reference: txnRef,
          merch_txnref: txnRef,
          callback_url: `${origin}/payment-success`,
          description: "KoloPay Wallet Topup"
        }
      };

      const headers = {
        'Authorization': getAuthHeader(),
        'X-PAYAZA-API-KEY': PAYAZA_SECRET_KEY,
        'Content-Type': 'application/json'
      };

      let response;
      try {
        console.log("Attempting Payaza v2 Init at standard URL...");
        response = await axios.post(`${PAYAZA_BASE_URL}/checkout/initialize`, payload, { headers });
      } catch (err: any) {
        console.warn("Standard Payaza Init failed, trying Pro subdomain...", err.response?.data || err.message);
        // Retry with Pro subdomain if standard fails
        const proUrl = "https://api-pro.payaza.africa/v2/main";
        response = await axios.post(`${proUrl}/checkout/initialize`, payload, { headers });
      }

      // Flatten for frontend compatibility: V2 wraps in 'data', V1 doesn't.
      const result = response.data;
      const flattened = {
        ...result,
        ...(result.data || {}), // Spread V2 data fields to top level
        checkout_url: result.data?.checkout_url || result.checkout_url
      };
      res.json(flattened);
    } catch (error: any) {
      console.error("Payaza Initialize Error Detailed (v2):", error.response?.data || error.message);
      
      // Fallback for development/demo only if environment variable is missing
      if (process.env.NODE_ENV !== "production" && !process.env.PAYAZA_SECRET_KEY) {
        return res.json({
          status: "success",
          message: "Transaction Initialized (Mock Mode)",
          checkout_url: null,
          transaction_reference: "MOCK-" + Math.random().toString(36).substring(2, 10).toUpperCase()
        });
      }

      res.status(error.response?.status || 500).json(error.response?.data || { message: "Payment initialization failed", error: error.message });
    }
  });

  app.post("/api/payaza/verify-bvn", async (req, res) => {
    try {
      if (!PAYAZA_SECRET_KEY) throw new Error("PAYAZA_SECRET_KEY missing");
      const { bvn, firstName, lastName } = req.body;
      
      const payload = {
        service_payload: {
          action: "verify_bvn",
          bvn: bvn,
          first_name: firstName,
          last_name: lastName
        }
      };

      const response = await axios.post(`${PAYAZA_BASE_URL}/verification/bvn`, payload, {
        headers: {
          'Authorization': getAuthHeader(),
          'X-PAYAZA-API-KEY': PAYAZA_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      // Flatten V2 response for frontend
      const result = response.data;
      const flattened = {
        ...result,
        ...(result.data || {})
      };
      res.json(flattened);
    } catch (error: any) {
      console.error("Payaza BVN Error Detailed (v2):", error.response?.data || error.message);
      
      if (process.env.NODE_ENV !== "production" && !process.env.PAYAZA_SECRET_KEY) {
        return res.json({
          status: "success",
          message: "BVN Verified Successfully (Mock Mode)",
          data: { first_name: req.body.firstName, last_name: req.body.lastName, bvn: req.body.bvn }
        });
      }

      res.status(error.response?.status || 500).json(error.response?.data || { message: "BVN verification failed" });
    }
  });

  app.post("/api/payaza/create-virtual-account", async (req, res) => {
    try {
      if (!PAYAZA_SECRET_KEY) throw new Error("PAYAZA_SECRET_KEY missing");
      
      const payload = {
        service_payload: {
          action: "create_virtual_account",
          email: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          phone_number: req.body.phone_number || req.body.phone || "08000000000",
          phone: req.body.phone_number || req.body.phone || "08000000000"
        }
      };

      const response = await axios.post(`${PAYAZA_BASE_URL}/virtual-account/create`, payload, {
        headers: {
          'Authorization': getAuthHeader(),
          'X-PAYAZA-API-KEY': PAYAZA_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      });
      
      // Flatten V2 response for frontend
      const result = response.data;
      const flattened = {
        ...result,
        ...(result.data || {})
      };
      res.json(flattened);
    } catch (error: any) {
      console.error("Payaza Virtual Account Error Detailed (v2):", error.response?.data || error.message);
      
      if (process.env.NODE_ENV !== "production" && !process.env.PAYAZA_SECRET_KEY) {
        return res.json({
          status: "success",
          message: "Virtual Account Created (Mock Mode)",
          data: {
            account_number: "0123456789",
            account_name: `KOLO/USER`.toUpperCase(),
            bank_name: "Wema Bank (Mock)"
          }
        });
      }

      res.status(error.response?.status || 500).json(error.response?.data || { message: "Virtual account creation failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
