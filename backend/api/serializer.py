from rest_framework import serializers
from .models import (
    HistoricalMission, HistoricalMissionImage,
    UpcomingMission, UpcomingMissionImage,MissionThought,Planet,Spacecraft,Launch,Suggestion
)

from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'email']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

class HistoricalMissionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalMissionImage
        fields = '__all__'





class MissionThoughtSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    mission = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = MissionThought
        fields = ['id', 'mission', 'user', 'message', 'created_at']
        read_only_fields = ['user', 'created_at', 'mission']




class HistoricalMissionSerializer(serializers.ModelSerializer):
    images = HistoricalMissionImageSerializer(many=True, read_only=True)

    class Meta:
        model = HistoricalMission
        fields = '__all__'


class UpcomingMissionImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UpcomingMissionImage
        fields = '__all__'


class UpcomingMissionSerializer(serializers.ModelSerializer):
    images = UpcomingMissionImageSerializer(many=True, read_only=True)

    class Meta:
        model = UpcomingMission
        fields = '__all__'


class PlanetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Planet
        fields = '__all__'


class SpacecraftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Spacecraft
        fields = '__all__'


class LaunchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Launch
        fields = '__all__'


class SuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Suggestion
        fields = '__all__'
        read_only_fields = ['user']


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
        }
        return data





