from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SavingsGroupViewSet, JoinGroupView

router = DefaultRouter()
router.register(r'', SavingsGroupViewSet, basename='group')

urlpatterns = [
    path('<int:pk>/join/', JoinGroupView.as_view(), name='join-group'),
    path('', include(router.urls)),
]
