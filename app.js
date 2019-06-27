//  Verify the data set used on usgs.gov
var earthquakeQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";

d3.json(earthquakeQuery, function(metaData) {
  console.log(metaData)
  cr_Features(metaData.features);
});

// Function to create features using the earthquake data.
function cr_Features(dataFunction) {

  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Run all data arrays using a json function
  var data = L.geoJSON(dataFunction, {
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor(feature.properties.mag),
        color: "black",
        weight: 0.5,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },

      // Create popups
      onEachFeature: function (feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
      }
    });

    // Create a function that will register earthquake layers
  createMap(data);
}

function createMap(data) {

  // Define streetmap and darkmap layers
  var baselayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });

  var darklayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.dark",
    accessToken: API_KEY
  });

  // Create the street and dark maps
  var baseMaps = {
    "Street Map": baselayer,
    "Dark Map": darklayer
  };

  // Create the overlay layer
  var overlayMaps = {
    Earthquakes: data
  };

  // Center the map location
  var mymap = L.map("map", {
    center: [
      33.74, -84.38
    ],
    zoom: 2.5,
    layers: [baselayer, data]
  });

  // Add the control layers
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(mymap);


// Set up color variance
var legend = L.control({ position: 'bottomright'});


  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0,1,2,3,4,5],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillColor(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }

    return div;
};

// Add a legend to the map
legend.addTo(mymap);
   };
 

// Add colors corresponding to magnitude
function fillColor(mag) {

    switch (true) {
      case mag >= 6.0:
        return 'maroon';
        break;
      
      case mag >= 5.0:
        return 'orangered';
        break;

      case mag >= 4.0:
        return 'darkorange';
        break;
      
      case mag >= 3.0:
        return 'yellow';
        break;

      case mag >= 2.0:
        return 'gold';
        break;

      case mag >= 1.0:
        return 'chartreuse';
        break;

      default: 
        return 'chartreuse';
    };
};

// Reflect the earthquake magnitude
function markerSize(mag) {
  return mag*3;
}



