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
.setDOMContent(popupContent()))
.addTo(map);


// built with textContent so the location is never parsed as html
function popupContent() {
  const container = document.createElement("div");
  const heading = document.createElement("h4");
  heading.textContent = listing.location;
  const note = document.createElement("p");
  note.textContent = "Exact location will be provided after booking";
  container.append(heading, note);
  return container;
}
