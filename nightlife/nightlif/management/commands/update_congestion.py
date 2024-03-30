# management/commands/update_congestion.py
import googlemaps
from django.core.management.base import BaseCommand
from django.conf import settings
from nightlif.models import ClubModel

class Command(BaseCommand):
    help = 'Update congestion levels for all clubs based on real-time traffic data'

    def handle(self, *args, **options):
        # Initialize the Google Maps client with your API key
        gmaps = googlemaps.Client(key=settings.GOOGLE_MAPS_API_KEY)

        # Iterate through all clubs
        for club in ClubModel.objects.all():
            # Call a function to fetch real-time traffic data and update congestion level
            congestion_level = self.fetch_traffic_data_for_club(gmaps, club)
            # Update congestion level in the database
            club.congestion = congestion_level
            club.save()
            self.stdout.write(self.style.SUCCESS(f'Successfully updated congestion for {club.name}'))

    def fetch_traffic_data_for_club(self, gmaps, club):
        # Make a request to Google's Roads API to fetch traffic data for nearby roads
        try:
            # Fetch the nearest road to the club's location
            result = gmaps.nearest_roads([(club.latitude, club.longitude)])
            
            # Check if the API response contains valid data
            if result and isinstance(result, list) and len(result) > 0:
                # Extract the place ID of the nearest road
                place_id = result[0].get('place_id')
                
                # Fetch road segment data for the nearest road using its place ID
                road_result = gmaps.place(place_id)
                
                # Extract speed limit data from the road segment data
                speed_limit = road_result.get('result', {}).get('speed_limit')
                
                # Check if valid speed limit data is available
                if speed_limit is not None:
                    # Simulate congestion level calculation based on speed limit
                    congestion_level = self.calculate_congestion(speed_limit)
                    return congestion_level
                else:
                    # Handle case where speed limit data is not available
                    self.stderr.write(self.style.ERROR(f'No speed limit data found for {club.name}'))
            else:
                # Handle case where API response is empty or invalid
                self.stderr.write(self.style.ERROR(f'Invalid API response for {club.name}'))
        except Exception as e:
            # Handle any exceptions or errors during API request
            self.stderr.write(self.style.ERROR(f'Error fetching traffic data for {club.name}: {e}'))

        # Return default congestion level if data retrieval fails
        return 0



    def calculate_congestion(self, speed_limit):
        # Replace this with your actual logic for congestion calculation
        # The following is a placeholder and won't work in the real world
        if speed_limit >= 80:
            return 20  # Low congestion
        elif speed_limit >= 50:
            return 50  # Moderate congestion
        else:
            return 80  # High congestion

