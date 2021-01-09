import React from 'react';
import './Board.scss';
const NODE_VALUES = require('./util/Constants.json');

const SVG_WIDTH = 1000;
const SVG_HEIGHT = 500;

export class Board extends React.Component {
	constructor(props) {
		super(props);

		this.svgRef = React.createRef();
	}

	onClick(i, j) {
		this.props.moves.createStation(i, j);
	}

	render() {
		const CITY_SIZE = [this.props.G.grid.length, this.props.G.grid[0].length]

		let svgBody = []
		for (let i = 0; i < CITY_SIZE[0]; i++) {
			for (let j = 0; j < CITY_SIZE[1]; j++) {
				const id = i * CITY_SIZE[1] + j;
				const el = this.props.G.grid[i][j];
				let color;
				if (el === NODE_VALUES.Empty) {
					color = 'white';
				} else if (el.owner === NODE_VALUES.Empty) {
					color = 'gray';
				} else if (el.owner === +this.props.playerID + 1) {
					color = 'green';
				} else {
					color = 'red';
				}

				let x = (j + 0.5) / CITY_SIZE[1] * SVG_WIDTH;
				let y = (i + 0.5) / CITY_SIZE[0] * SVG_HEIGHT;
				const RADIUS = 50;

				svgBody.push(
					<circle key={id} cx={x} cy={y} r={RADIUS} fill={color} onClick={() => this.onClick(i, j)} />
				);
			}
		}

		return (
			<div className='Board'>
				<svg
					viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
					height="400px"
					width="800px"
					ref={this.svgRef}
				>
					{svgBody}
				</svg>
			</div>
		);
	}
}
