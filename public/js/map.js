  document.addEventListener("DOMContentLoaded", function () {
    const map = new maplibregl.Map({
      container: 'map',
      style: `https://api.maptiler.com/maps/streets/style.json?key=${mapToken}`,
      center: coordinates, // India Gate
      zoom: 13
    });

    map.addControl(new maplibregl.NavigationControl());

    new maplibregl.Marker()
      .setLngLat(coordinates)
      .setPopup(
      new maplibregl.Popup().setHTML(`<h3>${listingLocation}</h3><p>Exact location provided after booking</p>`)
    )
      // .setPopup(new maplibregl.Popup().setText('Exact location provided after booking'))
      .addTo(map);
  });

  console.log(coordinates)