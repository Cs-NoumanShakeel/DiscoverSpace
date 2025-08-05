from django.contrib import admin
from .models import (
    HistoricalMission, HistoricalMissionImage,
    UpcomingMission, UpcomingMissionImage,MissionThought,Planet,Spacecraft,Suggestion
)

admin.site.register(HistoricalMission)
admin.site.register(HistoricalMissionImage)
admin.site.register(UpcomingMission)
admin.site.register(UpcomingMissionImage)
admin.site.register(MissionThought)
admin.site.register(Planet)
admin.site.register(Spacecraft)
admin.site.register(Suggestion)