import "./style.css";

import { GoogleCharts } from 'google-charts';

let _mapId = ''; // eslint-disable-line no-unused-vars
let _mapControlId = '';
let _dateControlId = '';

export default function createMap(mapId, mapControlId, dateControlId) {
    _mapId = mapId;
    _mapControlId = mapControlId;
    _dateControlId = dateControlId;

    const mapControlDiv = document.getElementById(_mapControlId);
    mapControlDiv.className += " map-control";

    const dateControlDiv = document.getElementById(_dateControlId);
    dateControlDiv.className += " date-control";

    // Load the charts library with a callback
    GoogleCharts.load(init, 'map');
}

function init() {
    const todayYear = new Date().getFullYear();

    const response = [
        {
            "name": "mike", "yearFrom": "1970", "yearTo": '2011', "lat": "47.6", "long": "-122.3"
        },
        {
            "name": "mike1", "yearFrom": "1952", "yearTo": '1992', "lat": "40.6", "long": "-122.3"
        },
        {
            "name": "mike2", "yearFrom": "1932", "yearTo": '1982', "lat": "37.6", "long": "-122.3"
        },
        {
            "name": "mike3", "yearFrom": "1972", "yearTo": '1980', "lat": "30.6", "long": "-122.3"
        }
    ];

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
}

function convertResponseToDataTable(response, todayYear) {
    const data = createDataTable();

    response.forEach(person => data.addRow(createRow(person)));

    data.addColumn('string', 'Desc');
    data.addColumn('date', 'startDate');
    const lenRows = data.getNumberOfRows();
    for (let i = 0; i < lenRows; i++) {
        data.setCell(i, 5, getContentForPerson(data, i, todayYear));
        data.setCell(i, 6, new Date(data.getValue(i, 1), 0, 1));
    }

    data.setCell(lenRows - 1, 6, new Date(todayYear, 0, 1));
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
    const lat = parseFloat(person.lat);
    const lng = parseFloat(person.long);
    if (to <= 0) {
        to = todayYear;
    }
    return [name, from, to, lat, lng];
}

function getContentForPerson(data, i, todayYear) {
    const yearStr = (todayYear + 1).toString();

    let endYear = data.getValue(i, 2);
    if (endYear === yearStr || isNaN(endYear)) {
        endYear = 'present';
    }
    return `<img src="http://216.92.159.135/tkfgen.png"><b> ${data.getValue(i, 0)}</b>
        <br>place<br>${data.getValue(i, 1)} - ${endYear}`;
}

function getMinYear(response, todayYear) {
    let rangeMin = todayYear;

    response.forEach(person => {
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
            containerId: _dateControlId,
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
        containerId: _mapControlId,
        options:
        {
            height: 450,
            width: 900,
            mapType: 'normal',
            showTip: true,
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
    const minY = min.getFullYear();
    const maxY = max.getFullYear();
    const rows = data.getFilteredRows([
        {
            column: 1,
            test: function (value, row) {
                const y = new Date(data.getValue(row, 2), 0, 1);
                const yY = y.getFullYear();
                return !((value > maxY) || (yY < minY));
            }
        }
    ]);

    view.setRows(rows);

    map.setDataTable(view);
    map.draw();
}
