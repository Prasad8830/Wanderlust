let mapKey =  window.mapTokenKey;
var map = new maplibregl.Map({
  container: 'map',
  style: `https://api.maptiler.com/maps/streets/style.json?key=${mapKey}`,
  center: listing.geometry.coordinates, // Bangalore
  zoom: 10
});

// console.log(coordinates);
const Marker = new maplibregl.Marker({ color: 'red' }) // optional: customize color
.setLngLat(listing.geometry.coordinates)        // coordinates from your listing.geometry
.setPopup(new maplibregl.Popup({ offset: 25, className: 'custom-popup' })
.setHTML(`<h4>${listing.location}</h4><p>Exact location will be provided after booking</p>`))
.addTo(map);
