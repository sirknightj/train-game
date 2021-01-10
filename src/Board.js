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

// const PATH = [
// 	[0, 0], [3, 3], [5, 3], [3, 5],
// ];

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
			creatingPath: false,
		};
	}

	indexToCoord(i, j) {
		const CITY_SIZE = [this.props.G.grid.length, this.props.G.grid[0].length];
		let cx = (j + 0.5) / CITY_SIZE[1] * SVG_WIDTH;
		let cy = (i + 0.5) / CITY_SIZE[0] * SVG_HEIGHT;
		return {cx, cy};
	}

	onClick(e, i, j) {
		if (e.buttons === 1) {  // primary
			let isInProgress = false;
			if (this.props.G.tracks.length) {
				let lastTrack = this.props.G.tracks[this.props.G.tracks.length - 1];
				if (!lastTrack.complete && lastTrack.owner === +this.props.playerID + 1) {
					isInProgress = true;
				}
			}

			if (isInProgress) {
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
			for (let y = j -1; y <= j + 1; y++) {
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
		this.props.moves.checkpointPath(i, j);
	}

	onHover(e, i, j) {
		const el = this.props.G.grid[i][j];
		let name, sides, owner, borderColor;

		if (el === NODE_VALUES.Empty) {
			if (this.state.creatingPath) {
				return;
			}

			name = 'None';
			sides = 3;
			owner = 'None';
			borderColor = COLORS['None'];
		} else {
			name = el.name;
			sides = el.sides;
			owner = el.owner;
			borderColor = COLORS[el.owner];
		}

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
		let {cx, cy} = this.indexToCoord(i, j);

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
		const {owner, path, complete} = track;
		const color = COLORS[owner];
		const dash = complete ? 0 : 15;

		const start = this.indexToCoord(...path[0]);
		let d = `M ${start.cx} ${start.cy}`;
		for (let i = 1; i < path.length; i++) {
			let {cx, cy} = this.indexToCoord(...path[i]);
			d += ` L ${cx} ${cy}`;
		}

		return (
			<path key={key} d={d} fill='none' stroke={color} strokeWidth='10' strokeLinecap='round' strokeLinejoin='round' strokeDasharray={dash} />
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
