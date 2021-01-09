class Station {
	/**
     * @param {String} name the name of the city
	 * @param {number} x the width of the grid layout of the city
	 * @param {number} y the height of the grid layout of the city
	 */
	constructor(name, sides) {
        this.name = name;
        this.sides = sides;
	}
}

module.exports = Station;