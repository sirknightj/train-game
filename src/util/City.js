const CONSTANTS = require('./Constants.json');
const Station = require('./Station.js');

class City {
	/**
     * @param {String} name the name of the city
	 * @param {number} x the width of the grid layout of the city
	 * @param {number} y the height of the grid layout of the city
	 */
	constructor(name, x, y) {
        this.grid = new Array(x);
        for (let i = 0; i < x; i++) {
            this.grid[i] = new Array(y).fill(CONSTANTS.Empty);
        }

        this.name = name;
		this.x = x;
        this.y = y;
        
        // Starter stations in bottom left corner, and top right corner, and in the middle.
        this.grid[0][0] = new Station("1st Avenue", 3);
        this.grid[this.grid.length - 1][this.grid[0].length - 1] = new Station("Outlands", 3);
        this.grid[Math.round(this.grid.length / 2)][Math.round(this.grid[0].length / 2)] = new Station("Metrotown", 4);
	}
}

module.exports = City;