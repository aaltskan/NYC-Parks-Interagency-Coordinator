//First, we set the map location
var map = L.map('map').setView([40.7128,-74.0059], 10.4);

//Then, we set the base map, in this case, the CartoDB light tiles; and also include the credits 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>, JD Godchaux'
});

// Then, we add the base map tiles to the map, notice how we first set the tiles as a "var" above, and that includes all the link, down here we simply call on the "var."
map.addLayer(CartoDBTiles);

// set global variables for our data (just the GeoJSON for now); this will help use it in the layer controls below
var ParksPropertiesGeoJSON;

// Then we use jQuery's getJSON function to grab the geoJson layer, parse it, then plot it on the map using the plotDataset function
$.getJSON( "data/ParksProperties.geojson", function( data ) {
    var dataset = data;
    // draw the dataset on the map
    plotDataset(dataset);
    //create the sidebar with links to fire polygons on the map
    createListForClick(dataset);
});

//EVERYTHING UP TO HERE WAS VERY CLEAR

// function to plot the dataset passed to it
function plotDataset(dataset) {
    ParksPropertiesGeoJSON = L.geoJson(dataset, {
        style: ParksPropertiesStyle,
        onEachFeature: acsOnEachFeature
    }).addTo(map);

    // create layer controls
    createLayerControls(); 
}

//AND UP TO THIS POINT EVERYTHING STILL MADE SENSE,
//BUT FOR THIS NEXT PART, 
//I WENT THROUGH MULTIPLE TUTORIALS FOR HOW TO MAP ORDINAL CATEGORIES
//(WHICH IN REALITY IS PROBABLY FAR MORE SIMPLE THAN THE CALCULATION BELOW);
//HOWEVER, NONE OF THE WAYS I TRIED WORKED, AND
//I KEPT GETTING ERRORS AND THE REST OF THE SCRIPT WOULD FAIL;
//SO I REVERTED BACK TO THIS ORIGINAL CODE FOR NOW, SO IT WOULD AT LEAST SHOW THE PARKS PROPERTIES GEOJSON FOR NOW; 
//ABSOLUTELY MUST REVIEW HOW TO STYLE GEOJSONS, AND THOROUGHLY.
//HAD MUCH MORE SUCCESS MESSING AROUND WITH THE API BELOW. 

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

//KEPT THIS FUNCTION IN HERE JUST SO THE REST COULD RUN

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
// ***ESSENTIALLY JUST MADE ALL THE PROPERTIES GET COLORED GREEN
// SINCE THE FUNCTION ABOVE DID NOT RELATE TO THE PARKS GEOJSON 
// EVERYTHING IS VIRTUALLY GETTING COLORED as an "ELSE".

// function that fills polygons with color based on the data
function fillColorPercentage(d) {
    return d > 9 ? '#006d2c' :
                   '#228B22';
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
var acsOnEachFeature = function(feature,layer){
    var calc = calculatePercentage(feature);

    // let's bind some feature properties to a pop up with an .on("click", ...) command. We do this so we can fire it both on and off the map
    layer.on("click", function (e) {
        var bounds = layer.getBounds();
        var popupContent = "<strong>Park Name: </strong> " + feature.properties.GISPROPNUM;
        popup.setLatLng(bounds.getCenter());
        popup.setContent(popupContent);
        map.openPopup(popup);
    });

    // we'll now add an ID to each layer so we can fire the popup outside of the map
    layer._leaflet_id = 'acsLayerID' + count;
    count++;

}


function createLayerControls(){
    // add in layer controls
    var baseMaps = {
        "CartoDB Basemap": CartoDBTiles,
    };

    var overlayMaps = {
        "Park Name": ParksPropertiesGeoJSON,
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);
    
}


//NO LEGEND AT THE MOMENT

// add in a legend to make sense of it all
// create a container for the legend and set the location

//var legend = L.control({position: 'bottomright'});

// using a function, create a div element for the legend and return that div
//legend.onAdd = function (map) {

    // a method in Leaflet for creating new divs and setting classes
//    var div = L.DomUtil.create('div', 'legend'),
  //      amounts = [0, 1, 3, 5, 7, 9];

    //    div.innerHTML += '<p>Percentage Population<br />That Moved to US in<br />the Last Year</p>';

      //  for (var i = 0; i < amounts.length; i++) {
        //    div.innerHTML +=
            //    '<i style="background:' + fillColorPercentage(amounts[i] + 1) + '"></i> ' +
          //      amounts[i] + (amounts[i + 1] ? '% &ndash;' + amounts[i + 1] + '%<br />' : '% +<br />');
      //  }
//
  //  return div;
// };


// add the legend to the map
//legend.addTo(map);



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
            return '<a href="#">' + d.properties.ACS_13_5YR_B07201_GEOdisplay_label + '</a>'; 
        })
        .on('click', function(d, i) {
            console.log(d.properties.ACS_13_5YR_B07201_HD02_VD01);
            console.log(i);
            var leafletId = 'acsLayerID' + i;
            map._layers[leafletId].fire('click');
        });


}

