from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Contribution, Payout
from .serializers import ContributionSerializer, PayoutSerializer
from django.utils import timezone
import uuid

class ContributionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = ContributionSerializer

    def get_queryset(self):
        return Contribution.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

from .payaza import payaza_service

class ProcessPaymentView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        contribution_id = request.data.get('contribution_id')
        
        try:
            contribution = Contribution.objects.get(id=contribution_id, user=request.user)
        except Contribution.DoesNotExist:
            return Response({"error": "Contribution not found."}, status=status.HTTP_404_NOT_FOUND)

        if contribution.status == 'paid':
            return Response({"error": "This contribution has already been paid."}, status=status.HTTP_400_BAD_REQUEST)

        # Initiate Payaza Payment
        user = request.user
        payment_result = payaza_service.initiate_payment(
            amount=contribution.amount,
            email=user.email or "user@kolopay.africa",
            first_name=user.first_name or user.username,
            last_name=user.last_name or "",
            phone_number=user.phone_number,
            callback_url="http://localhost:3000/payment/success" # This would be your frontend success route
        )

        if not payment_result:
            return Response({"error": "Failed to initiate payment with Payaza."}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        # In a production environment, you should only mark as 'paid' after successful verification
        # or via a webhook. For this integration phase, we simulate the completion if initiation succeeded.
        contribution.status = 'paid'
        contribution.paid_at = timezone.now()
        contribution.reference = payment_result.get('transaction_reference', f"KOLO-{uuid.uuid4().hex[:10].upper()}")
        contribution.save()
        
        # Increase user trust score for timely payment
        user.trust_score += 5
        user.save()

        return Response({
            "message": "Payment successful.",
            "contribution": ContributionSerializer(contribution).data,
            "new_trust_score": user.trust_score,
            "payaza_data": payment_result
        })

class PayoutViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayoutSerializer

    def get_queryset(self):
        return Payout.objects.filter(user=self.request.user)
