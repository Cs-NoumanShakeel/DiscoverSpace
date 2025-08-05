import requests
from django.core.management.base import BaseCommand
from api.models import Launch
from datetime import datetime

class Command(BaseCommand):
    help = 'Deletes all launches and imports fresh SpaceX data with ISP/NET fixed'

    def handle(self, *args, **kwargs):
        # Step 1: Delete ALL existing launches
        self.stdout.write('🗑️  Deleting all existing launches...')
        deleted = Launch.objects.all().count()
        Launch.objects.all().delete()
        self.stdout.write(f'✅ Deleted {deleted} launches')
        
        # Step 2: Get rockets data for ISP values
        self.stdout.write('🚀 Fetching rocket specifications...')
        rockets = {}
        rocket_response = requests.get('https://api.spacexdata.com/v4/rockets')
        if rocket_response.status_code == 200:
            for rocket in rocket_response.json():
                isp_vac = None
                isp_sl = None
                if rocket.get('engines', {}).get('isp'):
                    isp_vac = rocket['engines']['isp'].get('vacuum')
                    isp_sl = rocket['engines']['isp'].get('sea_level')
                
                rockets[rocket['id']] = {
                    'name': rocket['name'],
                    'isp_vacuum': isp_vac,
                    'isp_sea_level': isp_sl
                }
        
        # Step 3: Get launchpad data
        self.stdout.write('🏢 Fetching launchpad data...')
        pads = {}
        pad_response = requests.get('https://api.spacexdata.com/v4/launchpads')
        if pad_response.status_code == 200:
            for pad in pad_response.json():
                pads[pad['id']] = {
                    'name': pad.get('full_name', 'Unknown'),
                    'locality': pad.get('locality', 'Unknown'),
                    'region': pad.get('region', 'Unknown')
                }
        
        # Step 4: Get past launches (they have videos) - only 10
        self.stdout.write('📡 Fetching SpaceX past launches with videos...')
        launch_response = requests.get('https://api.spacexdata.com/v4/launches/past?limit=10')
        
        if launch_response.status_code != 200:
            self.stderr.write(f'❌ Failed to fetch launches: {launch_response.status_code}')
            return
        
        launches = launch_response.json()
        
        # Filter launches that have videos
        launches_with_videos = []
        for launch in launches:
            links = launch.get('links', {})
            if links.get('youtube_id') or links.get('webcast'):
                launches_with_videos.append(launch)
        
        # Take only first 10 launches with videos
        launches = launches_with_videos[:10]
        
        self.stdout.write(f'📦 Processing {len(launches)} launches with videos...')
        
        created_count = 0
        
        for i, launch in enumerate(launches, 1):
            name = launch.get('name', 'Unknown Mission')
            
            # Status mapping
            if launch.get('upcoming'):
                status = 'Go'
            elif launch.get('success') is True:
                status = 'Success'
            elif launch.get('success') is False:
                status = 'Failure'
            else:
                status = 'TBD'
            
            # Fix NET (datetime) - better conversion
            net = None
            if launch.get('date_utc'):
                try:
                    # Parse the ISO datetime string properly
                    date_str = launch['date_utc']
                    if date_str.endswith('Z'):
                        date_str = date_str[:-1] + '+00:00'
                    net = datetime.fromisoformat(date_str)
                    print(f"  ✅ NET parsed: {net}")
                except Exception as e:
                    print(f"  ❌ NET parse failed: {e}")
                    # Try alternative parsing
                    try:
                        from dateutil import parser
                        net = parser.parse(launch['date_utc'])
                        print(f"  ✅ NET parsed with dateutil: {net}")
                    except:
                        net = launch['date_utc']  # Keep as string
                        print(f"  ⚠️ Keeping NET as string: {net}")
            
            # Images
            links = launch.get('links', {})
            patch = links.get('patch', {})
            flickr = links.get('flickr', {}).get('original', [])
            image = patch.get('large') or (flickr[0] if flickr else None)
            
            # Rocket info with ISP
            rocket_id = launch.get('rocket')
            rocket_info = rockets.get(rocket_id, {})
            rocket_name = rocket_info.get('name', 'Unknown')
            isp = rocket_info.get('isp_vacuum')  # Use vacuum ISP
            
            # Launchpad info
            pad_id = launch.get('launchpad')
            pad_info = pads.get(pad_id, {})
            pad_name = pad_info.get('name', 'Unknown Pad')
            location = f"{pad_info.get('locality', 'Unknown')}, {pad_info.get('region', 'Unknown')}"
            
            # Video URL - debug what we're getting
            video_url = None
            print(f"  🎬 Links data: {links}")
            
            if links.get('youtube_id'):
                video_url = f"https://www.youtube.com/watch?v={links['youtube_id']}"
                print(f"  ✅ YouTube ID found: {links['youtube_id']}")
            elif links.get('webcast'):
                video_url = links['webcast']
                print(f"  ✅ Webcast URL found: {video_url}")
            else:
                print(f"  ❌ No video URL found")
            
            # Mission description
            description = launch.get('details') or f"SpaceX {name} mission"
            
            # Create launch
            Launch.objects.create(
                name=name,
                status=status,
                net=net,
                image=image,
                mission_name=name,
                mission_description=description,
                mission_type='SpaceX Launch',
                rocket_name=rocket_name,
                rocket_family='SpaceX',
                rocket_variant=rocket_name,
                isp=isp,
                launch_service_provider='SpaceX',
                pad_name=pad_name,
                location_name=location,
                video_url=video_url,
            )
            
            created_count += 1
            
            # Progress update for each launch
            print(f'🚀 {i}/{len(launches)}: {name}')
            print(f'  📅 Date: {launch.get("date_utc")} -> {net}')
            print(f'  🎯 Status: {status}')
            print(f'  🚀 Rocket: {rocket_name} (ISP: {isp})')
            if video_url:
                print(f'  🎬 Video: {video_url}')
            print('---')
        
        self.stdout.write(
            self.style.SUCCESS(f'🎉 Successfully imported {created_count} SpaceX launches!')
        )