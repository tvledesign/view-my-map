var map;
var places = [];
var totalCount = 0;
var currentCount = 0;
var currentPage = 0;
var shared = false;

// initialize our google map
function initMap() {
    var usa = {
        lat: 37.09024,
        lng: -95.712891
    };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: usa
    });
}

// print out our locations
function PrintLocations() {
    // create a temporary variable
    // to count the elements we add
    var appendCount = 0;

    // for each object inside places
    for (var i = 0; i < places.length; i++) {
        // for each object inside the place's object
        for (var x = 0; x < places[i].length; x++) {
            // create strings to hold our address 
            // and output
            var address = '';
            var htmlOutput = '';

            // if the location is not undefined
            // then set the address based on the 
            // available parameters
            if (places[i][x].place.location != undefined) {
                if (places[i][x].place.location.street != undefined) 
                    address += places[i][x].place.location.street + ', ';
                if (places[i][x].place.location.city != undefined) 
                    address += places[i][x].place.location.city + ' ';
                if (places[i][x].place.location.state != undefined) 
                    address += places[i][x].place.location.state + ' ';
                if (places[i][x].place.location.zip != undefined) 
                    address += places[i][x].place.location.zip + ' ';
                if (places[i][x].place.location.country != undefined)
                    address += places[i][x].place.location.country;

                // add a marker to the map for that address 
                // based on its latitude and longitude values 
                var marker = new google.maps.Marker({
                    position: {
                        lat: places[i][x].place.location.latitude,
                        lng: places[i][x].place.location.longitude
                    },
                    map: map
                });

                // increase the total count
                totalCount++;

                // create an html output with the opening tag 
                // article and add in it's coordinates
                htmlOutput += '<article class="place" data-lat="' + places[i][x].place.location.latitude + '" data-lng="' + places[i][x].place.location.longitude + '">';
            } else {
                // else if no coordinates are available
                // then just output the opening article tag
                htmlOutput += '<article class="place">';
            }

            // if the address is blank then set
            // it to a placeholder default
            if (address == '') 
                address = 'No Address Found';
            
            // create the rest of our html output
            // which contains the name, location and date
            htmlOutput += '<div class="inner-container">';
            htmlOutput += '<h3>' + places[i][x].place.name + '</h3>';
            htmlOutput += '<p class="address">' + address + '</p>';
            htmlOutput += '<p class="footer">' + moment(new Date(places[i][x].created_time)).format('ddd MMM DD YYYY h:mm A UTC Z') + '</p>';
            htmlOutput += '</div>';
            htmlOutput += '</article>';

            // if the append count has not reached 
            // the max length of the current array
            if(appendCount < places[currentPage].length) {
                // append the html element
                $('#places-list').append(htmlOutput);
                // increase append count
                appendCount++;
                // increase the current count
                currentCount++;
            }

            // display the total count
            // of checked-in places
            $('span.count').text(totalCount);

            // hide all loading screens
            $('.loading').hide();

            // center the map on the very first location
            map.setCenter(new google.maps.LatLng(places[0][0].place.location.latitude, places[0][0].place.location.longitude));
        
            // fade out the overlay
            $('.overlay').fadeOut();

            // show share icons
            $('.icons').show();

            // shared is set by default
            shared = true;
        }
    }
}

// get parameter from url
// wonderful solution by Virendra
// from http://www.jquerybyexample.net/2012/06/get-url-parameters-using-jquery.html
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

// if the screenshot button is clicked on
$('a.screenshot-icon').on('click', function(e) {
    e.preventDefault();
    // download a screenshot of the map
    html2canvas($('#map'), {
        useCORS: true,
        onrendered: function(canvas) {
            var data = canvas.toDataURL('image/png');
            download(data, 'view-my-map.png', 'image/png');
        }
    });
});

// if the overlay is clicked on
$('.overlay').on('click', function(e) {
    //if a shared link is already generated
    if(shared) {
        // hide the overlay and shared modal
        $('.overlay').hide();
        $('#share-link').hide();
    }
});

