from rest_framework import serializers
from .models import Contribution, Payout
from accounts.serializers import UserSerializer
from groups.serializers import SavingsGroupSerializer

class ContributionSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    groupName = serializers.CharField(source='group.name', read_only=True)
    cycle_index = serializers.IntegerField(source='group.current_cycle_index', read_only=True)
    
    class Meta:
        model = Contribution
        fields = ('id', 'user', 'group', 'groupName', 'cycle_index', 'amount', 'due_date', 'paid_at', 'status', 'reference')
        read_only_fields = ('paid_at', 'status', 'reference', 'user', 'groupName', 'cycle_index')

class PayoutSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Payout
        fields = ('id', 'user', 'group', 'amount', 'expected_date', 'paid_at', 'status')
        read_only_fields = ('paid_at', 'status', 'user')
