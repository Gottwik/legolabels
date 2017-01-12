# categories are fetched from rebrickable /api/get_part_types

import json

CATEGORIES_DATA_FILE = '../../app/data/categories.json'

categories_file = open(CATEGORIES_DATA_FILE, 'r')

categories = json.load(categories_file)

color_id = 0
for category in categories['part_types']:
	category['lego_color'] = color_id

	color_id += 1


print(json.dumps(categories['part_types']))
