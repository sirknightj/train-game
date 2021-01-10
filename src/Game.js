import { INVALID_MOVE } from 'boardgame.io/core';
const City = require('./util/City');
const Station = require('./util/Station');
const { createTrack, addCheckpoint } = require('./util/Track');
const NODE_VALUES = require('./util/Constants.json');

// checks if array[i][j] is valid
function isInBounds(array, i, j) {
	return (i >= 0 && j >= 0 && i < array.length && j < array[i].length);
}

export const Game = {
	setup: () => {
		let { name, grid } = new City(15, 30);

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
			tracks: []
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

			let player = NODE_VALUES.Player1;
			if (ctx.currentPlayer === "1") {
				player = NODE_VALUES.Player2;
			}

			G.grid[i][j] = new Station(`Station ${Math.floor(Math.random() * 100)}`, 3, player);

			if (G.tracks.length) {
				const lastTrack = G.tracks[G.tracks.length - 1];
				const lastLoc = lastTrack.path[lastTrack.path.length - 1];
				if (lastTrack.owner === player && !lastTrack.complete && lastLoc[0] === i && lastLoc[1] === j) {
					// complete the last track since it is on a station
					lastTrack.complete = true;
				}
			}
		},

		startPath: (G, ctx, i, j) => {
			if (!isInBounds(G.grid, i, j)) {
				return INVALID_MOVE;
			}

			let player = NODE_VALUES.Player1;
			if (ctx.currentPlayer === "1") {
				player = NODE_VALUES.Player2;
			}

			// cannot start track at an opponent's station
			if (G.grid[i][j].owner !== player && G.grid[i][j].owner !== NODE_VALUES.Empty) {
				return INVALID_MOVE;
			}

			const track = createTrack(player);
			if (addCheckpoint(track.path, i, j)) {
				G.tracks.push(track);
			} else {
				return INVALID_MOVE;
			}
		},

		checkpointPath: (G, ctx, i, j) => {
			const track = G.tracks[G.tracks.length - 1];
			let player = NODE_VALUES.Player1;
			if (ctx.currentPlayer === "1") {
				player = NODE_VALUES.Player2;
			}

			if (track.complete || track.owner !== player) {
				// cannot add to already completed track or someone else's track
				console.error('This error should never occur.');
				return INVALID_MOVE;
			}

			// cannot place track through someone else's station
			if (G.grid[i][j].owner && G.grid[i][j].owner !== player) {
				return INVALID_MOVE;
			}

			if (!addCheckpoint(track.path, i, j)) {
				return INVALID_MOVE;
			}

			// complete track if ending at a player-owned or city-owned station
			if (G.grid[i][j].owner === player || G.grid[i][j].owner === NODE_VALUES.Empty) {
				track.complete = true;
			}
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
