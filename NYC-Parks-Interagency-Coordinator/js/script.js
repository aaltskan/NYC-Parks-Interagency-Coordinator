$(function() {
    
    var map = L.map('map').setView([40.7128,-74.0060], 11);

    // set a tile layer to be CartoDB tiles 
    var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
    attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    });

    // add these tiles to our map
    map.addLayer(CartoDBTiles);

    // create Global variables, to create layer controls below
    
    var PARKSDISTRICTS_PRMsGeoJSON;
    var NYCPARKSPROPERTIESGeoJSON;
    var GREENSTREETSGeoJSON;
    var INTERAGENCYPROJECTSGeoJSON;

//    
//ADD NYCPARKSDISTRICTS_PRMs
//

addPARKSDISTRICTS_PRMs();

function addPARKSDISTRICTS_PRMs(){
    
        $.getJSON( "data/JSON/WGS1984/PARKSDISTRICTS_PRMs.json", function( data ) {
            plotDatasetPARKSDISTRICTS_PRMs(data);
            addNYCPARKSPROPERTIES();
            
        });
    
        function plotDatasetPARKSDISTRICTS_PRMs (PARKSDISTRICTS_PRMs) {
            PARKSDISTRICTS_PRMsGeoJSON = L.geoJson(PARKSDISTRICTS_PRMs, {
                style: setMyStylePARKSDISTRICTS_PRMs,
                onEachFeature: bindMyPopupPARKSDISTRICTS_PRMs,
            }).addTo(map);
            console.log(PARKSDISTRICTS_PRMs, "PARKSDISTRICTS_PRMs");
        }
    
        function setMyStylePARKSDISTRICTS_PRMs(feature) {
            
            var style = {
                weight: .5,
                opacity: 1,
                fillOpacity: 0.15,
                dashArray: '4',
                //fillColor: styleFillColorPARKSDISTRICTS_PRMs(feature),
                fillColor: "#fdcc8a",
                color: "#c19700",
            }
            return style;
        }
    
        // function styleFillColorPARKSDISTRICTS_PRMs (feature) {
        //     var color;
        //     var d = feature.properties.BOROUGH;
            
        //     color = d == "B" ? '#f1eef6' :
        //             d == "M" ? '#bdc9e1' :
        //             d == "Q" ? '#74a9cf' :
        //             d == "R" ? '#2b8cbe' :
        //             d == "X" ? '#045a8d' :
        //                        'white';
        //     return color;
        // }

        function bindMyPopupPARKSDISTRICTS_PRMs(feature, layer) {
            layer.on("click", function (event) {
                $('#SideBar').html("<strong>District:</strong> " + feature.properties.SYSTEM + "<br /><strong>PRM:</strong> " + feature.properties.PRM + "<br /><strong>Community Board:</strong> " + feature.properties.COMMUNITYB + "<br /><strong>Council Districts:</strong> " + feature.properties.COUNCILDIS);});    
        }
    }

//    
//PARKS PROPERTIES
//

function addNYCPARKSPROPERTIES(){

    $.getJSON( "data/JSON/WGS1984/NYC_PARKS_PROPERTIES_WGS1984_20170927.json", function( data ) {
        plotDatasetNYCPARKSPROPERTIES(data);
        addGREENSTREETS();
    });

    function plotDatasetNYCPARKSPROPERTIES (NYCPARKSPROPERTIES) {
        NYCPARKSPROPERTIESGeoJSON = L.geoJson(NYCPARKSPROPERTIES, {
            style: setMyStyleNYCPARKSPROPERTIES,
            onEachFeature: bindMyPopupNYCPARKSPROPERTIES,
        }).addTo(map);
    }

    function setMyStyleNYCPARKSPROPERTIES(feature) {
        var style = {
            weight: .25,
            opacity: .75,
            color: '#006d2c',
            fillOpacity: 0.75,
            fillColor: styleFillColorNYCPARKSPROPERTIES(feature),
        }
        return style;
    }

    function styleFillColorNYCPARKSPROPERTIES (feature) {
        var color;
        var d = feature.properties.TYPECATEGO;
        color = d == "Jointly Operated Playground" ? '#3182bd' :
                           '#74c476';
        return color;
    }

    function bindMyPopupNYCPARKSPROPERTIES(feature, layer) {
        layer.on("click", function (event) {
            $('#SideBar').html(feature.properties.NAME311 + "<br /><strong>Park ID: </strong> " + feature.properties.GISPROPNUM + "<br /><strong>Parks District: </strong> " + feature.properties.DEPARTMENT + "<br /><strong>Link: </strong>" + '<a href=' + feature.properties.URL + ' target="_blank" > ' + feature.properties.URL + ' </a> ');
  
        });
      
    }
}
//    
//ADD GREENSTREETS
//

