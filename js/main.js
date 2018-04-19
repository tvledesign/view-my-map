var appID = 'app id here';
var versionNum = 'v2.12';
var map;
var userID;
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
        }
    }
}

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

// if the share button is clicked on
$('a.share-icon').on('click', function(e) {
    e.preventDefault();
    $('.overlay').css('opacity', '0.75').show();
    // if sharing is false
    if(!shared) {
        $('main .loading').show();

        // perform an ajax call to our script 
        // and pass in our data to get saved
        $.ajax({
            type: 'POST',
            url: 'https://domain.com/includes/save-map.php',
            data: {
                object: JSON.stringify(places)
            },
            success: function (data) {
                // if a success message is returned
                if(data != 'Error') {
                    // show the share box with the link
                    $('main .loading').hide();
                    $('#share-link').html(null);
                    $('#share-link').append('<p>To share this map copy the URL below.</p>');
                    $('#share-link').append('<p><a href="https://domain.com/map.html?id=' + data + '">https://domain.com/map.html?id=' + data + '</a></p>');
                    $('#share-link').show();
                    shared = true;
                } else {
                    $('main .loading').hide();
                    $('#share-link').html(null);
                    $('#share-link').append('<p>There has been an issue generating your map. Please try again later.</p>');
                    $('#share-link').show();
                }
            },
            error: function (err) {
                $('main .loading').hide();
                $('#share-link').html(null);
                $('#share-link').append('<p>There has been an issue generating your map. Please try again later.</p>');
                $('#share-link').show();
            }
        });
    } else {
        // else if a shared link is already generated
        // just show the share box again
        $('#share-link').show();
    }
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

// get the next page of our data
function GetNextPage(url) {
    // get the json data from the url we 
    // passed through as the parameter
    $.getJSON(url, function (response) {
        // if the length of the data is greater than 0
        if (response.data.length > 0) {
            // push that data into our places object
            places.push(response.data);
            // if there is a next page
            if (response.paging.next != undefined) {
                // run this function again with the new url
                GetNextPage(response.paging.next);
            } else {
                // print out our locations
                PrintLocations();
            }
        } else {
            // print out our locations
            PrintLocations();
        }
    });
}

// initalize the Facebook sdk
function initFB() {
    window.fbAsyncInit = function () {
        FB.init({
            appId: appID,
            autoLogAppEvents: true,
            xfbml: true,
            version: versionNum
        });
    };

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {
            return;
        }
        js = d.createElement(s);
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}

// run the Facebook API to get the locations
function GetFBLocations() {
    FB.api("/" + userID + "/tagged_places", function (response) {
        if (response && !response.error) {
            // if there is data returned 
            if(response.data != undefined && response.data[0] != undefined) {
                // push the current response data into 
                // our object and go to the next page
                places.push(response.data);

                // if there is a next page
                if(response.paging.next != undefined)
                    GetNextPage(response.paging.next);
                else
                    // print out our locations
                    PrintLocations();
            } else {
                // hide all loading screens
                $('.loading').hide();

                // fade out the overlay
                $('.overlay').fadeOut();

                // inform the user they have no checked in data
                $('#places-list .msg-before-auth').text('Uh-oh.. it looks like you have no checked-in data to pull from.');
                $('#places-list .msg-before-auth').show();
            }
        }
    });
}

// if the grant permission button is clicked on
$('.authorize-btn').on('click', function (e) {
    // request access
    FB.login(function (response) {
        if (response.authResponse) {
            // get the login status
            FB.getLoginStatus(function (response) {
                if (response.status === 'connected') {
                    // set the id
                    userID = response.authResponse.userID;
                    // run the Facebook API to get the locations
                    GetFBLocations();
                    // hide the grant permission box
                    $('.msg-before-auth').hide();
                    $('.loading').show();
                } else if (response.status === 'not_authorized') {
                    // the user needs to authorize their account 
                    // before they can continue
                    $('#login p').html('There has been an error authorizing your account. Please try again.');
                } else {
                    // inform the user they must be
                    // logged into Facebook
                    $('#login p').html('You must be logged into Facebook in order to proceed.');
                }
            });
        } else {
            // the user needs to authorize their account 
            // before they can continue
            $('#login p').html('There has been an error authorizing your account. Please try again.');
        }
    }, {
        scope: 'user_tagged_places'
    });
});

// when our document has rendered
$(document).ready(function () {

    // initalize the facebook sdk
    initFB();

});
