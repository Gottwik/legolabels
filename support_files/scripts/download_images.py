# download all images from rebrickable

import urllib.request

url = "http://rebrickable.com/downloads/"
print(urllib.request.urlopen(url).read())

