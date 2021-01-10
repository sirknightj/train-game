import React from 'react';

export class HomePage extends React.Component {
	render() {
		return (
			<div className='HomePage'>
				<h1>TRAINZ</h1>
				<h2>How to play</h2>
				<p>
					TODO
				</p>

				<h2>Join a match</h2>
				<p>
					TODO
					<a href="/game/some-room-name/1">Player 1 link</a>
					<br />
					<a href="/game/some-room-name/2">Player 2 link</a>
				</p>
			</div>
		);
	}
}
