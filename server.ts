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
  // Payaza v2 (Pro) URLs
  const PAYAZA_V2_MAIN = "https://api.payaza.africa/v2/main";
  const PAYAZA_PRO_LIVE = "https://api-pro.payaza.africa/v2/main";
  
  // Decide primary based on key, fallback to other
  const getPayazaUrl = () => {
    // Both test and live Pro often use the same v2/main endpoint
    return PAYAZA_V2_MAIN;
  };

  const getPayazaFallbackUrl = () => {
    return PAYAZA_PRO_LIVE;
  };

  // Helper for Authorization header
  const getAuthHeader = (prefix = "Payaza ") => {
    if (!PAYAZA_SECRET_KEY) return "";
    let key = PAYAZA_SECRET_KEY;
    if (key.startsWith('Payaza ')) {
      key = key.replace('Payaza ', '').trim();
    }
    return prefix ? `${prefix}${key}` : key;
  };

  const getRawKey = () => {
    if (!PAYAZA_SECRET_KEY) return "";
    return PAYAZA_SECRET_KEY.replace('Payaza ', '').trim();
  };

  // Safe stringify to handle circular refs
  const safeStringify = (obj: any) => {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      return "[Circular or non-serializable object]";
    }
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
      
      const isTest = PAYAZA_SECRET_KEY.includes("TEST") || PAYAZA_SECRET_KEY.includes("test");
      
      const payload = {
        service_name: "Checkout",
        service_method: "Initialize Checkout Payment",
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
          description: "KoloPay Wallet Topup",
          connection_mode: isTest ? "test" : "live"
        }
      };

      const urls = [
        { url: getPayazaUrl(), version: 2 },
        { url: `${getPayazaUrl()}/checkout/initialize`, version: 2 },
        { url: `https://api.payaza.africa/v1/checkout/initialize`, version: 1 },
        { url: getPayazaFallbackUrl(), version: 2 }
      ];

      let response;
      let lastError: any;

      const authVariations = [
        { prefix: "Payaza ", header: "Authorization" },
        { prefix: "", header: "Authorization" },
        { prefix: "Bearer ", header: "Authorization" }
      ];

      for (const item of urls) {
        for (const authVar of authVariations) {
          try {
            console.log(`Trying Payaza Init (${item.version}) at: ${item.url} with ${authVar.prefix || 'no'} prefix`);
            
            let currentPayload = payload;
            if (item.version === 1) {
              currentPayload = {
                ...payload.service_payload,
                action: undefined
              } as any;
            }

            response = await axios.post(item.url, currentPayload, {
              headers: {
                [authVar.header]: getAuthHeader(authVar.prefix),
                'X-Payaza-Api-Key': getRawKey(),
                'X-PAYAZA-API-KEY': getRawKey(),
                'Content-Type': 'application/json'
              }
            });
            if (response.data && (response.data.status === 'success' || response.data.status === '00' || response.data.status_code === 200)) break;
          } catch (err: any) {
            lastError = err;
            const errorDisplay = err.response?.data ? (typeof err.response.data === 'string' && err.response.data.includes('<html>') ? 'HTML Error' : safeStringify(err.response.data)) : err.message;
            console.warn(`Init failed at ${item.url} (${authVar.prefix}):`, errorDisplay);
          }
        }
        if (response?.data) break;
      }

      if (!response) throw lastError || new Error("All Payaza endpoints failed");

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

      res.status(error.response?.status || 500).json(
        error.response?.data && typeof error.response.data === 'object' 
          ? JSON.parse(safeStringify(error.response.data)) 
          : { message: "Payment initialization failed", error: error.message }
      );
    }
  });

  app.post("/api/payaza/verify-bvn", async (req, res) => {
    try {
      if (!PAYAZA_SECRET_KEY) throw new Error("PAYAZA_SECRET_KEY missing");
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

      const urls = [
        { url: getPayazaUrl(), version: 2 },
        { url: `https://api.payaza.africa/v1/verify-bvn`, version: 1 },
        { url: getPayazaFallbackUrl(), version: 2 }
      ];

      let response;
      let lastError: any;

      const authVariations = [
        { prefix: "Payaza ", header: "Authorization" },
        { prefix: "", header: "Authorization" },
        { prefix: "Bearer ", header: "Authorization" }
      ];

      for (const item of urls) {
        for (const authVar of authVariations) {
          try {
            console.log(`Trying Payaza BVN (${item.version}) at: ${item.url} with ${authVar.prefix || 'no'} prefix`);
            let currentPayload = payload;
            if (item.version === 1) {
              currentPayload = {
                ...payload.service_payload,
                action: undefined
              } as any;
            }

            response = await axios.post(item.url, currentPayload, {
              headers: {
                [authVar.header]: getAuthHeader(authVar.prefix),
                'X-Payaza-Api-Key': getRawKey(),
                'X-PAYAZA-API-KEY': getRawKey(),
                'Content-Type': 'application/json'
              }
            });
            if (response.data && (response.data.status === 'success' || response.data.status === '00' || response.data.status_code === 200)) break;
          } catch (err: any) {
            lastError = err;
            const errorDisplay = err.response?.data ? (typeof err.response.data === 'string' && err.response.data.includes('<html>') ? 'HTML Error' : safeStringify(err.response.data)) : err.message;
            console.warn(`BVN failed at ${item.url} (${authVar.prefix}):`, errorDisplay);
          }
        }
        if (response?.data) break;
      }

      if (!response) throw lastError || new Error("All BVN endpoints failed");
      
      // Flatten V2 response for frontend
      const result = response.data;
      const flattened = {
        ...result,
        ...(result.data || {})
      };
      res.json(flattened);
    } catch (error: any) {
      const errorData = error.response?.data;
      console.error("Payaza BVN Error Detailed (v2):", typeof errorData === 'string' && errorData.includes('<html>') ? 'HTML Response (404/403)' : errorData || error.message);
      
      if (process.env.NODE_ENV !== "production" && !process.env.PAYAZA_SECRET_KEY) {
        return res.json({
          status: "success",
          message: "BVN Verified Successfully (Mock Mode)",
          data: { first_name: req.body.firstName, last_name: req.body.lastName, bvn: req.body.bvn }
        });
      }

      res.status(error.response?.status || 500).json(
        error.response?.data && typeof error.response.data === 'object' 
          ? JSON.parse(safeStringify(error.response.data)) 
          : { message: "BVN verification failed", error: error.message }
      );
    }
  });

  app.post("/api/payaza/create-virtual-account", async (req, res) => {
    try {
      if (!PAYAZA_SECRET_KEY) throw new Error("PAYAZA_SECRET_KEY missing");
      
      const isTest = PAYAZA_SECRET_KEY.includes("TEST") || PAYAZA_SECRET_KEY.includes("test");
      const txnRef = `VA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const payload = {
        service_name: "Virtual Account",
        service_method: "Create Virtual Account",
        service_payload: {
          action: "create_virtual_account",
          transaction_reference: txnRef,
          merch_txnref: txnRef,
          email: req.body.email,
          email_address: req.body.email,
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          phone_number: req.body.phone_number || req.body.phone || "08000000000",
          phone: req.body.phone_number || req.body.phone || "08000000000",
          connection_mode: isTest ? "test" : "live"
        }
      };

      const headers = {
        'Authorization': getAuthHeader(),
        'X-PAYAZA-API-KEY': PAYAZA_SECRET_KEY,
        'Content-Type': 'application/json'
      };

      const urls = [
        { url: getPayazaUrl(), version: 2 },
        { url: `${getPayazaUrl()}/virtual-account/create`, version: 2 },
        { url: `https://api.payaza.africa/v1/virtual-account/create`, version: 1 },
        { url: getPayazaFallbackUrl(), version: 2 }
      ];

      let response;
      let lastError: any;

      const authVariations = [
        { prefix: "Payaza ", header: "Authorization" },
        { prefix: "", header: "Authorization" },
        { prefix: "Bearer ", header: "Authorization" }
      ];

      const makeRequest = async (url: string, prefix: string, header: string, version: number) => {
        let currentPayload = payload;
        if (version === 1) {
          currentPayload = {
            ...payload.service_payload,
            action: undefined
          } as any;
        }

        return axios.post(url, currentPayload, {
          headers: {
            [header]: getAuthHeader(prefix),
            'X-Payaza-Api-Key': getRawKey(),
            'X-PAYAZA-API-KEY': getRawKey(),
            'Content-Type': 'application/json'
          }
        });
      };

      for (const item of urls) {
        for (const authVar of authVariations) {
          try {
            console.log(`Trying VA Creation (${item.version}) at: ${item.url} with ${authVar.prefix || 'no'} prefix`);
            response = await makeRequest(item.url, authVar.prefix, authVar.header, item.version);
            if (response.data && (response.data.status === 'success' || response.data.status === '00' || response.data.status_code === 200)) break;
          } catch (err: any) {
            lastError = err;
            const errorDisplay = err.response?.data ? (typeof err.response.data === 'string' && err.response.data.includes('<html>') ? 'HTML Error' : safeStringify(err.response.data)) : err.message;
            console.warn(`VA setup failed at ${item.url} (${authVar.prefix}):`, errorDisplay);
          }
        }
        if (response?.data) break;
      }

      if (!response) throw lastError || new Error("All Payaza VA endpoints failed");
      
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

      res.status(error.response?.status || 500).json(
        error.response?.data && typeof error.response.data === 'object' 
          ? JSON.parse(safeStringify(error.response.data)) 
          : { message: "Virtual account creation failed", error: error.message }
      );
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
