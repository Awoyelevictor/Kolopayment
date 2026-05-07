from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'bvn', 'is_bvn_verified', 'trust_score', 'profile_image', 'balance')
        read_only_fields = ('is_bvn_verified', 'trust_score', 'balance')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, read_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'phone_number')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data.get('email') or validated_data['phone_number'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data['phone_number']
        )
        return user


class BVNVerificationSerializer(serializers.Serializer):
    bvn = serializers.CharField(max_length=11, min_length=11)
