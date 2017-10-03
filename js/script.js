//First, we set the map location
var map = L.map('map').setView([40.7128,-74.0059], 10.4);

//Then, set the base map, in this case, the CartoDB light tiles; and includes the credits 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>, JD Godchaux'
});

// Then, add the base map tiles to the map, notice how we first set the tiles as a "var" above, and that includes all the link, down here we simply call on the "var."
map.addLayer(CartoDBTiles);

// set global variables for our data (just the GeoJSON for now); this will help use it in the layer controls below
var ParksPropertiesGeoJSON;

// use jQuery's  getJSON function to grab the geoJson layer, parse it, then plot it on the map using the plotDataset function
$.getJSON( "data/ParksProperties.geojson", function( data ) {
    var dataset = data;
    // draw the dataset on the map
    plotDataset(dataset);
    //create the sidebar with links to fire polygons on the map
    createListForClick(dataset);
});
//so far so good, then everything starts getting confusing...

// function to plot the dataset passed to it
function plotDataset(dataset) {
    ParksPropertiesGeoJSON = L.geoJson(dataset, {
        style: ParksPropertiesStyle,
        onEachFeature: ParksPropertiesOnEachFeature
    }).addTo(map);

    // create layer controls
    createLayerControls(); 
}

// function that sets the style of the geojson layer
var ParksPropertiesStyle = function (feature, latlng) {
    
    var calc = calculatePercentage(feature);

    var style = {
        weight: 1,
        opacity: .25,
        color: 'grey',
        fillOpacity: fillOpacity(calc.percentage),
        fillColor: fillColorPercentage(calc.percentage)
    };

    return style;

}

function calculatePercentage(feature) {
    var output = {};
    var numerator = parseFloat(feature.properties.ACS_13_5YR_B07201_HD01_VD14);
    var denominator = parseFloat(feature.properties.ACS_13_5YR_B07201_HD01_VD01);
    var percentage = ((numerator/denominator) * 100).toFixed(0);
    output.numerator = numerator;
    output.denominator = denominator;
    output.percentage = percentage;
    return output;    
}

// function that fills polygons with color based on the data
function fillColorPercentage(d) {
    return d > 9 ? '#006d2c' :
                   '#94bc85';
}

// function that sets the fillOpacity of layers -- if % is 0 then make polygons transparent
function fillOpacity(d) {
    return d == 0 ? 0.0 :
                    0.75;
}

// empty L.popup so we can fire it outside of the map
var popup = new L.Popup();

// set up a counter so we can assign an ID to each layer
var count = 0;

// on each feature function that loops through the dataset, binds popups, and creates a count
var ParksPropertiesOnEachFeature = function(feature,layer){
    var calc = calculatePercentage(feature);

    // let's bind some feature properties to a pop up with an .on("click", ...) command. We do this so we can fire it both on and off the map
    layer.on("click", function (e) {
        var bounds = layer.getBounds();
        var popupContent = "<strong>Name:</strong> " + feature.properties.NAME311 + "<br /><strong>Parks District:</strong> " + feature.properties.DEPARTMENT + "<br /><strong>Type:</strong> " + feature.properties.TYPECATEGO;
        popup.setLatLng(bounds.getCenter());
        popup.setContent(popupContent);
        map.openPopup(popup);
    });

    // we'll now add an ID to each layer so we can fire the popup outside of the map
    layer._leaflet_id = 'ParksPropertiesLayerID' + count;
    count++;

}


function createLayerControls(){
    // add in layer controls
    var baseMaps = {
        "CartoDB Basemap": CartoDBTiles,
    };

    var overlayMaps = {
        "CLASS": ParksPropertiesGeoJSON,
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    
}

// function to create a list in the right hand column with links that will launch the pop-ups on the map
function createListForClick(dataset) {
    // use d3 to select the div and then iterate over the dataset appending a list element with a link for clicking and firing
    // first we'll create an unordered list ul elelemnt inside the <div id='list'></div>. The result will be <div id='list'><ul></ul></div>

    //d3.select("#list").append('h1').text('List of Census Tracts in Brooklyn');


    var ULs = d3.select("#list")
                .append("ul");


    // now that we have a selection and something appended to the selection, let's create all of the list elements (li) with the dataset we have 
    
    ULs.selectAll("li")
        .data(dataset.features)
        .enter()
        .append("li")
        .html(function(d) { 
            return '<a href="#">' + d.properties.NAME311 + '</a>'; 
        })
        .on('click', function(d, i) {
            console.log(d.properties.NAME311);
            console.log(i);
            var leafletId = 'ParksPropertiesLayerID' + i;
            map._layers[leafletId].fire('click');
        });


}

// AMMON - DONT WORRY ABOUT ANYTHING BELOW THIS
// lets add data from the API now
// set a global variable to use in the D3 scale below
// use jQuery geoJSON to grab data from API
// $.getJSON( "https://data.cityofnewyork.us/resource/erm2-nwe9.json?$$app_token=rQIMJbYqnCnhVM9XNPHE9tj0g&borough=BROOKLYN&complaint_type=Noise&status=Open", function( data ) {
//     var dataset = data;
//     // draw the dataset on the map
//     plotAPIData(dataset);

// });

// // create a leaflet layer group to add your API dots to so we can add these to the map
// var apiLayerGroup = L.layerGroup();

// // since these data are not geoJson, we have to build our dots from the data by hand
// function plotAPIData(dataset) {
//     // set up D3 ordinal scle for coloring the dots just once
//     var ordinalScale = setUpD3Scale(dataset);
    
// console.log(ordinalScale("Noise, Barking Dog (NR5)"));


//     // loop through each object in the dataset and create a circle marker for each one using a jQuery for each loop
//     $.each(dataset, function( index, value ) {

//         // check to see if lat or lon is undefined or null
//         if ((typeof value.latitude !== "undefined" || typeof value.longitude !== "undefined") || (value.latitude && value.longitude)) {
//             // create a leaflet lat lon object to use in L.circleMarker
//             var latlng = L.latLng(value.latitude, value.longitude);
     
//             var apiMarker = L.circleMarker(latlng, {
//                 stroke: false,
//                 fillColor: ordinalScale(value.descriptor),
//                 fillOpacity: 1,
//                 radius: 5
//             });

//             // bind a simple popup so we know what the noise complaint is
//             apiMarker.bindPopup(value.descriptor);

//             // add dots to the layer group
//             apiLayerGroup.addLayer(apiMarker);

//         }

//     });

//     apiLayerGroup.addTo(map);

// }

// function setUpD3Scale(dataset) {
//     //console.log(dataset);
//     // create unique list of descriptors
//     // first we need to create an array of descriptors
//     var descriptors = [];

//     // loop through descriptors and add to descriptor array
//     $.each(dataset, function( index, value ) {
//         descriptors.push(value.descriptor);
//     });

//     // use underscore to create a unique array
//     var descriptorsUnique = _.uniq(descriptors);

//     // create a D3 ordinal scale based on that unique array as a domain
//     var ordinalScale = d3.scale.category20()
//         .domain(descriptorsUnique);

//     return ordinalScale;

// }