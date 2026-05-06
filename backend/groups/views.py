from rest_framework import viewsets, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import SavingsGroup, GroupMembership
from .serializers import SavingsGroupSerializer, SavingsGroupDetailSerializer, GroupMembershipSerializer
from django.shortcuts import get_object_or_404

class SavingsGroupViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavingsGroup.objects.all()

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SavingsGroupDetailSerializer
        return SavingsGroupSerializer

    def perform_create(self, serializer):
        group = serializer.save(created_by=self.request.user)
        # Automatically add the creator as an admin member
        GroupMembership.objects.create(
            user=self.request.user,
            group=group,
            role='admin',
            status='active'
        )

class JoinGroupView(views.APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        group = get_object_or_404(SavingsGroup, pk=pk)
        
        if GroupMembership.objects.filter(user=request.user, group=group).exists():
            return Response({"error": "You are already a member of this group."}, status=status.HTTP_400_BAD_REQUEST)
            
        if group.members.count() >= group.max_members:
            return Response({"error": "This group is full."}, status=status.HTTP_400_BAD_REQUEST)
            
        membership = GroupMembership.objects.create(
            user=request.user,
            group=group,
            role='member',
            status='active'
        )
        
        return Response({
            "message": "Successfully joined the group.",
            "membership": GroupMembershipSerializer(membership).data
        }, status=status.HTTP_201_CREATED)
