from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContributionViewSet, PayoutViewSet, ProcessPaymentView

router = DefaultRouter()
router.register(r'contributions', ContributionViewSet, basename='contribution')
router.register(r'payouts', PayoutViewSet, basename='payout')

urlpatterns = [
    path('process/', ProcessPaymentView.as_view(), name='process-payment'),
    path('', include(router.urls)),
]
