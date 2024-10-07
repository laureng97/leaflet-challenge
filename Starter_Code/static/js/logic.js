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
            
        }
    })
}