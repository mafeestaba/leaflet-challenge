const geoJSONLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(geoJSONLink)
  .then(function(data) {
    createMap(data);
  });

function createMap(data) {
  let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 8
  });

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 3
  }).addTo(myMap);
  addGeoJSONLayer(data, myMap);
}

function addGeoJSONLayer(data, map) {
  L.geoJSON(data, {
    pointToLayer: function(feature, latlng) {
      let radius = feature.properties.mag * 5;
      let depth = feature.geometry.coordinates[2];
      let color = getColor(depth);

      return L.circleMarker(latlng, {
        radius: radius,
        color: "black",
        fillColor: color,
        weight: 1,
        opacity: 2,
        fillOpacity: 0.8
      });
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>Magnitude: ${feature.properties.mag}</p><p>Depth: ${feature.geometry.coordinates[2]} km</p>`);
    }
  }).addTo(map);


  createLegend(map);
}
function createLegend(map) {
    let legend = L.control({ position: "bottomleft" });
    
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
            let depths = [-10, 30, 70, 90];
            let colors = ["green", "yellow", "orange", "red"];
            let labels = [];
        
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML += "<i class='circle' style='background: " + colors[i] + "'></i> " + depths[i] + (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
        }
        
        console.log(div.innerHTML);
        return div;
    };
    
    legend.addTo(map);
}

function getColor(depth) {
  let color;
  if (depth > 90) {
    color = "red";
  } else if (depth > 70) {
    color = "orange";
  } else if (depth > 30) {
    color = "yellow";
  } else {
    color = "green";
  }
  return color;
}