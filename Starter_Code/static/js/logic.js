// Store the JSON URL as a variable
let queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Perform a GET request to the query URL
d3.json(queryURL).then(function(earthquakeData) {
    // Send data.features object to the createFeatures function
    console.log(earthquakeData);
    createFeatures(earthquakeData.features);
});

// Function to create features from earthquake data
function createFeatures(earthquakeData) {
    // Create a GeoJSON layer containing the features array
    let earthquakes = L.geoJSON(earthquakeData, {
        pointToLayer: function(feature, latlng) {
            // Determine the size based on magnitude
            let magnitude = feature.properties.mag;
            let depth = feature.geometry.coordinates[2]; // Depth is the third coordinate
            let color = getColor(depth); // Get the color based on depth

            // Create the marker with size and color based on magnitude & depth
            return L.circleMarker(latlng, {
                radius: getRadius(magnitude), // This function determines the radius
                fillColor: color,
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup("Location: " + feature.properties.place + "<br>Magnitude: " + magnitude + "<br>Depth: " + depth + "km");
        }
    });

    // Create a map and add the earthquakes layer
    createMap(earthquakes);
}

// Function to determine the radius of the circle marker based on magnitude
function getRadius(magnitude) {
    return magnitude * 3; // scaling the radius
}

// Function to get color based on depth
function getColor(depth) {
    return depth > 90 ? "#FF0000" : // Red for deep earthquakes
           depth > 50  ? "#FF7F00" : // Orange for moderate depth
           depth > 20  ? "#FFFF00" : // Yellow for shallow depth
           "#00FF00"; // Green for very shallow
}

// Function to create the map
function createMap(earthquakes) {
    // Define the base layers
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
    });

    let map = L.map("map", {
        center: [37.09, -95.71], // Centered on the US
        zoom: 5,
        layers: [street, earthquakes]
    });

    // Create a legend
    let legend = L.control({ position: 'bottomright' });
    legend.onAdd = function () {
        let div = L.DomUtil.create('div', 'info legend');
        let depths = [-10, 10, 30, 50, 70, 90]; // Updated depth intervals
        let labels = [];

        // Loop through depth intervals and generate a label with a colored square
        for (let i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
        }
        return div;
    };

    legend.addTo(map); // Add the legend to the map
}