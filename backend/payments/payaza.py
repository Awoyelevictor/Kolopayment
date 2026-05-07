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
        Initiates a payment request via Payaza Checkout.
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
            endpoint = f"{self.base_url}/checkout/initialize"
            
            if "test_key" in self.api_key or "test_api_key" in self.api_key:
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

    def create_reserved_account(self, user):
        """
        Creates a dynamic virtual account for the user.
        API: POST /virtual-account/create
        """
        payload = {
            "application_id": self.merchant_id,
            "customer_first_name": user.first_name or user.username,
            "customer_last_name": user.last_name or "KoloUser",
            "customer_email": user.email or f"{user.username}@kolopay.africa",
            "customer_phone": user.phone_number,
            "account_name": f"KoloPay - {user.first_name} {user.last_name}".strip()
        }

        try:
            endpoint = f"{self.base_url}/virtual-account/create"
            
            if "test_key" in self.api_key or "test_api_key" in self.api_key:
                logger.info(f"Simulating Payaza virtual account creation for {user.username}")
                return {
                    "status": "success",
                    "account_number": "0123456789",
                    "bank_name": "Wema Bank",
                    "account_name": payload["account_name"]
                }

            response = requests.post(endpoint, json=payload, headers=self.headers)
            response.raise_for_status()
            data = response.json()
            
            # Payaza response usually contains account details in a specific nested object
            # For this integration, we extract the key fields
            return {
                "status": "success",
                "account_number": data.get('account_number'),
                "bank_name": data.get('bank_name'),
                "account_name": data.get('account_name')
            }
        except Exception as e:
            logger.error(f"Payaza virtual account creation failed: {str(e)}")
            return None

    def verify_payment(self, transaction_ref):
        endpoint = f"{self.base_url}/transaction/verify/{transaction_ref}"
        try:
            if "test_key" in self.api_key or "test_api_key" in self.api_key:
                return {"status": "success", "message": "Transaction verified (Simulated)"}
            response = requests.get(endpoint, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Payaza verification failed: {str(e)}")
            return None

payaza_service = PayazaService()
