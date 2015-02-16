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

// Global regular object for data structures needed for the app

var regular =  {
    shoppinglist: [], // Current beer-id:s in shopping list
    allbeers: {}, // This will get downloaded as soon the page loads
};


// Object definitions

//Useful for avoiding putting in user and pw each time
function Payload() { // Hardcoded username and password
    'use strict';
    this.username = 'jorass'; /////////// Insert username here
    this.password = 'jorass'; /////////// Insert password here
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
                ui_addBeer(beerobject.namn, beerobject.beer_id);
                regular.allbeers[beerobject.beer_id] = beerobject;
                //console.log('stop here');
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


// Functions that only manipulate ui  //

function ui_addBeer(beer, beer_id) {
    'use strict';
    var beertable = $('#beerlist');

    beertable.append('<tr class="beeritem" id="' + beer_id + '"><td>' + beer + '</td></tr>'); // Not elegant to write this way
}


function ui_removeShoppingListItem(beer_id) {
    'use strict';
    console.log("hello there");
    //$('#' + 'shopping' + beer_id).remove();
    var elem = $('#' + beer_id);
    console.log("elem:");
    console.log(elem);
    elem.remove();
}

function ui_addShoppingListItem(beer_id, beername, currentamount, increaseNumber, stprice) {
    'use strict';

    if (increaseNumber === true) {
        var shopitem = $('#shopping' + beer_id);
        var badgetd = shopitem.children().eq(1).children().first(); // Get the <span> element that is the badge
        console.log("did we find?");
        console.log(badgetd);
        badgetd.text(currentamount);
        var pricetd = shopitem.children().eq(2).first();
        pricetd.text(stprice * currentamount);
    } else {
        var shoppingtable = $('#shoppinglist');
        shoppingtable.append('<tr class="beeritem" id="' + 'shopping' + beer_id + '"><td>' + beername + '</td><td><span class="badge"></span><td>' + stprice + '</td></tr>');

    }
}

// Sets the total price in the shopping cart
function ui_setTotalAmount(total) {
    'use strict';
    $('#totalprice').text(total);
}


// Functions that provide the core functionality //


function addShoppingListItem(beer_id) {
    'use strict';
    var beer_name = regular.allbeers[beer_id].namn;
    var currentamount = 1;
    var increaseNumber = false;
    if (beer_id in regular.shoppinglist) {
        console.log("we're here: ");
        console.log(regular.shoppinglist[beer_id]);
        currentamount = regular.shoppinglist[beer_id] + 1;
        regular.shoppinglist[beer_id] = currentamount;
        increaseNumber = true;
    } else {
        regular.shoppinglist[beer_id] = 1;
    }

    console.log("Namn: " + beer_name + " and amount: " + currentamount);
    var stprice = regular.allbeers[beer_id].price;
    console.log(stprice); //Change to pubprice
    ui_addShoppingListItem(beer_id, regular.allbeers[beer_id].namn, currentamount, increaseNumber, stprice);
    ui_setTotalAmount(calculateTotal());
}


function removeShoppingListItem(beer_id) {
    'use strict';
    delete regular.shoppinglist[beer_id.split('shopping')[1]];
    ui_removeShoppingListItem(beer_id);
    ui_setTotalAmount(calculateTotal());
}

// Calculate total amount for items in shopping list.
function calculateTotal() {
    var totalamount = 0;
    for (var beer in regular.shoppinglist) {
        if (regular.shoppinglist.hasOwnProperty(beer)) {
            numberofbeers = regular.shoppinglist[beer];
            totalamount = totalamount + regular.allbeers[beer].price*numberofbeers; // Add the price to the total
        }
    }
    console.log("total is now: " + totalamount);
    return totalamount;
}

// Main function, runs when site loads
function runAll() {
    'use strict';
    console.log('It is live!');

    regular.allbeers = {}; // Set up allbeers, this might be unnecessary

    // Set up what will happen when we click on a beer in the list
    $("#beerlist").on("click", "tr", function () {
        var beer_id = $(this).attr('id');
        console.log("Beer item " + beer_id + " clicked.");
        addShoppingListItem(beer_id);
    });

    $("#shoppinglist").on("click", "tr", function () {
        var beer_id = $(this).attr('id');
        console.log("Beer item to be removed " + beer_id + " clicked.");
        removeShoppingListItem(beer_id);
    });

    //api_getBeer(1);
    //api_getUserBalance();
    api_getAllBeverages();
}