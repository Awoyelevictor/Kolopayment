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

        # Simulate Payment processing via Payaza (or similar)
        # Assuming payment is always successful for the demo
        contribution.status = 'paid'
        contribution.paid_at = timezone.now()
        contribution.reference = f"KOLO-{uuid.uuid4().hex[:10].upper()}"
        contribution.save()
        
        # In a real system, we'd add to the user's trust score here!
        user = request.user
        user.trust_score += 5
        user.save()

        return Response({
            "message": "Payment successful.",
            "contribution": ContributionSerializer(contribution).data,
            "new_trust_score": user.trust_score
        })

class PayoutViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = PayoutSerializer

    def get_queryset(self):
        return Payout.objects.filter(user=self.request.user)
