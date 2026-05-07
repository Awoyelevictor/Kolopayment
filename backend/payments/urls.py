from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'contributions', views.ContributionViewSet, basename='contribution')
router.register(r'payouts', views.PayoutViewSet, basename='payout')

urlpatterns = [
    path('process/', views.ProcessPaymentView.as_view(), name='process-payment'),
    path('virtual-account/', views.GetVirtualAccountView.as_view(), name='virtual-account'),
    path('', include(router.urls)),
]