function addGREENSTREETS(){

    $.getJSON( "data/JSON/WGS1984/GREENSTREETS_WGS1984_20170802.json", function( data ) {
        plotDatasetGREENSTREETS(data);
        addINTERAGENCYPROJECTS();
    });

    function plotDatasetGREENSTREETS (GREENSTREETS) {
        GREENSTREETSGeoJSON = L.geoJson(GREENSTREETS, {
            style: setMyStyleGREENSTREETS,
            onEachFeature: bindMyPopupGREENSTREETS,
        }).addTo(map);   

    }

    function setMyStyleGREENSTREETS(feature) {
        
        var style = {
            weight: .25,
            opacity: .75,
            color: '#006d2c',
            fillOpacity: 0.75,
            fillColor: styleFillColorGREENSTREETS(feature),
        }
        return style;
    }

    function styleFillColorGREENSTREETS (feature) {
        var color;
        var d = feature.properties.SUBCATEGOR;
        
        color = d == "1" ? '#74c476' :
                d == "2" ? '#31a354' :
                           '#31a354';
        return color;
    }

    function bindMyPopupGREENSTREETS(feature, layer) {
        layer.on("click", function (event) {
            $('#SideBar').html(feature.properties.SITENAME + "<br /><strong>Park ID:</strong> " + feature.properties.GISPROPNUM + "<br /><strong>Parks District:</strong> " + feature.properties.DEPARTMENT + "<br /><strong>MOU:</strong> " + feature.properties.MOU);});    
    }

}

//
//ADD NYCDOT EXAMPLE
//

function addINTERAGENCYPROJECTS(){

    $.getJSON( "data/JSON/WGS1984/INTERAGENCYPROJECTS.json", function( data ) {
        plotDatasetINTERAGENCYPROJECTS(data);
    });

    function plotDatasetINTERAGENCYPROJECTS (INTERAGENCYPROJECTS) {
        INTERAGENCYPROJECTSGeoJSON = L.geoJson(INTERAGENCYPROJECTS, {
            pointToLayer: setMyStyleINTERAGENCYPROJECTS,
            onEachFeature: bindMyPopupINTERAGENCYPROJECTS,
        })
        
        .addTo(map);
        console.log(INTERAGENCYPROJECTS, "INTERAGENCYPROJECTS");
    }

    function setMyStyleINTERAGENCYPROJECTS(feature, latlng) {
                    var circle = L.circle(latlng, 250, {
                        stroke: 0,
                        weight: 1,
                        fillColor: styleFillColorINTERAGENCYPROJECTS(feature),
                        fillOpacity: 1,
                    });
            
                    return circle;
                }

    function styleFillColorINTERAGENCYPROJECTS (feature) {
        var color;
        var d = feature.properties.Current_Ph;
        
        color = d == "Pre-Design" ? '#2c7bb6' :
        color = d == "Design" ? '#92c5de' :
        color = d == "Permitting" ? '#fdae61' :
        color = d == "Construction" ? '#d7191c' :
        color = d == "Final-Accepted (Closed Out)" ? '#018571' :
                           '#018571';

        return color;

    }

    function bindMyPopupINTERAGENCYPROJECTS(feature, layer) {
        layer.on("click", function (event) {
            $('#SideBar').html("<strong>Project ID: </strong> " + feature.properties.ProjectID + "<br /><strong>Project Name: </strong> " + feature.properties.ProjectNam + "<br /><strong>Agency: </strong> " + feature.properties.Agency + "<br /><strong>Current Phase: </strong> " + feature.properties.Current_Ph + "<br />" + '<a target="_blank" href =http://wss.parks.nycnet/InteragencyCoordination/Lists/MOSYS/Simple%20View.aspx> Look up Project Record in MOSYS</a>');});    
        }

        setUpListeners();

    }
    
    function setUpListeners() {
        $('#NYCPARKSPROPERTIESData').click(function(){
            if(map.hasLayer(NYCPARKSPROPERTIESGeoJSON)) {
                map.removeLayer(NYCPARKSPROPERTIESGeoJSON)
            } else {
                map.addLayer(NYCPARKSPROPERTIESGeoJSON);
            }
        });

        $('#GREENSTREETSData').click(function(){
            if(map.hasLayer(GREENSTREETSGeoJSON)) {
                map.removeLayer(GREENSTREETSGeoJSON)
            } else {
                map.addLayer(GREENSTREETSGeoJSON);
            }
        });

        $('#PARKSDISTRICTS_PRMsData').click(function(){
            if(map.hasLayer(PARKSDISTRICTS_PRMsGeoJSON)) {
                map.removeLayer(PARKSDISTRICTS_PRMsGeoJSON)
            } else {
                map.addLayer(PARKSDISTRICTS_PRMsGeoJSON);
            }
        });

        $('#INTERAGENCYPROJECTSData').click(function(){
            if(map.hasLayer(INTERAGENCYPROJECTSGeoJSON)) {
                map.removeLayer(INTERAGENCYPROJECTSGeoJSON)
            } else {
                map.addLayer(INTERAGENCYPROJECTSGeoJSON);
            }
        });
    }
});

