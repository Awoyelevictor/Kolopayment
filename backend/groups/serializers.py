from rest_framework import serializers
from .models import SavingsGroup, GroupMembership
from accounts.serializers import UserSerializer

class GroupMembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = GroupMembership
        fields = ('id', 'user', 'role', 'status', 'payout_order', 'joined_at')
        read_only_fields = ('joined_at',)

class SavingsGroupSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SavingsGroup
        fields = ('id', 'name', 'description', 'contribution_amount', 'frequency', 
                 'max_members', 'status', 'created_by', 'created_at', 'start_date', 'members_count')
        read_only_fields = ('created_at', 'created_by', 'status')

    def get_members_count(self, obj):
        return obj.members.count()

class SavingsGroupDetailSerializer(SavingsGroupSerializer):
    members = GroupMembershipSerializer(many=True, read_only=True)

    class Meta(SavingsGroupSerializer.Meta):
        fields = SavingsGroupSerializer.Meta.fields + ('members',)
