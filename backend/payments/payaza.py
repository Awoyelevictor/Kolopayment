import requests
import uuid
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class PayazaService:
    def __init__(self):
        self.api_key = settings.PAYAZA_API_KEY
        self.merchant_id = settings.PAYAZA_MERCHANT_ID
        self.base_url = settings.PAYAZA_BASE_URL
        self.headers = {
            'Authorization': f'Payaza {self.api_key}',
            'Content-Type': 'application/json'
        }

    def initiate_payment(self, amount, email, first_name, last_name, phone_number, callback_url):
        """
        Initiates a payment request via Payaza.
        Reference: https://docs.payaza.africa
        """
        transaction_ref = f"KOLO-{uuid.uuid4().hex[:10].upper()}"
        
        payload = {
            "transaction_reference": transaction_ref,
            "amount": float(amount),
            "currency": "NGN",
            "description": "KoloPay Group Contribution",
            "callback_url": callback_url,
            "first_name": first_name,
            "last_name": last_name,
            "email_address": email,
            "phone_number": phone_number,
            "merchant_id": self.merchant_id
        }

        try:
            # Note: The actual endpoint might differ based on the integration method (Checkout vs Server-to-Server)
            # This is a generalized structure for server-side initiation.
            endpoint = f"{self.base_url}/checkout/initialize"
            
            # If using test keys, we might want to skip the actual network call or handle it gracefully
            if "test_key" in self.api_key:
                logger.info(f"Simulating Payaza payment initiation for {transaction_ref}")
                return {
                    "status": "success",
                    "checkout_url": f"https://checkout.payaza.africa/pay/{transaction_ref}",
                    "transaction_reference": transaction_ref
                }

            response = requests.post(endpoint, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Payaza payment initiation failed: {str(e)}")
            return None

    def verify_payment(self, transaction_ref):
        """
        Verifies a transaction status.
        """
        endpoint = f"{self.base_url}/transaction/verify/{transaction_ref}"
        
        try:
            if "test_key" in self.api_key:
                return {"status": "success", "message": "Transaction verified (Simulated)"}

            response = requests.get(endpoint, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Payaza verification failed: {str(e)}")
            return None

payaza_service = PayazaService()
