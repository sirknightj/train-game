import React from 'react';

export class HomePage extends React.Component {
	render() {
		return (
			<div className='HomePage'>
				<h1>TRAINZ</h1>

				<h2>How to play</h2>
				<p>
					<strong>Requirements</strong>
					Players: 2

					<strong>Objective</strong>
					Each turn, you will expand and upgrade their railroad network. Serve more passengers by creating new railways, constructing new metro stations, or buying upgrades.
					<ol>
						<li>To create a railway, left-click a metro station. Then, click any adjacent cell to continue constructing the railway. The railway is complete when you connect stations together. You can also automatically generate a railway by left-clicking two stations. Each set of set of tracks costs $10.</li>
						<li>To create a station, right-click on a cell. This station can only be used by the player who created it. Each station costs $500.</li>
						<li>To upgrade your network, click one of the three options shown below the map. Prices vary depending on the upgrade.</li>
					</ol>

					When you are satisfied with your changes, you can click "End Turn". If you made a mistake while creating your railway, you can click "undo/redo" to revert the changes you have made.

					At the end of each turn, the railway will operate, allowing you to deliver passengers and earn money. The amount of money depends on how many passengers you serve, train fare that you charge, and the upgrades that you buy! 

					<strong>TieBreaker</strong>
					If both players reach 1000 passengers on the same turn, then the game will be slightly extended, and the goal passenger count goal will be increased. The first person to reach the new goal is the winner!			
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
