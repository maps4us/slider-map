# Slider Map

To add to your the slider map component to your website (after setting up your account on maps for all):

##  Browser

Import the component by adding a src tag in the header (```<head>```):

```html
<script src="https://unpkg.com/slider-map">
```

Create elements in page:

```html
<div id="mapid"></div>
<div id="controlid"></div>
```

You can set your own ids for the elements

And then running in the script section:

```html
<script>
  const map = new SliderMap('your-id-goes-here', 'mapid', 'controlid');
  map.create();
</script>
```

If you are using different ids, pass them here

##  Node

Install the slider map package using NPM

```bash
npm install --save slider-map
```

Create elements in page:

```html
<div id="mapid"></div>
<div id="controlid"></div>
```

You can set your own ids for the elements

And then running:

```javascript
import {SliderMap} from 'slider-map';
const map = new SliderMap('your-id-goes-here', 'mapid', 'controlid');
map.create();
```

If you are using different ids, pass them here
