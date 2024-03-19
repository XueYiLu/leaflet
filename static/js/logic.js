let API_KEY="pk.eyJ1Ijoia2F0dHlsdTEiLCJhIjoiY2x0eDdjbW0xMDFxNDJrcnpib2ljMjF4MyJ9.RMWfB_xkAuPrd6iKCMIX7w";

let mymap = L.map("map", {
    center: [40.7128, -74.0059],
    zoom: 4
});

let lightmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: ' © <a href="https://www.mapbox.com/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 18,
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


function chooseColor(magnitude) {
    switch (true) {
        case magnitude >= -10 && magnitude<10:
            return '#04e824';
        case magnitude >= 10 && magnitude<30:
            return 'yellow';
        case magnitude >= 30 && magnitude<50:
            return '#ffbf69';
        case magnitude >= 50 && magnitude<70:
            return '#f3a738';
        case magnitude >= 70 && magnitude<90:
            return '#c84c09';
        case magnitude > 90:
            return '#a40606';
        default:
            return '#18ff6d'
    }
}

function markerSize(magnitude){
    return magnitude * 4
}

d3.json(link).then(function (data) {
    console.log(data)
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: chooseColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup(`Magnitude: ${feature.properties.mag}<br>Depth:${feature.geometry.coordinates[2]}<br>Location: ${feature.properties.place}`)
        }
    }).addTo(mymap);
});

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
        grades = [-10,10,30,50,70,90]
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + chooseColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
};
legend.addTo(mymap);
