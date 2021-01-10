import { INVALID_MOVE } from 'boardgame.io/core';
import City from './util/City';
import stationNames from './util/station-names.json';
import Station from './util/Station';
import { createTrack, addCheckpoint } from './util/Track';
import NODE_VALUES from './util/Constants.json';

const TRACK_COST_PER_UNIT = 10;
const STARTING_FARE = 10;

// checks if array[i][j] is valid
function isInBounds(array, i, j) {
	return (i >= 0 && j >= 0 && i < array.length && j < array[i].length);
}


export const Game = {
	setup: () => {
		this.newStation = false;

		let { name, grid } = new City(15, 30, stationNames.names);

		let player1 = {
			money: 100,
			passengers_delivered: 0,
			money_earned_this_week: 0,
			passengers_delivered_this_week: 0,
		}

		let player2 = {
			money: 100,
			passengers_delivered: 0,
			money_earned_this_week: 0,
			passengers_delivered_this_week: 0,
		}

		let tracks = [];

		let p1_upgrades = {
			train_speed: 50,
			train_capacity: 15,
			num_lines: 0,
			train_fare: STARTING_FARE,
			popularity: 100,
		}

		let p2_upgrades = {
			train_speed: 50,
			train_capacity: 15,
			num_lines: 0,
			train_fare: STARTING_FARE,
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

				if (ctx.turn > 4 && this.newStation) {
					this.newStation = false;
					for (let i = 0; i < 3; i++) {
						let i = Math.floor(G.grid.length * Math.random());
						let j = Math.floor(Math.random() * G.grid[0].length);
						if (G.grid[i][j] === NODE_VALUES.Empty) {
							const nameInt = Math.floor(Math.random() * stationNames.length);
							G.grid[i][j] = new Station(stationNames.names[nameInt], Math.floor(Math.random() * 5));
							break;
						}
					}
				} else {
					this.newStation = true;
				}
			}
		},

		onEnd: (G, ctx) => {
			// called at end of turn

			// refund an incomplete track
			if (G.tracks.length && !G.tracks[G.tracks.length - 1].complete) {
				const lastTrack = G.tracks.pop();
				const cost = lastTrack.path.length * TRACK_COST_PER_UNIT;
				if (lastTrack.owner === NODE_VALUES.Player1) {
					G.player1.money += cost;
				} else {
					G.player2.money += cost;
				}
			}

			if (ctx.turn === NODE_VALUES.Player1) {
				return;
			}

			G.player1.passengers_delivered_this_week = 0;
			G.player2.passengers_delivered_this_week = 0;
			G.player1.money_earned_this_week = 0;
			G.player2.money_earned_this_week = 0;

			for (let track of G.tracks) {
				let startingStation = track.path[0];
				startingStation = G.grid[startingStation[0]][startingStation[1]];
				let endingStation = track.path[track.path.length - 1];
				endingStation = G.grid[endingStation[0]][endingStation[1]];

				let travelersBetweenStations = startingStation.sides + endingStation.sides;
				travelersBetweenStations *= 3;

				let player = G.player1;
				let upgrades = G.p1_upgrades;
				if (track.owner === NODE_VALUES.Player2) {
					player = G.player2;
					upgrades = G.p2_upgrades;
				}

				// Calculate additional number of passengers that leave or join due to hidden properties
				travelersBetweenStations *= Math.max(((upgrades.train_speed + track.path.length / 2) / 100), 0.05);
				travelersBetweenStations *= Math.max((upgrades.popularity / 100), 0.05);

				travelersBetweenStations *= Math.max((STARTING_FARE / upgrades.train_fare), 0.05);

				travelersBetweenStations = Math.floor(travelersBetweenStations);
				travelersBetweenStations = Math.min(upgrades.train_capacity, travelersBetweenStations);

				player.money += travelersBetweenStations * upgrades.train_fare;
				player.passengers_delivered += travelersBetweenStations;
				player.money = Math.round(player.money * 100) / 100;
				player.passengers_delivered = Math.round(player.passengers_delivered);
				player.money_earned_this_week += Math.round(travelersBetweenStations * upgrades.train_fare * 100) / 100;
				player.passengers_delivered_this_week = Math.round(player.passengers_delivered_this_week + travelersBetweenStations);
			}

			// Handle victory condition. Increase the cap if needed.
			if (G.player1.passengers_delivered >= G.passengers_required && G.player2.passengers_delivered >= G.passengers_required) {
				// Increase the cap, as it's a draw.
				while (G.player1.passengers_delivered >= G.passengers_required || G.player2.passengers_delivered >= G.passengers_required) {
					G.passengers_required *= 1.1;
				}
			} else if (G.player1.passengers_delivered >= G.passengers_required) {
				// Player 1 wins.
				ctx.events.endGame({ winner: 1 });
			} else if (G.player2.passengers_delivered >= G.passengers_required) {
				// Player 2 wins.
				ctx.events.endGame({ winner: 2 });
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

			let player = NODE_VALUES.Player1;
			if (ctx.currentPlayer === "1") {
				player = NODE_VALUES.Player2;
			}

			const nameInt = Math.floor(Math.random() * stationNames.length);
			G.grid[i][j] = new Station(stationNames.names[nameInt], 3, player);

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
			let gPlayer = G.player1;
			if (ctx.currentPlayer === "1") {
				player = NODE_VALUES.Player2;
				gPlayer = G.player2;
			}

			// cannot start track at an opponent's station
			if (G.grid[i][j].owner !== player && G.grid[i][j].owner !== NODE_VALUES.Empty) {
				return INVALID_MOVE;
			}

			const track = createTrack(player);

			if (addCheckpoint(track.path, i, j) && gPlayer.money >= TRACK_COST_PER_UNIT) {
				G.tracks.push(track);
				gPlayer.money -= TRACK_COST_PER_UNIT;
			} else {
				return INVALID_MOVE;
			}
		},

		checkpointPath: (G, ctx, i, j) => {
			const track = G.tracks[G.tracks.length - 1];
			let player = NODE_VALUES.Player1;
			let gPlayer = G.player1;
			if (ctx.currentPlayer === "1") {
				player = NODE_VALUES.Player2;
				gPlayer = G.player2;
			}

			if (track.complete || track.owner !== player) {
				// cannot add to already completed track or someone else's track
				throw Error('This error should never occur.');
				// return INVALID_MOVE;
			}

			// cannot place track through someone else's station
			if (G.grid[i][j].owner && G.grid[i][j].owner !== player) {
				return INVALID_MOVE;
			}

			if (!addCheckpoint(track.path, i, j)) {
				return INVALID_MOVE;
			}

			if (gPlayer.money < TRACK_COST_PER_UNIT) {
				return INVALID_MOVE;
			}
			gPlayer.money -= TRACK_COST_PER_UNIT;

			// complete track if ending at a player-owned or city-owned station
			if (G.grid[i][j].owner === player || G.grid[i][j].owner === NODE_VALUES.Empty) {
				track.complete = true;
			}
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
		},

		purchaseUpgrade : {
			move: (G, ctx, upgrade) => {
				let player = [G.player1, G.player2];
				let p_upgrade = [G.p1_upgrades, G.p2_upgrades];

				if (player[ctx.currentPlayer].money >= upgrade.cost) {
					player[ctx.currentPlayer].money -= upgrade.cost;
					p_upgrade[ctx.currentPlayer].train_speed += upgrade.train_speed;
					p_upgrade[ctx.currentPlayer].train_capacity += upgrade.train_capacity;
					p_upgrade[ctx.currentPlayer].train_fare += upgrade.train_fare;
					p_upgrade[ctx.currentPlayer].train_capacity += upgrade.train_capacity;
					p_upgrade[ctx.currentPlayer].popularity += upgrade.popularity;
				} else {
					return INVALID_MOVE;
				}
			},
			undoable: false
		},

		clearTrack: (G, ctx) => {
			if (G.tracks.length && !G.tracks[G.tracks.length - 1].complete) {
				const lastTrack = G.tracks.pop();
				const cost = lastTrack.path.length * TRACK_COST_PER_UNIT;
				if (lastTrack.owner === NODE_VALUES.Player1) {
					G.player1.money += cost;
				} else {
					G.player2.money += cost;
				}
			}
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