import React from 'react';
import './Board.scss';
const NODE_VALUES = require('./util/Constants.json');

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 500;
const STATION_ICON_SIZE = 10;

const COLORS = {
	'None': '#ccc',
	0: '#777',
	1: '#007bff',
	2: '#fd7e14',
};
const BACKGROUND_COLOR = "#eee";

const TRACK_COST_PER_UNIT = 10;

// Find a shortest path between two points with least turns
// this might be an NP-hard problem, this solution is very bad
function findPath(grid, player, [startX, startY], [endX, endY]) { // Dijkstra variant
	// try a straight horizontal / vertical route
	if (startX === endX) {
		let path = [];
		let valid = true;
		let n = startY;
		while (valid && n !== endY) {
			n += (endY > startY) ? 1 : -1;
			path.push([startX, n]);
			valid = !(grid[startX][n].owner && grid[startX][n].owner !== player);
		}
		if (valid) {
			return path;
		}
	} else if (startY === endY) {
		let path = [];
		let valid = true;
		let n = startX;
		while (valid && n !== endX) {
			n += (endX > startX) ? 1 : -1;
			path.push([n, startY]);
			valid = !(grid[n][startY].owner && grid[n][startY].owner !== player);
		}
		if (valid) {
			return path;
		}
	}

	const toValue = (x, y) => x * 1000 + y;
	const visited = new Map();
	visited.set(toValue(startX, startY), null);
	let queue = [[startX, startY]];

	let bestPath = null;
	let bestTurns = -1;
	let bestLength = -1;

	while (queue.length) {
		let [x, y] = queue.shift();
		if (x === endX && y === endY) {
			// return the path

			let numTurns = 0;
			let path = [];
			let last = [x, y];
			let direction = [0, 0];
			let length = 0;

			while (last !== null) {
				path.unshift(last);
				let next = visited.get(toValue(...last));

				if (next !== null) {
					let diff = [next[0] - last[0], next[1] - last[1]];
					if (diff[0] !== direction[0] || diff[1] !== direction[1]) {
						numTurns++;
						direction = diff;
					}
					length += diff[0] * diff[0] + diff[1] * diff[1];
				}

				last = next;
			}

			if (bestPath === null || numTurns < bestTurns || (numTurns === bestTurns && length < bestLength)) {
				bestTurns = numTurns;
				bestLength = length;
				bestPath = path;
			} else if (path.length > bestPath.length) {
				break;
			}

			continue;
		}

		for (let i = x - 1; i <= x + 1; i++) {
			for (let j = y - 1; j <= y + 1; j++) {
				if (i < 0 || j < 0 || i >= grid.length || j >= grid[i].length ||
					(grid[i][j].owner && grid[i][j].owner !== player)) {
					continue;
				}

				if (!visited.has(toValue(i, j))) {
					visited.set(toValue(i, j), [x, y]);
					queue.push([i, j]);
				}
			}
		}
	}

	if (bestPath) {
		bestPath.shift();
		return bestPath;
	}
}

export class Board extends React.Component {
	constructor(props) {
		super(props);

		this.svgRef = React.createRef();

		this.state = {
			tooltip: {
				name: null,
				sides: null,
				owner: null,
				style: {
					top: 0,
					left: 0,
					opacity: 0,
					borderColor: COLORS['None']
				},
			},
		};
	}

	indexToCoord(i, j) {
		const CITY_SIZE = [this.props.G.grid.length, this.props.G.grid[0].length];
		let cx = (j + 0.5) / CITY_SIZE[1] * SVG_WIDTH;
		let cy = (i + 0.5) / CITY_SIZE[0] * SVG_HEIGHT;
		return { cx, cy };
	}

	isPathInProgress() {
		if (this.props.G.tracks.length) {
			let lastTrack = this.props.G.tracks[this.props.G.tracks.length - 1];
			if (!lastTrack.complete && lastTrack.owner === +this.props.playerID + 1) {
				return lastTrack;
			}
		}
		return false;
	}

	onClick(e, i, j) {
		if (e.buttons === 1) {  // primary
			if (this.isPathInProgress()) {
				this.checkpointPath(i, j);
			} else {
				this.startPath(i, j);
			}
		} else if (e.buttons === 2) { // secondary
			this.createStation(i, j);
		}

	}

	createStation(i, j) {
		this.props.moves.createStation(i, j);
	}

	startPath(i, j) {
		const el = this.props.G.grid[i][j];

		// cannot create paths between other stations
		if (el.owner && el.owner !== +this.props.playerID + 1) {
			return;
		}

		// can start at own station
		if (el.owner === +this.props.playerID + 1 || el.owner === NODE_VALUES.Empty) {
			this.props.moves.startPath(i, j);
			return;
		}

		// check for nearby stations
		for (let x = i - 1; x <= i + 1; x++) {
			for (let y = j - 1; y <= j + 1; y++) {
				if (x < 0 || y < 0 || x >= this.props.G.grid.length || y >= this.props.G.grid[x].length) {
					continue;
				}
				let el2 = this.props.G.grid[x][y];
				if (el2.owner === +this.props.playerID + 1) {
					this.startPath(x, y);
					this.checkpointPath(i, j);
					return;
				}
			}
		}
	}

