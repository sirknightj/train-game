import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { Header } from './Header';
import { Game } from './Game';
import { PlayerView } from './PlayerView';

const GameClient = Client({
	game: Game,
	board: PlayerView,
	multiplayer: Local(),
	// debug: false,
});

const App = () => (
	<div>
		<Header />
		<GameClient playerID="0" />
		<GameClient playerID="1" />
	</div>
);

export default App;
