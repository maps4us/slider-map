export function addClasses(mapControlId: string, dateControlId: string): void {
    const mapControlDiv = document.getElementById(mapControlId);
    if (mapControlDiv != null) {
        mapControlDiv.className += ' map-control';
    }

    const dateControlDiv = document.getElementById(dateControlId);
    if (dateControlDiv != null) {
        dateControlDiv.className += ' date-control';
    }
}

export function createControlDivs(parentDivId: string, mapControlId: string, dateControlId: string): void {
    const controlDiv = document.getElementById(parentDivId);
    if (controlDiv != null) {
        const mapControlDiv: HTMLElement = document.createElement('div');
        mapControlDiv.id = mapControlId;
        mapControlDiv.className = 'map-control';
        controlDiv.appendChild(mapControlDiv);

        const dateControlDiv: HTMLElement = document.createElement('div');
        dateControlDiv.id = dateControlId;
        dateControlDiv.className = 'date-control';
        controlDiv.appendChild(dateControlDiv);
    }
}

export function ensureMapHeight(mapControlId: string): void {
    const mapControlDiv = document.getElementById(mapControlId);
    if (mapControlDiv != null) {
        if (mapControlDiv.offsetHeight === 0) {
            mapControlDiv.style.height = '400px';
        }
    }
}
