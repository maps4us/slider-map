import "./style.css";

import { GoogleCharts } from 'google-charts';
import axios from 'axios';

let mapId = '';
let mapControlId = 'timeLineMapControl';
let dateControlId = 'timeLineDateControl';

export default function createMap() {
    mapId = arguments[0];
    if (arguments.length === 3) {
        mapControlId = arguments[1];
        dateControlId = arguments[2];

        // add classes
        const mapControlDiv = document.getElementById(mapControlId);
        mapControlDiv.className += " map-control";

        const dateControlDiv = document.getElementById(dateControlId);
        dateControlDiv.className += " date-control";
    } else {
        const parentDivId = arguments[1];

        // create elements
        const controlDiv = document.getElementById(parentDivId);

        const mapControlDiv = document.createElement('div');
        mapControlDiv.id = mapControlId;
        mapControlDiv.className = 'map-control';
        controlDiv.appendChild(mapControlDiv);

        const dateControlDiv = document.createElement('div');
        dateControlDiv.id = dateControlId;
        dateControlDiv.className = 'date-control';
        controlDiv.appendChild(dateControlDiv);
    }

    GoogleCharts.load(init, 'map');
}

function init() {
    axios.get(`https://mapsforall-96ddd.firebaseio.com/publishedMaps/${mapId}.json`).then((response => {
        const todayYear = new Date().getFullYear();

        if (response.data) {
            if (response.data.persons != null && response.data.persons.length > 0) {
                const data = convertResponseToDataTable(response, todayYear);
                const rangeMin = getMinYear(response, todayYear);

                let view = new GoogleCharts.api.visualization.DataView(data);
                view.setColumns([3, 4, 5]);

                const dateControl = getTimeControl(data, todayYear, rangeMin);
                const map = getMapControl();

                GoogleCharts.api.visualization.events.addListener(dateControl, 'ready', () => {
                    const state = dateControl.getState();
                    drawMap(map, data, view, state.lowValue, state.highValue);
                });

                GoogleCharts.api.visualization.events.addListener(dateControl, 'statechange', () => {
                    const state = dateControl.getState();
                    drawMap(map, data, view, state.lowValue, state.highValue);
                });

                dateControl.draw();
            } else {
                console.log('No person data');
            }
        } else {
            console.log('Map not found');
        }
    }));
}

function convertResponseToDataTable(response, todayYear) {
    const data = createDataTable();

    response.data.persons.forEach(person => data.addRow(createRow(person, todayYear)));

    data.addColumn('string', 'Desc');
    data.addColumn('date', 'startDate');
    const lenRows = data.getNumberOfRows();
    for (let i = 0; i < lenRows; i++) {
        data.setCell(i, 5, getContentForPerson(data, response.data.persons, i, todayYear));
        data.setCell(i, 6, new Date(data.getValue(i, 1), 0, 1));
    }

    data.addRow(['', 0, 0, 0, 0, '', new Date(todayYear, 0, 1)]);
    return data;
}

function createDataTable() {
    const data = new GoogleCharts.api.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('number', 'From');
    data.addColumn('number', 'To');
    data.addColumn('number', 'Lat');
    data.addColumn('number', 'Long');
    return data;
}

function createRow(person, todayYear) {
    const name = person.name;
    const from = parseInt(person.yearFrom);
    let to = parseInt(person.yearTo);
    if (to === undefined || to <= 0) {
        to = todayYear;
    }

    let lat = parseFloat(person.lat);
    if (isNaN(lat) && person.hasOwnProperty('generated') && person.generated.hasOwnProperty('lat')) {
        lat = parseFloat(person.generated.lat);
    }

    let lng = parseFloat(person.long);
    if (isNaN(lng) && person.hasOwnProperty('generated') && person.generated.hasOwnProperty('long')) {
        lng = parseFloat(person.generated.long);
    }

    return [name, from, to, lat, lng];
}

function getContentForPerson(data, people, i, todayYear) {
    const yearStr = (todayYear + 1).toString();

    let endYear = data.getValue(i, 2);
    if (endYear === yearStr || isNaN(endYear)) {
        endYear = 'present';
    }

    const person = people[i];
    let displayLocation = '';
    if (person.hasOwnProperty('generated') && person.generated.hasOwnProperty('location')) {
        displayLocation = person.generated.location;
    } else if (person.state.length > 0) {
        displayLocation = `${person.city}, ${person.state}, ${person.country}`;
    } else {
        displayLocation = `${person.city}, ${person.country}`;
    }
    return `<img src="http://216.92.159.135/tkfgen.png"><b> ${data.getValue(i, 0)}</b>
        <br>${displayLocation}<br>${data.getValue(i, 1)} - ${endYear}`;
}

function getMinYear(response, todayYear) {
    let rangeMin = todayYear;

    response.data.persons.forEach(person => {
        const from = parseInt(person.yearFrom);
        if (from < rangeMin) {
            rangeMin = from;
        }
    });

    return rangeMin;
}

function getTimeControl(data, todayYear, rangeMin) {
    return new GoogleCharts.api.visualization.ControlWrapper(
        {
            controlType: 'DateRangeFilter',
            containerId: dateControlId,
            dataTable: data,
            maxValue: new Date(todayYear + 50, 0, 1),
            minValue: new Date(rangeMin - 10, 0, 1),
            options:
            {
                filterColumnLabel: 'startDate',
                ui:
                {
                    'format': { 'pattern': 'yyyy' },
                    'label': ''
                }
            },
            state: {
                'lowValue': new Date(rangeMin - 10, 0, 1),
                'highValue': new Date(todayYear + 50, 0, 1)
            }
        });
}

function getMapControl() {
    const iconURL = 'http://216.92.159.135/';
    return new GoogleCharts.api.visualization.ChartWrapper({
        chartType: 'Map',
        containerId: mapControlId,
        options:
        {
            mapType: 'normal',
            showInfoWindow: true,
            zoomLevel: 3,
            icons: {
                default: {
                    normal: iconURL + 'Map-Marker-Ball-Pink-icon.png',
                    selected: iconURL + 'Map-Marker-Ball-Right-Pink-icon.png'
                }
            }
        }
    });
}

function drawMap(map, data, view, min, max) {
    const timelineStart = min.getFullYear();
    const timelineEnd = max.getFullYear();
    const rows = data.getFilteredRows([
        {
            column: 1,
            test: (personStart, row) => {
                const y = new Date(data.getValue(row, 2), 0, 1);
                const personEnd = y.getFullYear();
                return personStart <= timelineEnd && personEnd >= timelineStart;
            }
        }
    ]);

    view.setRows(rows);

    map.setDataTable(view);
    map.draw();
}
