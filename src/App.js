import { Client } from 'boardgame.io/react';
import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { Header } from './Header';
import { Game } from './Game';
import { PlayerView } from './PlayerView';

const SERVER_URL = 'localhost:8000';

const GameClient = Client({
	game: Game,
	board: PlayerView,
	// multiplayer: Local(),
	multiplayer: SocketIO({ server: SERVER_URL }),
	debug: false,
});

const App = () => (
	<div>
		<Header />
		<GameClient playerID="0" />
		<GameClient playerID="1" />
	</div>
);

export default App;
