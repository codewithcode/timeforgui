/******************

Index of functions:

api_*   -   retrieves data from the api
ui_*    -   manipulates the user interface only
runAll  -   main function. gets called when document loads

******************/

// Global settings object

var settings = { // Various settings
    timelimit: 60,
    beerspeed: 4,
    URL: "http://pub.jamaica-inn.net/fpdb/api.php"
};

// Object definitions

//Useful for avoiding putting in user and pw each time
function Payload() { // Hardcoded username and password
    'use strict';
    this.username = ''; /////////// Insert username here
    this.password = ''; /////////// Insert password here
}


// Functions for the course ajax api

function api_getAllBeverages() {
    'use strict';
    var payload = new Payload();
    payload.action = "inventory_get";
    $.get(settings.URL, payload, function (data) {
        console.log("Got inventory.");
        console.log(data.payload[0]);
        console.log(data);
        $.each(data.payload, function (index, beerobject) {
            console.log(beerobject);
            if (beerobject.namn) {
                ui_addBeer(beerobject.namn);
            }
    
        });
    });
}

function api_getUserBalance() {
    'use strict';
    var payload = new Payload();
    payload.action = "iou_get";
    $.get(settings.URL, payload, function (data) {
            console.log("api_getUserBalance has returned with results.");
            console.log(data.payload[0]);
    });
}

function api_getBeer(beer_id) {
    var payload = new Payload();
    payload.action = "beer_data_get";
    payload.beer_id = beer_id;
    $.get(settings.URL, payload, function (data) {
            console.log("api_getBeer has returned with results.");
            console.log(data.payload[0]);
    });
}


// Functions that only manipulate ui
function ui_addBeer(beer) {
    var beertable = $('#beerlist');
    beertable.append('<tr><td>' + beer + '</td></tr>'); // Not elegant to write this way
}

// Main function, runs when site loads
function runAll() {
    'use strict';
    console.log('It is live!');

    //api_getBeer(1);
    //api_getUserBalance();
    api_getAllBeverages();
}