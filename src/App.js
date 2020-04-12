import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Ingredients from './components/Ingredients/Ingredients';

const App = props => {
	return (
		<BrowserRouter>
			<Switch>
				<Route path='/ingredients' component={Ingredients} />
				<Route path='/ingredients/:id' component={Ingredients} />
			</Switch>
		</BrowserRouter>
	);
};

export default App;
