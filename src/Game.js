import { INVALID_MOVE } from 'boardgame.io/core';
const City = require('./util/City');
const Station = require('./util/Station');
const NODE_VALUES = require('./util/Constants.json');

// checks if array[i][j] is valid
function isInBounds(array, i, j) {
	return (i >= 0 && j >= 0 && i < array.length && j < array[i].length);
}

/**
 * Finds all the stations this line is connected to.
 */
function findConnectingStations(grid, i, j, obj) {
	if (obj.tilesSoFar.includes(grid[i][j]) || obj.stationsInLoop.includes(grid[i][j])) {
		return obj;
	}
	if (i - 1 >= 0 && j - 1 >= 0) {
		obj.tilesSoFar.push(grid[i - 1][j - 1]);
		if (grid[i - 1][j - 1] !== NODE_VALUES.Empty && grid[i - 1][j - 1] !== NODE_VALUES.Player1 && grid[i - 1][j - 1] !== NODE_VALUES.Player2) {
			obj.stationsInLoop.push(grid[i - 1][j - 1]);
		}
		obj = findConnectingStations(grid, i - 1, j - 1, obj);
	}
	if (i - 1 >= 0 && j + 1 < grid[0].length) {
		obj.tilesSoFar.push(grid[i - 1][j + 1]);
		if (grid[i - 1][j + 1] !== NODE_VALUES.Empty && grid[i - 1][j + 1] !== NODE_VALUES.Player1 && grid[i - 1][j + 1] !== NODE_VALUES.Player2) {
			obj.stationsInLoop.push(grid[i - 1][j + 1]);
		}
		obj = findConnectingStations(grid, i - 1, j + 1, obj);
	}
	if (i + 1 < grid.length && j - 1 >= 0) {
		obj.tilesSoFar.push(grid[i + 1][j - 1]);
		if (grid[i + 1][j - 1] !== NODE_VALUES.Empty && grid[i + 1][j - 1] !== NODE_VALUES.Player1 && grid[i + 1][j - 1] !== NODE_VALUES.Player2) {
			obj.stationsInLoop.push(grid[i + 1][j - 1]);
		}
		obj = findConnectingStations(grid, i + 1, j - 1, obj);
	}
	if (i + 1 < grid.length && j + 1 < grid[0].length) {
		obj.tilesSoFar.push(grid[i + 1][j + 1]);
		if (grid[i + 1][j + 1] !== NODE_VALUES.Empty && grid[i + 1][j + 1] !== NODE_VALUES.Player1 && grid[i + 1][j + 1] !== NODE_VALUES.Player2) {
			obj.stationsInLoop.push(grid[i + 1][j + 1]);
		}
		obj = findConnectingStations(grid, i + 1, j + 1, obj);
	}
	return obj;
}

export const Game = {
	setup: () => {
		let { name, grid } = new City(4, 6);

		let player1 = {
			money: 100,
			passengers_delivered: 0,
			fare: 5,
		}

		let player2 = {
			money: 100,
			passengers_delivered: 0,
			fare: 5,
		}

		let tracks = [];

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

		let passengers_required = 1000;

		return {
			city_name: name,
			grid: grid,
			p1_upgrades: p1_upgrades,
			p2_upgrades: p2_upgrades,
			player1: player1,
			player2: player2,
			tracks: tracks,
			passengers_required: passengers_required,
		};
	},

	turn: {
		onBegin: (G, ctx) => {
			// called at beginning of turn

			if (ctx.currentPlayer === "0") {
				let incomeToAward = (Math.floor((ctx.turn - 1) / 2) + 4) * 25;
				G.player1.money += incomeToAward;
				G.player2.money += incomeToAward;
			}
		},

		onEnd: (G, ctx) => {
			// called at end of turn

			// search for networks coordinates to a single tile.
			// playerOneNetworks: 2d-array of all track networks player one has.
			// for example, if the board is [station1, player1track, player1track, station2, empty, station3, player1track, station4],
			// then playerOneNetworks should be [[station1, station2], [station3, station4]]
			let playerOneNetworks = [];
			let playerTwoNetworks = [];
			let tilesSoFar = [];
			if (ctx.currentPlayer === "1") {
				// Loop through every single tile
				for (let i = 0; i < G.grid.length; i++) {
					for (let j = 0; j < G.grid[0].length; j++) {
						// If a player owns the track, then find every station connected to that track network.
						if (G.grid[i][j] === NODE_VALUES.Player1 && !tilesSoFar.includes(G.grid[i][j])) {
							let connectedStations = findConnectingStations(G.grid, i, j, { tilesSoFar: tilesSoFar, stationsInLoop: [] });
							playerOneNetworks.push(connectedStations.stationsInLoop);
							tilesSoFar.push(...connectedStations.tilesSoFar);
						} else if (G.grid[i][j] === NODE_VALUES.Player2 && !tilesSoFar.includes(G.grid[i][j])) {
							let connectedStations = findConnectingStations(G.grid, i, j, { tilesSoFar: tilesSoFar, stationsInLoop: [] });
							playerTwoNetworks.push(connectedStations.stationsInLoop);
							tilesSoFar.push(...connectedStations.tilesSoFar);
						}
					}
				}
			}

			// BEGIN DEBUGGING INFO. This prints out some stuff in the sidebar.
			G.player1.playerOneNetworks = playerOneNetworks;
			G.player2.playerTwoNetworks = playerTwoNetworks;
			G.player1.tilesConsidered = tilesSoFar;
			// END DEBUGGING INFO

			// Loop through all the track networks each player has
			for (let i = 0; i < playerOneNetworks.length; i++) {
				let passengerToAdd = 0;
				for (let station in playerOneNetworks[i]) {
					passengerToAdd += (station.sides * 3);
				}
				G.player1.passengers_delivered += passengerToAdd;
				G.player1.money += passengerToAdd * G.player1.fare;
			}

			for (let i = 0; i < playerTwoNetworks.length; i++) {
				let passengerToAdd = 0;
				for (let station in playerTwoNetworks[i]) {
					passengerToAdd += (station.sides * 3);
				}
				G.player2.passengers_delivered += passengerToAdd;
				G.player2.money += passengerToAdd * G.player2.fare;
			}

			// Handle victory condition. Increase the cap if needed.
			if (G.player1.passengers_delivered >= G.passengers_required && G.player2.passengers_delivered >= G.passengers_required) {
				// Increase the cap, as it's a draw.
				while (G.player1.passengers_delivered >= G.passengers_required || G.player2.passengers_delivered >= G.passengers_required) {
					G.passengers_required *= 1.1;
				}
			} else if (G.player1.passengers_delivered >= G.passengers_required) {
				// Player 1 wins.
				ctx.events.endGame();
			} else if (G.player2.passengers_delivered >= G.passengers_required) {
				// Player 2 wins.
				ctx.events.endGame();
			}
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

		buildTracks: (G, ctx, i, j) => {
			if (!isInBounds(G.grid, i, j)) {
				return INVALID_MOVE;
			} else if (G.grid[i][j] !== NODE_VALUES.Empty) {
				return INVALID_MOVE;
			}

			let value;
			if (ctx.currentPlayer === "0") {
				value = NODE_VALUES.Player1;
			} else if (ctx.currentPlayer === "1") {
				value = NODE_VALUES.Player2;
			}

			G.grid[i][j] = value;
		}
	},

	endIf: (G, ctx) => {
		// not returning means game does not end
	},

	// The minimum and maximum number of players supported
	// (This is only enforced when using the Lobby server component.)
	minPlayers: 2,
	maxPlayers: 2,
};