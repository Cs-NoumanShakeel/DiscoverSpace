from django.urls import path
from .views import *
from .views import MyTokenObtainPairView 

urlpatterns = [
    path('historical-missions/', HistoricalMissionView.as_view()),
    path('upcoming-missions/', UpcomingMissionView.as_view()),
    path('missions/<int:mission_id>/thoughts/', MissionThoughtListCreateAPIView.as_view(), name='mission-thoughts'),
    path('user/register/', UserCreateView.as_view(), name='user-register'),
    path('planets/', PlanetView.as_view(), name='planet-list'),
    path('spacecrafts/',SpacecraftView.as_view(),name='spacecrafts-list'),
    path('launches/',LaunchView.as_view(),name='launches-list'),
    path('suggestions/', SuggestionListAPIView.as_view(), name='suggestion-list'),
    path('suggestions/create/', SuggestionCreateAPIView.as_view(), name='suggestion-create'),
    path('suggestions/<int:pk>/update/', SuggestionUpdateAPIView.as_view(), name='suggestion-update'),
    path('suggestions/<int:pk>/delete/', SuggestionDeleteAPIView.as_view(), name='suggestion-delete'),
   path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]
