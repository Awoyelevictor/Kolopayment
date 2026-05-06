from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, BVNVerificationSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class BVNVerifyView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = BVNVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        bvn = serializer.validated_data['bvn']
        
        # Simulate BVN Verification
        user = request.user
        user.bvn = bvn
        user.is_bvn_verified = True
        user.save()
        
        return Response({
            "message": "BVN verified successfully",
            "user": UserSerializer(user).data
        })
