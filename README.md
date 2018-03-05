To add to your the timeline map component to your website (after setting up your account on maps for all):

####  Browser

FORMAT CODE CORRECTLY

Import the component by adding a src tag in the header (<head>):
`<script src="https://unpkg.com/timeline-map@0.0.7/dist/TimeLineMap.js">`

Create elements in page:
`<div id="mapid"></div>`
`<div id="controlid"></div>`
<small class="text-muted">You can set your own ids for the elements</small>

And then running in the script section:
`<script>`
`  TimeLineMap.createMap("your-id-goes-here", "mapid", "controlid");`
`</script>`
<small class="text-muted">If you are using different ids, pass them here</small>

[JSFiddle Example](https://jsfiddle.net/MapsForAll/0jesrys8/)

####  Node

Install the timeline map package using NPM
`npm install --save timeline-map`

Create elements in page:
`<div id="mapid"></div>`
`<div id="controlid"></div>`
<small class="text-muted">You can set your own ids for the elements</small>

And then running:
`import {createMap} from 'timeline-map';`
`createMap("your-id-goes-here", "mapid", "controlid");`
<small class="text-muted">If you are using different ids, pass them here</small>
