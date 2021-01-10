const CONSTANTS = require('./Constants.json');
const Station = require('./Station.js');
const CityNames = require('./city-names.json');

function randint(n) {
    return Math.floor(Math.random() * n);
}

class City {
    /**
     * @param {number} x the width of the grid layout of the city
     * @param {number} y the height of the grid layout of the city
     */
    constructor(x, y) {
        this.grid = new Array(x);
        for (let i = 0; i < x; i++) {
            this.grid[i] = new Array(y).fill(CONSTANTS.Empty);
        }

        this.name = CityNames.names[randint(CityNames.names.length)];
        this.x = x;
        this.y = y;

        // Starter stations in bottom left corner, and top right corner, and in the middle.
        this.grid[0][0] = new Station("1st Avenue", 3);
        this.grid[this.grid.length - 1][this.grid[0].length - 1] = new Station("Outlands", 3);
        this.grid[Math.round(this.grid.length / 2)][Math.round(this.grid[0].length / 2)] = new Station("Metrotown", 4);
        this.grid[randint(this.grid.length)][randint(this.grid[0].length)] = new Station("Penn Station", 4);
    }
}

module.exports = City;