const NODE_VALUES = require('./Constants.json');

class Station {
	/**
	 * @param {String} name the name of the city
	 * @param {number} sides: either 3, 4, 5
	 * @param {number} owner Player this belongs to (one of NODE_VALUES), or EMPTY for none
	 * @param {number} demand  (number of people at a station who want to take the train)
	 */
	constructor(name, sides, owner=NODE_VALUES.Empty, demand) {
		if (sides < 3) {
			sides = 3;
		}
		this.name = name;
		this.sides = sides;
		this.owner = owner;
		this.demand = demand;
	}
}

module.exports = Station;