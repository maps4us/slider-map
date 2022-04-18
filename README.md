# Slider Map

To add the slider map component to your website (after setting up your account on maps for all):

## Installation
###  Browser

Import the component by adding a src tag in the header (```<head>```):

```html
<script src="https://unpkg.com/slider-map">
```

###  Node

Install the slider map package using NPM

```bash
npm install --save slider-map
```

## Usage
###  Browser

You can create one parent element for the whole component or create div elements for the map and slider on your HTML page:

```html
<div id="slidermapid"></div>
```
or 

```html
<div id="mapid"></div>
<div id="controlid"></div>
```


In the scripts section of your HTLM page, create the slider map component passing your map id and either the slider map id or the id's of the map and slider elements
```html
<script>
  const map = new SliderMap('your-maps-id-goes-here', 'slidermapid');
  map.create();
</script>
```

or

```html
<script>
  const map = new SliderMap('your-maps-id-goes-here', 'mapid', 'controlid');
  map.create();
</script>
```

###  Node

You can create one parent element for the whole component or create div elements for the map and slider on your HTML page:

```html
<div id="slidermapid"></div>
```
or 

```html
<div id="mapid"></div>
<div id="controlid"></div>
```


In your javascript, create the slider map component passing your map id and either the slider map id or the id's of the map and slider elements
```javascript
import {SliderMap} from 'slider-map';
const map = new SliderMap('your-maps-id-goes-here', 'slidermapid');
```

or


```javascript
import {SliderMap} from 'slider-map';
const map = new SliderMap('your-id-goes-here', 'mapid', 'controlid');
map.create();
```

### Meta Data

You can get map meta data by adding a listener callback to the map component.

```javascript
const map = new SliderMap('your-maps-id-goes-here', 'slidermapid');
map.addListener("metaData", metaData => {
   console.log(metaData.title);
   console.log(metaData.pin);
   console.log(metaData.description);
   console.log(metaData.link);
   console.log(metaData.markerType);
});
```

### Markers

You can get the currently displayed markers by adding a listener callback to the map component which will return an array of markers in the slider range.

```javascript
const map = new SliderMap('your-maps-id-goes-here', 'slidermapid');
map.addListener("update", markers => {
   console.log(markers[0].name);
   console.log(markers[0].displayData);
   console.log(markers[0].displayLocation);
});
```

You can zoom to a marker by passing it to the select() method:

```javascript
const map = new SliderMap('your-maps-id-goes-here', 'slidermapid');
let markers = [];
map.addListener("update", (this.markers = markers));

...

map.select(markers[0]);
```