// THIS PART OF THE ASSIGNMENT WENT MUCH SMOOTHER

// This is where we add the API data
// Setting a global variable here, helps us the D3 scale below
// use jQuery geoJSON to grab data from API, ***have to figure out where to get the access token, right now I am using JD's.
// I pulled data for the Department of Parks & Rec (DPR) for the entire city, but since it limits it a 1000, the data doesn't overwhelm the computer.
$.getJSON( "https://data.cityofnewyork.us/resource/fhrw-4uyv.json?$$app_token=rQIMJbYqnCnhVM9XNPHE9tj0g&agency=DPR", function( data ) {
    var dataset = data;
    // draw the dataset on the map
    plotAPIData(dataset);

});

// creating a leaflet layer group out of the API points allows us to add the API points to the map. I think we read the lat long below when we create the latlng variable
var apiLayerGroup = L.layerGroup();

// since these data are not geoJson, we have to build our dots from the data by hand (similar to adding XY data to a csv or xls in GIS)
function plotAPIData(dataset) {
    // keeping this for now because the polygon struggles took forever; for the final project, I need to figure out how to specifically clasify the different categories
    var ordinalScale = setUpD3Scale(dataset);

    // loop through each object in the dataset and create a circle marker for each one using a jQuery for each loop
    $.each(dataset, function( index, value ) {

        // check to see if lat or lon is undefined or null
        if ((typeof value.latitude !== "undefined" || typeof value.longitude !== "undefined") || (value.latitude && value.longitude)) {
            // create a leaflet lat lon object to use in L.circleMarker
            var latlng = L.latLng(value.latitude, value.longitude);
     
            //using the ordinal scale function to color the points based on complaint type.

            var apiMarker = L.circleMarker(latlng, {
                stroke: false,
                fillColor: ordinalScale(value.complaint_type),
                fillOpacity: 1,
                radius: 3
            });

            // creating the popup below using assignment 2, listing complaint type and its description
            apiMarker.bindPopup("<strong>Complaint Type: " + value.complaint_type + "<br /><strong>Description: </strong>" + value.descriptor);
            // add the points to the layer group
            apiLayerGroup.addLayer(apiMarker);

        }

    });
// adding the layer group to the map
    apiLayerGroup.addTo(map);

}

//set up the ordinal function below

function setUpD3Scale(dataset) {
    console.log(dataset);
    // to create a unique list of complaint type, we first we need to create an array of them, which I'm guessing is done by creating a new var and saying it = []  
    var complaint_type = [];

    // looping through the complaint types and adding them to their array, which we just created above
    $.each(dataset, function( index, value ) {
        complaint_type.push(value.complaint_type);
    });

    // use underscore to create a unique array <--- follow-up on the need for an underscore?
    var complaint_typeUnique = _.uniq(complaint_type);

    // creating the D3 ordinal scale based on that unique array we created above and then returning it so it activates
    var ordinalScale = d3.scale.category10()
        .domain(complaint_typeUnique);

    return ordinalScale;

}