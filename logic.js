var earthquakeQuery = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";
// Perform a request to retrieve the Geo json from the query URL
d3.json(earthquakeQuery, function(data) {
  // send the data.features object to the cr_Features function.
  console.log(data)
  cr_Features(data.features);
});

// Function to create features using the earthquake data.
function cr_Features(dataFunction) {

  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var earthquakes = L.geoJSON(dataFunction, {
    pointToLayer: function (feature, latlng) {
              return L.circleMarker(latlng, {
        radius: markerSize(feature.properties.mag),
        fillColor: fillColor(feature.properties.mag),
        color: "black",
        weight: 0.6,
        opacity: 0.4,
        fillOpacity: 0.6
      });
      },

      // Create popups
      onEachFeature: function (feature, layer) {
        return layer.bindPopup(`<strong>Place:</strong> ${feature.properties.place}<br><strong>Magnitude:</strong> ${feature.properties.mag}`);
      }
    });

    // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

//creting  map using two layers.
function createMap(earthquakes) {

  // Define streetmap and darkmap layers
  var baselayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
  });

  var darklayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
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
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  // map center is Trenton, NJ.
  var myMap = L.map("map", {
    center: [
      40.22, -74.75
    ],
    zoom: 3,
    layers: [baselayer, earthquakes]
  });

  // Create a layer control
  // Pass in our baseMaps and overlayMaps
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


// Set up the legend and the colour variance for magnitude from leaflet documentation
var legend = L.control({ position: 'bottomright'});


  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend'),
        mag = [0,1,2,3,4,5,6],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < mag.length; i++) {
        div.innerHTML +=
            '<i style="background:' + fillColor(mag[i] + 1) + '"></i> ' +
            mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
  };
   // Adding legend to the map

// Define colors depending on the magnituge of the earthquake
function fillColor(mag) {

    switch (true) {
      case mag >= 6.0:
        return 'red';
        break;
      
      case mag >= 5.0:
        return 'orangered';
        break;

      case mag >= 4.0:
        return 'orange';
        break;
      
      case mag >= 3.0:
        return 'gold';
        break;

      case mag >= 2.0:
        return 'yellow';
        break;

      case mag >= 1.0:
        return 'green';
        break;

      default:
        return 'greenyellow';
    };
};


// Reflect the earthquake magnitude
function markerSize(mag) {
  return mag*3;
}



