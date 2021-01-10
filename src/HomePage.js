import React from 'react';
import './HomePage.scss';
import CityNames from './util/city-names.json';

export class HomePage extends React.Component {
	render() {
		const roomName = CityNames.names[Math.floor(Math.random() * CityNames.names.length)];

		return (
			<div className='HomePage'>
				<h1>TRAINZ</h1>
				<h2>How to play</h2>
				<div className='instructions'>
					<p>
						Each turn, you will expand and upgrade their railroad network. Serve more passengers by creating new railways, constructing new metro stations, or buying upgrades.
					</p>

					<ul>
						<li><strong>Railway</strong> To create a railway, left-click a metro station. Then, click any adjacent cell to continue constructing the railway. The railway is complete when you connect stations together. You can also automatically generate a railway by left-clicking two stations. Each set of set of tracks costs $10.</li>
						<li><strong>Station</strong> To create a station, right-click on a cell. This station can only be used by the player who created it. Each station costs $500.</li>
						<li><strong>Upgrade</strong> To upgrade your network, click one of the three options shown below the map. Prices vary depending on the upgrade. </li>
					</ul>

					<p>
						When you are satisfied with your changes, you can click "End Turn."
						At the end of each turn, the railway will operate, delivering passengers and earning you money.
						The amount of money depends on the number of passengers served and the train fare you charge.
						If both players reach 1000 passengers on the same turn, then the game will be slightly extended, and the passenger count goal will be increased. The first person to reach the new goal is the winner!
					</p>
				</div>

				<h2>Create a match: <span>{roomName}</span></h2>
				<p>
					Click on one link for yourself and send the other to a friend!
				</p>

				<div className='links'>
					<a href={`/game/${roomName}/1`}>Player 1 link</a>
					<a href={`/game/${roomName}/2`}>Player 2 link</a>
				</div>
			</div>
		);
	}
}
