import React from 'react';
import { Board } from './Board';
import './PlayerView.scss';
import { Upgrades } from './Upgrades'

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
					<span><strong>Week:</strong> {Math.floor((this.props.ctx.turn - 1) / 2) + 1}</span>
					<span><strong>Income:</strong> ${(Math.floor((this.props.ctx.turn - 1) / 2) + 4) * 25}/week</span>
					<span><strong>Money:</strong> ${this.props.playerID === "0" ? this.props.G.player1.money : this.props.G.player2.money}</span>
					<span><strong>Passengers (you):</strong> {this.props.playerID === "0" ? this.props.G.player1.passengers_delivered : this.props.G.player2.passengers_delivered} / {this.props.G.passengers_required}</span>
					<span><strong>Passengers (opp):</strong> {this.props.playerID === "0" ? this.props.G.player2.passengers_delivered : this.props.G.player1.passengers_delivered} / {this.props.G.passengers_required}</span>
				</div>
				<div className = "player-info">
					<span><strong>Passengers Last Week:</strong> {this.props.playerID === "0" ? this.props.G.player1.passengers_delivered_this_week : this.props.G.player2.passengers_delivered_this_week}</span>
					<span><strong>Income From Fares Last Week:</strong> ${this.props.playerID === "0" ? this.props.G.player1.money_earned_this_week : this.props.G.player2.money_earned_this_week}</span>
				</div>
				<Board {...this.props} />
				<div className="upgrades">
					<Upgrades {...this.props}/>
					<Upgrades {...this.props}/>
					<Upgrades {...this.props}/>
				</div>
				<div className="buttons">
					<button className="undo" onClick={() => this.undo()}>Undo</button>
					<button className="redo" onClick={() => this.redo()}>Redo</button>
					<button className="end-turn" onClick={() => this.endTurn()}>End turn</button>
				</div>
			</div>
		);
	}
}
