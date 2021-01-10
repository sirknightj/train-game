import React from 'react';
import options from './util/upgrades.json';

export class Upgrades extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            upgrade : options.upgrades[Math.floor(Math.random() * options.upgrades.length)],
            purchased : false,
            lastTurn : 0
        };
    }

    purchase = () => {
        // ignore clicks when it is not player's turn
        if (!this.props.isActive) {
            return;
        }

        if (!this.state.purchased) {
            alert(`Successfully purchased ${this.state.upgrade.title}!`);
            this.props.moves.purchaseUpgrade(this.state.upgrade);
            this.setState({
                upgrade : options.upgrades[Math.floor(Math.random() * options.upgrades.length)],
            });
        }
    }

    render() {
        const cost = this.state.upgrade.cost;
        const money = this.props.G[(this.props.playerID === '0') ? 'player1' : 'player2'].money;

        const canAfford = money >= cost;

        return (
            <button title={this.state.upgrade.description} onClick={this.purchase} className={canAfford ? 'affordable' : 'expensive'}>{this.state.upgrade.title} (${cost})</button>
        );
    }
}
