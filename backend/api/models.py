from django.db import models
from django.contrib.auth.models import User

class HistoricalMission(models.Model):
    title = models.CharField(max_length=255)
 
    mission_type = models.CharField(max_length=255)
    crew = models.CharField(max_length=255)
    launch = models.DateField()
    splash_down = models.DateField()
    video_url = models.URLField(blank=True, null=True)
    overview = models.TextField(blank=True) 

    def __str__(self):
        return self.title


class HistoricalMissionImage(models.Model):
    mission = models.ForeignKey(HistoricalMission, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='missions/images/')
    caption = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.mission.title} - Image"


class UpcomingMission(models.Model):
    mission_cover = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    mission_type = models.CharField(max_length=255)
    crew_size = models.IntegerField()
    launch = models.DateField()
    duration = models.IntegerField()
    thoughts = models.CharField(max_length=255, blank=True)
    video_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.title


class MissionThought(models.Model):
    mission = models.ForeignKey(UpcomingMission, on_delete=models.CASCADE, related_name="feedback")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

class UpcomingMissionImage(models.Model):
    mission = models.ForeignKey(UpcomingMission, on_delete=models.CASCADE, related_name='images')
    crew_image = models.ImageField(upload_to='missions/images/')
    crew_name = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.mission.title} - Image"



class Planet(models.Model):
    title = models.CharField(max_length=255)
    introduction = models.TextField()
    namesake = models.TextField()
    potential = models.TextField()
    metrics = models.TextField()
    moons = models.CharField(max_length=255)
    rings = models.CharField(max_length=255)
    rotation = models.TextField()
    formation = models.TextField()
    structure = models.TextField()
    atmosphere = models.TextField()
    
    image = models.ImageField(upload_to='missions/images/', blank=True, null=True)
    video_url = models.URLField(blank=True, null=True)



    def __str__(self):
        return self.title



class Spacecraft(models.Model):
    name = models.CharField(max_length=100)
    mission = models.TextField()
    launch_date = models.DateField()
    operator = models.CharField(max_length=100)
    image = models.ImageField(upload_to='missions/images/')




class Suggestion(models.Model):
    TYPE_CHOICES = [
        ('suggestion', 'General Suggestion'),
        ('satellite', 'Satellite Mission'),
        ('manned', 'Manned Mission'),
        ('unmanned', 'Unmanned Mission'),
        ('research', 'Research Mission'),
        ('other', 'Other'),
    ]

    name = models.CharField(max_length=100)
    age = models.IntegerField()
    country = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='suggestions')
    purpose = models.TextField()
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    image = models.ImageField(upload_to='missions/images/', blank=True, null=True)
    video = models.FileField(upload_to='missions/images/', blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} by {self.name}"



class Launch(models.Model):
    name = models.CharField(max_length=200)
    status = models.CharField(max_length=100)
    net = models.DateTimeField()  
    image = models.URLField(blank=True, null=True)

    mission_name = models.CharField(max_length=200, blank=True, null=True)
    mission_description = models.TextField(blank=True, null=True)
    mission_type = models.CharField(max_length=100, blank=True, null=True)
    
   
    rocket_name = models.CharField(max_length=100, blank=True, null=True)
    rocket_family = models.CharField(max_length=100, blank=True, null=True)
    rocket_variant = models.CharField(max_length=100, blank=True, null=True)
    isp = models.IntegerField(blank=True, null=True)  # If available
    

    launch_service_provider = models.CharField(max_length=100, blank=True, null=True)


    pad_name = models.CharField(max_length=100, blank=True, null=True)
    location_name = models.CharField(max_length=100, blank=True, null=True)


    video_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.name