// when the user scrolls to the bottom of the checked-in list
$('#places-list').scroll(function () {
    if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
        // if the prepend count is less than the count 
        if(currentCount < totalCount + 1) {
            // show the loading icon
            $('#places-list .loading').addClass('active');

            // create a temporary variable
            // to count the elements we add
            var appendCount = 0;

            // increment current page
            currentPage++;

            // for each object inside the place's object
            for (var x = 0; x < places[currentPage].length; x++) {
                // create strings to hold our address 
                // and output
                var address = '';
                var htmlOutput = '';

                // if the location is not undefined
                // then set the address based on the 
                // available parameters
                if (places[currentPage][x].place.location != undefined) {
                    if (places[currentPage][x].place.location.street != undefined) 
                        address += places[currentPage][x].place.location.street + ', ';
                    if (places[currentPage][x].place.location.city != undefined) 
                        address += places[currentPage][x].place.location.city + ' ';
                    if (places[currentPage][x].place.location.state != undefined) 
                        address += places[currentPage][x].place.location.state + ' ';
                    if (places[currentPage][x].place.location.zip != undefined) 
                        address += places[currentPage][x].place.location.zip + ' ';
                    if (places[currentPage][x].place.location.country != undefined)
                        address += places[currentPage][x].place.location.country;

                    // create an html output with the opening tag 
                    // article and add in it's coordinates
                    htmlOutput += '<article class="place" data-lat="' + places[currentPage][x].place.location.latitude + '" data-lng="' + places[currentPage][x].place.location.longitude + '">';
                } else {
                    // else if no coordinates are available
                    // then just output the opening article tag
                    htmlOutput += '<article class="place">';
                }

                // if the address is blank then set
                // it to a placeholder default
                if (address == '') 
                    address = 'No Address Found';
                
                // create the rest of our html output
                // which contains the name, location and date
                htmlOutput += '<div class="inner-container">';
                htmlOutput += '<h3>' + places[currentPage][x].place.name + '</h3>';
                htmlOutput += '<p class="address">' + address + '</p>';
                htmlOutput += '<p class="footer">' + moment(new Date(places[currentPage][x].created_time)).format('ddd MMM DD YYYY h:mm A UTC Z') + '</p>';
                htmlOutput += '</div>';
                htmlOutput += '</article>';

                // if the append count has not reached 
                // the max length of the current array
                if(appendCount < places[currentPage].length) {
                    // append the html element
                    $('#places-list').append(htmlOutput);
                    // increase append count
                    appendCount++;
                    // increase the current count
                    currentCount++;
                }

                // hide the loading screen
                $('#places-list .loading').removeClass('active');
            }
        }
    }
});

// if a place is clicked on
// center the map on those coordinates
$('body').on('click', '.place', function(e) {
    map.setCenter(new google.maps.LatLng($(this).attr('data-lat'), $(this).attr('data-lng')));
});

// if the share button is clicked on
$('a.share-icon').on('click', function(e) {
    // show the share modal with link
    e.preventDefault();
    $('.overlay').css('opacity', '0.75').show();
    $('#share-link').html(null);
    $('#share-link').append('<p>To share this map copy the URL below.</p>');
    $('#share-link').append('<p><a href="https://domain.com/map.html?id=' + getUrlParameter('id') + '">https://domain.com/map.html?id=' + getUrlParameter('id') + '</a></p>');
    $('#share-link').show();
});

// when our document has rendered
$(document).ready(function () {

    // if there is an id parameter in the url
    if(getUrlParameter('id')) {
        // perform an ajax call to get our map data
        $.ajax({
            type: 'POST',
            url: 'https://domain.com/includes/get-map.php',
            data: {
                id: getUrlParameter('id')
            },
            success: function (data) {
                // if a success message is returned
                if(data != 'Error') {
                    // set the places and print the location
                    places = JSON.parse(data);
                    PrintLocations();
                } else {
                    $('.loading').hide();
                    $('#share-link').html(null);
                    $('#share-link').append('<p>You are trying to access a map that does not exist.</p>');
                    $('#share-link').show();
                }
            },
            error: function (err) {
                $('.loading').hide();
                $('#share-link').html(null);
                $('#share-link').append('<p>There has been an issue pulling up this map. Please try again.</p>');
                $('#share-link').show();
            }
        });
    }
});