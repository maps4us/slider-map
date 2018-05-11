To add to your the timeline map component to your website (after setting up your account on maps for all):

####  Browser

Import the component by adding a src tag in the header (```<head>```):

```html
<script src="https://unpkg.com/timeline-map">
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
  const map = new TimeLineMap('your-id-goes-here', 'mapid', 'controlid');
  map.create();
</script>
```
If you are using different ids, pass them here

####  Node

Install the timeline map package using NPM
```
npm install --save timeline-map
```

Create elements in page:
```html
<div id="mapid"></div>
<div id="controlid"></div>
```
You can set your own ids for the elements

And then running:
```javascript
import {TimeLineMap} from 'timeline-map';
const map = new TimeLineMap('your-id-goes-here', 'mapid', 'controlid');
map.create();
```
If you are using different ids, pass them here
