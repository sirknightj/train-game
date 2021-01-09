import React from 'react';
import './Board.scss';

export class Board extends React.Component {
	onClick(i, j) {
		this.props.moves.clickCell(i, j);
	}

	render() {
		let winner = '';
		if (this.props.ctx.gameover) {
			if (this.props.ctx.gameover.winner !== undefined) {
				winner = (<div id="winner">Winner: {this.props.ctx.gameover.winner}</div>);
			} else {
				winner = (<div id="winner">Draw!</div>);
			}
		}

		let tbody = [];
		const CITY_SIZE = [this.props.G.city.grid.length, this.props.G.city.grid[0].length]
		for (let i = 0; i < CITY_SIZE[0]; i++) {
			let cells = [];
			for (let j = 0; j < CITY_SIZE[1]; j++) {
				const id = i * CITY_SIZE[1] + j;
				cells.push(
					<td key={id} onClick={() => this.onClick(i, j)}>
						{this.props.G.city.grid[i][j]}
					</td>
				);
			}
			tbody.push(<tr key={i}>{cells}</tr>);
		}

		return (
			<div className="board">
				<table>
					<tbody>{tbody}</tbody>
				</table>
				{winner}
			</div>
		);
	}
}