//
// Capital Project Tracker
//    

// function addCapitalProjectTracker(){

//     var dotsGroupCapitalProjectTracker = L.featureGroup();
    
//     //var datasetCapitalProjectTracker;

//     $.getJSON( "data/JSON/DPR_CapitalProjectTracker_20171005.json", function( data ) {
//         datasetCapitalProjectTracker = data;

//         plotCapitalProjectTrackerDataset(data);
//         console.log(data)
//     });
    
//     function plotCapitalProjectTrackerDataset (CapitalProjectTracker) {
//         for (var index = 0; index < CapitalProjectTracker.length; index++) {
//             var d = CapitalProjectTracker[index];

//             var dot = new L.CircleMarker(
//                 [d.Locations.Location[0].Latitude,d.Locations.Location[0].Longitude],{
//                     radius: 5,
//                     color: 'white',
//                     weight: 0,
//                     fillColor: 'orange',
//                     fillOpacity: .75,
//                 }
//             )
//             .bindPopup("<strong>Tracker ID:</strong> " + d.TrackerID + "<br /><strong>Project:</strong> " + d.Title + "<br /><strong>Current Phase:</strong> " + d.CurrentPhase + "<br /><strong>Projected Completion:</strong> " + d.ConstructionProjectedCompletion);
//             // .on("click", function (event) {console.log(event)
//             //     $('#SideBar').html("<strong>Tracker ID:</strong> " + d.TrackerID + "<br /><strong>Project:</strong> " + d.Title + "<br /><strong>Current Phase:</strong> " + d.CurrentPhase + "<br /><strong>Projected Completion:</strong> " + d.ConstructionProjectedCompletion);
//             // });
            
//             dotsGroupCapitalProjectTracker.addLayer(dot);            
//         }
//         dotsGroupCapitalProjectTracker.addTo(map);
//     }
                  
//     function bindMyPopupCapitalProjectTracker(feature, layer) {
//         layer.on("click", function (event) {
//             $('#SideBar').html("<strong>Tracker ID:</strong> " + d.TrackerID + "<br /><strong>Project:</strong> " + d.Title + "<br /><strong>Current Phase:</strong> " + d.CurrentPhase + "<br /><strong>Projected Completion:</strong> " + d.ConstructionProjectedCompletion);});    
//         }
        
//         setUpListeners();
//     }
    
    // function loadPointData() {

    //     $.getJSON( "data/JSON/DPR_CapitalProjectTracker_20171005.json", function( data ) {
    //         CapitalProjectTrackerGeoJSON = L.geoJson(data, {
    //             pointToLayer: makeCircleMarker,
    //         })

    //         .addTo(map);
            
    //         function makeCircleMarker(feature, latlng) {
    //             var circle = L.circle(latlng, 25, {
    //                 stroke: 1,
    //                 color: 'blue',
    //                 weight: 1,
    //                 fillColor: 'blue',
    //                 fillOpacity: 1
    //             });
        
    //             return circle;
    //         }
            
    //     });
    // }