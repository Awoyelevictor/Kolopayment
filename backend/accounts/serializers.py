from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'phone_number', 'bvn', 'is_bvn_verified', 'trust_score', 'profile_image', 'balance')
        read_only_fields = ('is_bvn_verified', 'trust_score', 'balance')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    username = serializers.CharField(required=False, read_only=True)
    email = serializers.EmailField(
        required=False, 
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this email already exists.")]
    )
    phone_number = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all(), message="A user with this phone number already exists.")]
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email', 'phone_number')

    def create(self, validated_data):
        # Use email as username if provided, otherwise phone number
        username_val = validated_data.get('email') or validated_data['phone_number']
        
        # Ensure username is also unique (in case someone has this email as a username but not as an email)
        if User.objects.filter(username=username_val).exists():
            # If username exists, try to make it unique or just fail gracefully
            raise serializers.ValidationError({"non_field_errors": ["A user with this identifier already exists."]})

        user = User.objects.create_user(
            username=username_val,
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone_number=validated_data['phone_number']
        )
        return user


class BVNVerificationSerializer(serializers.Serializer):
    bvn = serializers.CharField(max_length=11, min_length=11)
