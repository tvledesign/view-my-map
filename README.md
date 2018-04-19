# View My Map

View My Map is a small online web app that accesses your Facebook profile's tagged places data. Simply put, it gathers all the places you've checked into on Facebook and spits it out onto a Google Map.

Live Demo: [https://viewmymap.com](https://viewmymap.com)

## APIs Used

- Facebook SDK for JavaScript [https://developers.facebook.com/docs/javascript](https://developers.facebook.com/docs/javascript)
- Google Maps JavaScript API [https://developers.google.com/maps/documentation/javascript/](https://developers.google.com/maps/documentation/javascript/)

## JavaScript Libraries Used

- jQuery [https://jquery.com/](https://jquery.com/)
- Moment.js [https://momentjs.com/](https://momentjs.com/)
- html2canvas [https://html2canvas.hertzen.com/](https://html2canvas.hertzen.com/)
- download.js [http://danml.com/download.html](http://danml.com/download.html)

## CSS Libraries Used

- Font Awesome [https://fontawesome.com/](https://fontawesome.com/)

## Setup

### Create Your Facebook App

Before you can use the web app the very first thing you need to do is setup your Facebook App to pull down information from the users Facebook profile.

You can do so by going to the following link [https://developers.facebook.com/](https://developers.facebook.com/).

Once your Facebook App is created, copy the App ID and go to js/main.js and edit line 1 where it says

```javascript
var appID = 'app id here';
```

Replace 'app id here' with your App ID number. Make sure you remove the single quotes as this field should contain only integers and not a string.

### Get Access to the Google Maps JavaScript API

Once your Facebook App has been configured and created the next thing you'd need to do is get access to the Google Maps JavaScript API. To do so go to [https://developers.google.com/maps/documentation/javascript/adding-a-google-map#key](https://developers.google.com/maps/documentation/javascript/adding-a-google-map#key) and follow the instructions to get your API key.

When you've finished setting up everything copy your API key and edit the following files

index.html on line 78 and map.html on line 71
```html
<script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap"></script>
```

Replace "YOUR_API_KEY" with the API key you've copied without the quotes. This would grant you access to the Google Maps JavaScript API which is needed to render the map.

### Replace Placeholder Links

Now that you've got both the Facebook and Google APIs set up the last thing you'd need to do is replace all the placeholder links. Simply replace "https://domain.com" with your domain at the following locations.

includes/get-map.php lines 7 and 9
```php
if(file_get_contents('https://domain.com/maps/' . $id . '.json')) {
    // return the json of the file
    $json = file_get_contents('https://domain.com/maps/' . $id . '.json');
    echo $json;
}
```

js/main.js line 144
```javascript
url: 'https://domain.com/includes/save-map.php',
```

js/main.js line 155
```javascript
$('#share-link').append('<p><a href="https://domain.com/map.html?id=' + data + '">https://domain.com/map.html?id=' + data + '</a></p>');
```

js/view.js line 251
```javascript
$('#share-link').append('<p><a href="https://domain.com/map.html?id=' + getUrlParameter('id') + '">https://domain.com/map.html?id=' + getUrlParameter('id') + '</a></p>');
```

js/view.js line 263
```javascript
url: 'https://domain.com/includes/get-map.php',
```
