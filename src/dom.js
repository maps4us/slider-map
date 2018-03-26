export function addClasses(mapControlId, dateControlId) {
    const mapControlDiv = document.getElementById(mapControlId);
    mapControlDiv.className += ' map-control';

    const dateControlDiv = document.getElementById(dateControlId);
    dateControlDiv.className += ' date-control';
}

export function createControlDivs(parentDivId, mapControlId, dateControlId) {
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

export function ensureMapHeight(mapControlId) {
    if (document.getElementById(mapControlId).offsetHeight === 0) {
        document.getElementById(mapControlId).style.height = '400px';
    }
}
