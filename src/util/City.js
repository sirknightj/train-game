import CONSTANTS from './Constants.json';
import Station from './Station.js';
import CityNames from './city-names.json';

function randint(n) {
    return Math.floor(Math.random() * n);
}

class City {
    /**
     * @param {number} x the width of the grid layout of the city
     * @param {number} y the height of the grid layout of the city
     */
    constructor(x, y, stationList) {
        this.grid = new Array(x);
        for (let i = 0; i < x; i++) {
            this.grid[i] = new Array(y).fill(CONSTANTS.Empty);
        }

        this.name = CityNames.names[randint(CityNames.names.length)];
        this.x = x;
        this.y = y;

        this.createStarterStations(stationList)
    }

    createStarterStations(stationList) {
        // Starter stations in bottom left corner, and top right corner, and in the middle.
        this.grid[0][0] = new Station(stationList.splice(Math.floor(randint(stationList.length)), 1), 3);
        this.grid[this.grid.length - 1][this.grid[0].length - 1] = new Station(stationList.splice(Math.floor(randint(stationList.length)), 1), 3);
        this.grid[Math.round(this.grid.length / 2)][Math.round(this.grid[0].length / 2)] = new Station(stationList.splice(Math.floor(randint(stationList.length)), 1), 4);
        this.grid[randint(this.grid.length)][randint(this.grid[0].length)] = new Station(stationList.splice(Math.floor(randint(stationList.length)), 1), 3);
    }
}

export default City;