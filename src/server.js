import path from 'path';
import serve from 'koa-static';
import { Server } from 'boardgame.io/server';
import { Game } from './Game';

const PORT = process.env.PORT || 8000;

const server = Server({ games: [Game] });

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, './build');
server.app.use(serve(frontEndAppBuildPath));
server.run(PORT, () => {
	server.app.use(
		async (ctx, next) => await serve(frontEndAppBuildPath)(
			Object.assign(ctx, { path: 'index.html' }),
			next
		)
	)
});
