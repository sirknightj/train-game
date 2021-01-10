import React from 'react';
import { Client } from 'boardgame.io/react';
import { SocketIO } from 'boardgame.io/multiplayer';
import { Header } from './Header';
import { Game } from './Game';
import { PlayerView } from './PlayerView';

// const SERVER_URL = 'localhost:8000';
const SERVER_URL = 'https://trainz-dot-io.herokuapp.com';

const GameClient = Client({
	game: Game,
	board: PlayerView,
	// multiplayer: Local(),
	multiplayer: SocketIO({ server: SERVER_URL }),
	debug: false,
});

export class Match extends React.Component {
	constructor(props) {
		super(props);

		let id = (props.match.params.id - 1) + '';

		this.state = {
			id,
			match: props.match.params.match,
		};
	}

	render() {
		return (
			<div>
				<Header />
				<GameClient playerID={this.state.id} matchID={this.state.match} />
			</div>
		);
	}
}
