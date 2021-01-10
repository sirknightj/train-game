import React from 'react';
const options = require('./util/upgrades.json');


export class Upgrades extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            upgrade : options.upgrades[Math.floor(Math.random() * options.upgrades.length)],
            purchased : false
        };
    }

    purchase = () => {
        if (!this.state.purchased) {
            alert("Purchase " + this.state.upgrade.title);
            this.props.moves.purchaseUpgrade(this.state.upgrade);
            this.setState({
                purchased : true
            });
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.purchase}>{this.state.upgrade.title}</button>
            </div>
        );
    }
}