	checkpointPath(i, j) {
		let track = this.isPathInProgress();
		let [i_prev, j_prev] = track.path[track.path.length - 1];

		if (Math.abs(i_prev - i) <= 1 && Math.abs(j_prev - j) <= 1) {
			// one away from previous
			this.props.moves.checkpointPath(i, j);
			return;
		}

		let path = findPath(this.props.G.grid, +this.props.playerID + 1, [i_prev, j_prev], [i, j]);
		if (path) {
			let money = this.props.G[(this.props.playerID === '0') ? 'player1' : 'player2'].money;
			if (TRACK_COST_PER_UNIT * path.length > money) {
				// no way to build this with money
				return;
			}

			for (let [x, y] of path) {
				this.props.moves.checkpointPath(x, y);
			}
		}
	}

	onHover(e, i, j) {
		const el = this.props.G.grid[i][j];

		if (el === NODE_VALUES.Empty) {
			return;
		}

		let name = el.name;
		let sides = el.sides;
		let owner = el.owner;
		let borderColor = COLORS[el.owner];

		let [mouseX, mouseY] = [e.pageX, e.pageY];
		this.setState({
			tooltip: { name, sides, owner, style: { borderColor, left: mouseX, top: mouseY, opacity: 0.8 } },
		});
	}

	onHoverOut() {
		this.setState({
			tooltip: {
				style: {
					opacity: 0,
				},
			},
		});
	}

	makeStationIcon(station, CITY_SIZE, i, j) {
		let className = 'station';
		let color;
		let sides;
		let { cx, cy } = this.indexToCoord(i, j);

		const id = i * CITY_SIZE[1] + j;
		let points = [];

		if (station === NODE_VALUES.Empty) {
			// return null;
			className = 'possible-station';
			color = COLORS['None'];
			sides = 3;
		} else {
			color = COLORS[station.owner];
			sides = station.sides;
		}

		if (sides === 3) {
			const r32 = STATION_ICON_SIZE * 0.8660254;
			points.push(`${cx},${cy - STATION_ICON_SIZE}`);
			points.push(`${cx + r32},${cy + STATION_ICON_SIZE / 2}`);
			points.push(`${cx - r32},${cy + STATION_ICON_SIZE / 2}`);
		} else if (sides === 4) {
			const rd2 = STATION_ICON_SIZE * 0.7071068;
			points.push(`${cx - rd2},${cy - rd2}`);
			points.push(`${cx - rd2},${cy + rd2}`);
			points.push(`${cx + rd2},${cy + rd2}`);
			points.push(`${cx + rd2},${cy - rd2}`);
		} else {
			console.error(`Unexpected side=${sides} station`);
		}

		return (
			<g className={className} key={id} onMouseDown={(e) => this.onClick(e, i, j)} onMouseOver={(e) => this.onHover(e, i, j)} onMouseOut={() => this.onHoverOut()} onContextMenu={(e) => e.preventDefault()}>
				<circle cx={cx} cy={cy} r={STATION_ICON_SIZE + 5} fill={color}></circle>
				<polygon points={points.join(' ')} fill={BACKGROUND_COLOR} stroke={color} strokeWidth='3'></polygon>
			</g>
		);
	}

	makeTrackSVG(track, key) {
		const { owner, path, complete } = track;
		const color = COLORS[owner];
		const dash = complete ? 0 : 15;

		const start = this.indexToCoord(...path[0]);
		let d = `M ${start.cx} ${start.cy}`;
		for (let i = 1; i < path.length; i++) {
			let { cx, cy } = this.indexToCoord(...path[i]);
			d += ` L ${cx} ${cy}`;
		}

		return (
			<path className={complete ? '' : 'building-track'} key={key} d={d} fill='none' stroke={color} strokeWidth='10' strokeLinecap='round' strokeLinejoin='round' strokeDasharray={dash} />
		);
	}

	render() {
		const CITY_SIZE = [this.props.G.grid.length, this.props.G.grid[0].length];

		let svgBody = []
		for (let i = 0; i < CITY_SIZE[0]; i++) {
			for (let j = 0; j < CITY_SIZE[1]; j++) {
				const el = this.props.G.grid[i][j];

				const icon = this.makeStationIcon(el, CITY_SIZE, i, j);
				svgBody.push(icon);
			}
		}
		let svgTracks = [];
		for (let track of this.props.G.tracks) {
			svgTracks.push(this.makeTrackSVG(track, `path-${svgTracks.length}`));
		}

		return (
			<div className='Board'>
				<div className='svg-container'>
					<svg
						viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
						height='400px'
						width='800px'
						ref={this.svgRef}
					>
						{svgTracks}
						{svgBody}
					</svg>
				</div>
				<div className='tooltip' style={this.state.tooltip.style}>
					<span><strong>Name:</strong> {this.state.tooltip.name}</span>
					<span><strong>Sides:</strong> {this.state.tooltip.sides}</span>
					<span><strong>Owner:</strong> {this.state.tooltip.owner}</span>
				</div>
			</div>
		);
	}
}
