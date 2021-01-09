import React from 'react';
import { Board } from './Board';
import './PlayerView.scss';

export class PlayerView extends React.Component {
	undo() {
		this.props.undo();
	}

	redo() {
		this.props.redo();
	}

	endTurn() {
		this.props.events.endTurn();
	}

	render() {
		let classes = ['PlayerView', `player-${this.props.playerID}`];
		if (this.props.isActive) {
			classes.push('active');
		}

		return (
			<div className={classes.join(' ')}>
				<h2>Player {(+this.props.playerID + 1)}</h2>
				<div className="player-info">
					<span><strong>Week:</strong> {this.props.ctx.turn}</span>
					<span><strong>Income:</strong> $123/week</span>
					<span><strong>Money:</strong> $456</span>
					<span><strong>Passengers (you):</strong> 789 / 1000</span>
					<span><strong>Passengers (opp):</strong> 890 / 1000</span>
				</div>
				<Board {...this.props} />
				<div className="buttons">
					<button className="undo" onClick={() => this.undo()}>Undo</button>
					<button className="redo" onClick={() => this.redo()}>Redo</button>
					<button className="end-turn" onClick={() => this.endTurn()}>End turn</button>
				</div>
			</div>
		);
	}
}
