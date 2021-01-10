import { HomePage } from './HomePage';
import { Match } from './Match';
import { Switch, Route, useHistory } from 'react-router';

const App = () => {
	const history = useHistory();

	return (
		<Switch>
			<Route
				path="/"
				exact
				render={(props) => <HomePage {...props} history={history} />}
			/>
			<Route path="/game/:match/:id" component={Match} />
		</Switch >
	);
};

export default App;
