export function parsePeople(people) {
    return people.map(person => {
        person.displayLocation = getDisplayLocation(person);
        person.yearRange = getYearRange(person);
        person.lat = getLatForPerson(person);
        person.lng = getLongForPerson(person);
        return person;
    });
}

export function filterPeople(people, yearStart, yearEnd) {
    return people.filter(person => {
        const from = parseInt(person.yearFrom);
        let to = parseInt(person.yearTo);
        if (to === undefined || to <= 0) {
            to = new Date().getFullYear();
        }
        return from <= yearEnd && to >= yearStart;
    });
}

export function getMinYear(people) {
    let minYear = new Date().getFullYear();

    people.forEach(person => {
        const from = parseInt(person.yearFrom);
        if (from < minYear) {
            minYear = from;
        }
    });

    return minYear;
}

export function getMaxYear(people) {
    const todayYear = new Date().getFullYear();;
    let maxYear = 0;

    people.forEach(person => {
        let to = parseInt(person.yearTo);

        if (to === undefined || to <= 0) {
            to = todayYear;
        }

        if (to > maxYear) {
            maxYear = to;
        }
    });

    return maxYear;
}

function getDisplayLocation(person) {
    let displayLocation = '';
    if (person.hasOwnProperty('generated') && person.generated.hasOwnProperty('location')) {
        displayLocation = person.generated.location;
    } else if (person.state.length > 0) {
        displayLocation = `${person.city}, ${person.state}, ${person.country}`;
    } else {
        displayLocation = `${person.city}, ${person.country}`;
    }

    return displayLocation;
}

function getYearRange(person) {
    const todayYear = new Date().getFullYear().toString;
    let endYear = person.yearTo;
    if (endYear === todayYear || isNaN(endYear) || endYear === undefined || endYear <= 0) {
        endYear = 'present';
    }
    return `${person.yearFrom} - ${endYear}`;
}

function getLatForPerson(person) {
    let lat = parseFloat(person.lat);
    if (isNaN(lat) && person.hasOwnProperty('generated') && person.generated.hasOwnProperty('lat')) {
        lat = parseFloat(person.generated.lat);
    }

    return adjustLocation(lat);

}

function getLongForPerson(person) {
    let lng = parseFloat(person.long);
    if (isNaN(lng) && person.hasOwnProperty('generated') && person.generated.hasOwnProperty('long')) {
        lng = parseFloat(person.generated.long);
    }

    return adjustLocation(lng);
}

const min = 0.999999;
const max = 1.000500;
function adjustLocation(location) {
    return location * (Math.random() * (max - min) + min);
}
