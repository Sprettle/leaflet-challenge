// Perform an API call from USGS website (earthquakes from the past 7 days)
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// In Geojson, run function createFeatures. 
d3.json(url, function(data) {
    // Run function createFeatures
    createFeatures(data.features);
    console.log(data.features);
});

// Define function createFeatures. 
function createFeatures(earthquakeData) {

    // Give each feature a popup describing earthquake place and magnitude 
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h2>" + feature.properties.place + 
            "</h2> <hr> <h3> Richter Scale: " +  feature.properties.mag + 
            "</h3><p>" + new Date(feature.properties.time) + "</p>"
            );
    };

    // Marker radius
    function markerRadius(magnitude) {
        return magnitude * 5; 
    }

    // Marker colours
    function markerColour(magnitude) {
        // Magnitude 0 to 1
        if (magnitude < 1) {
            return "#2dc937"
        }
        // Magnitude 1 to 2
        else if (magnitude < 2) {
            return "#99c140"
        }
        // Magnitude 2 to 3
        else if (magnitude < 3) {
            return "#fefc2b"
        }
        // Magnitude 3 to 4
        else if (magnitude < 4) {
            return "#e7b416"
        }
        // Magnitude 4 to 5
        else if (magnitude < 5) {
            return "#db7b2b"
        }
        // Magnitude > 5
        else {
            return "#cc3232"        
        }

    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData,{
        
        pointToLayer: function(earthquakeData, latlng) {
            return L.circle(latlng, {
                radius: markerRadius(earthquakeData.properties.mag),
                color: markerColour(earthquakeData.properties.mag),
                fillOpacity: 0.5
            });
        },
        
        "onEachFeature": onEachFeature
    
    });

    // Run function createMap 
    createMap(earthquakes);

};

// Define function createMap.
function createMap(earthquakes) {

    // Base layer of map 
    var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    });

    // Create map with 2 layers: lightMap and earthquakes
    var myMap = L.map("map", {
        center: [40.7, -73.95],
        zoom: 5,
        layers: [lightMap, earthquakes]
    });

    //Add legend 'template' to myMap
    var legend = L.control({position:"bottomright"});

    // Colours in the legend for the different richter scale categories
    function getColor(grades) {
        return  grades > 5 ? '#cc3232' :
                grades > 4 ? '#db7b2b' :
                grades > 3 ? '#e7b416' :
                grades > 2 ? '#fefc2b' :
                grades > 1 ? '#99c140' :
                             '#2dc937';
    }

    // Add legend details
    legend.onAdd = function () {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5] 
        
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;

    };
    
    legend.addTo(myMap);

};

