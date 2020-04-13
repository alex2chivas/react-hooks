import React, { useReducer, useEffect, useCallback, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

// Note - currentIngredients is actually state
const ingredientReducer = (currentIngredients, action) => {
	switch (action.type) {
		case 'SET':
			return action.ingredients;
		case 'ADD':
			return [ ...currentIngredients, action.ingredient ];
		case 'DELETE':
			return currentIngredients.filter(ing => ing.id !== action.id);
		default:
			throw new Error('Should not get there!');
	}
};

const Ingredients = () => {
	const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);
	const { isLoading, error, data, sendRequest, reqExtra, reqIdentifer } = useHttp();

	// const [ userIngredients, setUserIngredients ] = useState([]);
	// const [ isLoading, setIsloading ] = useState(false);
	// const [ error, setError ] = useState();

	useEffect(
		() => {
			if (!isLoading && !error && reqIdentifer === 'REMOVE_INGREDIENT') {
				dispatch({ type: 'DELETE', id: reqExtra });
			} else if (!isLoading && !error && reqIdentifer === 'ADD_INGREDIENT') {
				dispatch({ type: 'ADD', ingredient: { id: data.name, ...reqExtra } });
			}
		},
		[ data, reqExtra, reqIdentifer ]
	);

	const filteredIngredientHandler = useCallback(filteredIngredients => {
		// setUserIngredients(filteredIngredients);
		dispatch({ type: 'SET', ingredients: filteredIngredients });
	}, []);

	const addIngredientHandle = useCallback(ingredient => {
		sendRequest(
			'https://ingredients-using-hooks.firebaseio.com/ingredients.json',
			'POST',
			JSON.stringify(ingredient),
			ingredient,
			'ADD_INGREDIENT'
		);
		// dispatchHttp({ type: 'SEND' });
		// fetch('https://ingredients-using-hooks.firebaseio.com/ingredients.json', {
		// 	method: 'POST',
		// 	body: JSON.stringify(ingredient),
		// 	headers: { 'Content-Type': 'application/json' }
		// })
		// 	.then(response => {
		// 		dispatchHttp({ type: 'RESPONSE' });
		// 		return response.json();
		// 	})
		// 	.then(responseData => {
		// 		// setUserIngredients(prevIngredients => [
		// 		// 	...prevIngredients,
		// 		// 	{ id: responseData.name, ...ingredient }
		// 		// ]);
		// 		dispatch({
		// 			type: 'ADD',
		// 			ingredient: { id: responseData.name, ...ingredient }
		// 		});
		// 	});
	}, []);

	const onRemoveIngredient = useCallback(
		ingredientId => {
			sendRequest(
				`https://ingredients-using-hooks.firebaseio.com/ingredients/${ingredientId}.json`,
				'DELETE',
				null,
				ingredientId,
				'REMOVE_INGREDIENT'
			);
			// return setUserIngredients(userIngredients.filter(ingredient => ingredient.id !== ingredientId));
		},
		[ sendRequest ]
	);

	const clearError = useCallback(() => {
		// dispatchHttp({ type: 'CLEAR' });
	}, []);

	const ingredientList = useMemo(
		() => {
			return <IngredientList ingredients={userIngredients} onRemoveItem={onRemoveIngredient} />;
		},
		[ userIngredients, onRemoveIngredient ]
	);

	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

			<IngredientForm onAddIngredient={addIngredientHandle} loading={isLoading} />

			<section>
				<Search onLoadIngredients={filteredIngredientHandler} />
				{ingredientList}
			</section>
		</div>
	);
};

export default Ingredients;
