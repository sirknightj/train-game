import { INVALID_MOVE } from 'boardgame.io/core';
const City = require('./util/City');
const Station = require('./util/Station');
const NODE_VALUES = require('./util/Constants.json');

// checks if array[i][j] is valid
function isInBounds(array, i, j) {
	return (i >= 0 && j >= 0 && i < array.length && j < array[i].length);
}

export const Game = {
	setup: () => {
		let { name, grid } = new City(4, 6);

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
			city_name: name,
			grid: grid,
			p1_upgrades: p1_upgrades,
			p2_upgrades: p2_upgrades,
		};
	},

	turn: {
		onBegin: (G, ctx) => {
			// called at beginning of turn
		},

		onEnd: (G, ctx) => {
			// called at end of turn
		}
	},

	moves: {
		createStation: (G, ctx, i, j) => {
			if (!isInBounds(G.grid, i, j)) {
				return INVALID_MOVE;
			} else if (G.grid[i][j] !== NODE_VALUES.Empty) {
				return INVALID_MOVE;
			}

			let value;
			if (ctx.currentPlayer === "0") {
				value = new Station(`Station ${Math.floor(Math.random() * 100)}`, 3, NODE_VALUES.Player1);
			} else if (ctx.currentPlayer === "1") {
				value = new Station(`Station ${Math.floor(Math.random() * 100)}`, 3, NODE_VALUES.Player2);
			}

			G.grid[i][j] = value;
		},
	},

	endIf: (G, ctx) => {
		// not returning means game does not end
	},

	// The minimum and maximum number of players supported
	// (This is only enforced when using the Lobby server component.)
	minPlayers: 2,
	maxPlayers: 2,
};
