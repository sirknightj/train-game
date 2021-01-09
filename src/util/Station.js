const NODE_VALUES = require('./Constants.json');

class Station {
	/**
	 * @param {String} name the name of the city
	 * @param {number} sides
	 * @param {number} owner Player this belongs to (one of NODE_VALUES), or EMPTY for none
	 */
	constructor(name, sides, owner=NODE_VALUES.Empty) {
		this.name = name;
		this.sides = sides;
		this.owner = owner;
	}
}

module.exports = Station;