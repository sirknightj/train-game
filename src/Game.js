import { INVALID_MOVE } from 'boardgame.io/core';
const City = require('./util/City');
const NODE_VALUES = require('./util/Constants.json');

const CITY_SIZE = [4, 6];

// checks if array[i][j] is valid
function isInBounds(array, i, j) {
	return (i >= 0 && j >= 0 && i < array.length && j < array[i].length);
}

export const Game = {
	setup: () => {
		// 2d array of size CITY_SIZE[0] by CITY_SIZE[1]
		// let empty_city = Array(CITY_SIZE[0]).fill().map(() => Array(CITY_SIZE[1]).fill(NODE_VALUES.Empty));
		let thisCity = new City(4, 6);

		let p1_upgrades = {
			train_speed: 50,
			train_capacity: 20,
			num_lines: 0,
			train_fare: 10,
			popularity: 100,
		}

		let p2_upgrades = {
			train_speed: 50,
			train_capacity: 20,
			num_lines: 0,
			train_fare: 10,
			popularity: 100,
		}

		return {
			city: thisCity,
			p1_upgrades: p1_upgrades,
			p2_upgrades: p2_upgrades,
		};
	},

	turn: {
		moveLimit: 1,
	},

	moves: {
		clickCell: (G, ctx, i, j) => {
			if (!isInBounds(G.cells, i, j)) {
				return INVALID_MOVE;
			} else if (G.cells[i][j] !== NODE_VALUES.Empty) {
				return INVALID_MOVE;
			}

			let value;
			if (ctx.currentPlayer === "0") {
				value = NODE_VALUES.Player1
			} else if (ctx.currentPlayer === "1") {
				value = NODE_VALUES.Player2
			}

			G.cells[i][j] = value;
		},
	},

	endIf: (G, ctx) => {
		// not returning means game does not end
	},
};
