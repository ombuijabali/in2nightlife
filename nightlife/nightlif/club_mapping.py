import os
from django.contrib.gis.utils import LayerMapping
from django.contrib.gis.geos import GEOSGeometry
from .models import ClubModel

# Assuming the shapefile is in the 'data' folder within the 'isp' app
club_shp = os.path.abspath(os.path.join(os.path.dirname(__file__), 'data', 'club.shp'))

clubmodel_mapping = {
    'name': 'name',
    'types': 'types',
    'street': 'street',
    'descriptio': 'descriptio',
    'closed': 'closed',
    'opened': 'opened',
    'restaurant': 'restaurant',
    'delivery_s': 'delivery_s',
    'note': 'note',
    'latitude': 'LATITUDE',
    'longitude': 'LONGITUDE',
    'drinks': 'Drinks',
    'music': 'Music',
    'geom': 'POINT',
}

def run(verbose=True):
    try:
        lm = LayerMapping(ClubModel, club_shp, clubmodel_mapping, transform=False, encoding='utf-8', unique=['types', 'name'])
        lm.save(strict=True, verbose=verbose)
        print("Mapping completed successfully.")
    except Exception as e:
        print(f"An error occurred: {e}")
