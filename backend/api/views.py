from rest_framework import generics, permissions
from .serializer import HistoricalMissionSerializer, UpcomingMissionSerializer,UserSerializer,MissionThoughtSerializer,PlanetSerializer,SpacecraftSerializer,LaunchSerializer,SuggestionSerializer
from .models import HistoricalMission, UpcomingMission,MissionThought,Planet,Spacecraft,Launch,Suggestion
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

class HistoricalMissionView(generics.ListAPIView):
    serializer_class = HistoricalMissionSerializer

    def get_queryset(self):
        title = self.request.query_params.get('title')
        if title:
            return HistoricalMission.objects.filter(title__icontains=title)
        return HistoricalMission.objects.all()

from rest_framework_simplejwt.views import TokenObtainPairView
from .serializer import MyTokenObtainPairSerializer

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class UserCreateView(generics.CreateAPIView):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation Errors:", serializer.errors)  # Helps you debug
            return Response(serializer.errors, status=400)
        self.perform_create(serializer)
        return Response(serializer.data, status=201)

class UpcomingMissionView(generics.ListAPIView):
    serializer_class = UpcomingMissionSerializer

    def get_queryset(self):
        title = self.request.query_params.get('title')
        if title:
            return UpcomingMission.objects.filter(title__icontains=title)
        return UpcomingMission.objects.all()


class ThoughtView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = UpcomingMission.objects.all()
    serializer_class = UpcomingMissionSerializer
    lookup_field = 'id'  

# api/views.py
from django.http import JsonResponse
from django.core.management import call_command
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def run_fetch_launches(request):
    if request.method == "POST":  # Use POST to prevent accidental triggering
        try:
            call_command('fetch_launches')
            return JsonResponse({"status": "success", "message": "Launches fetched successfully!"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)})
    return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)


class MissionThoughtListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MissionThoughtSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        mission_id = self.kwargs.get("mission_id")
        return MissionThought.objects.filter(mission_id=mission_id).order_by("-created_at")

    def perform_create(self, serializer):
        mission_id = self.kwargs.get("mission_id")
        serializer.save(user=self.request.user, mission_id=mission_id)


class MissionThoughtListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = MissionThoughtSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        mission_id = self.kwargs.get("mission_id")
        return MissionThought.objects.filter(mission_id=mission_id).order_by("-created_at")

    def perform_create(self, serializer):
        mission_id = self.kwargs.get("mission_id")
        serializer.save(user=self.request.user, mission_id=mission_id)


class PlanetView(generics.ListAPIView):
   def get(self, request):
        planets = Planet.objects.all()
        serializer = PlanetSerializer(planets, many=True)
        return Response(serializer.data) 
   


class SpacecraftView(generics.ListAPIView):
   def get(self, request):
        spacecrafts = Spacecraft.objects.all()
        serializer = SpacecraftSerializer(spacecrafts, many=True)
        return Response(serializer.data) 
   




class LaunchView(generics.ListAPIView):
   def get(self, request):
        launches = Launch.objects.all()
        serializer = LaunchSerializer(launches, many=True)
        return Response(serializer.data) 
   








class SuggestionListAPIView(generics.ListAPIView):
    serializer_class = SuggestionSerializer
    queryset = Suggestion.objects.all()
    
class SuggestionCreateAPIView(generics.CreateAPIView):
    serializer_class = SuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)



class SuggestionUpdateAPIView(generics.UpdateAPIView):
    serializer_class = SuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Suggestion.objects.filter(user=self.request.user)


class SuggestionDeleteAPIView(generics.DestroyAPIView):
    serializer_class = SuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Suggestion.objects.filter(user=self.request.user)


