import React, { useReducer, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

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

const httpReducer = (currentHttpState, action) => {
	switch (action.type) {
		case 'SEND':
			return { loading: true, error: null };
		case 'RESPONSE':
			return { ...currentHttpState, loading: false };
		case 'ERROR':
			return { loading: false, error: action.errorMessage };
		case 'CLEAR':
			return { ...currentHttpState, error: null };
		default:
			throw new Error('Should not get there again!');
	}
};

const Ingredients = () => {
	const [ userIngredients, dispatch ] = useReducer(ingredientReducer, []);
	const [ httpState, dispatchHttp ] = useReducer(httpReducer, { loading: false, error: null });
	// const [ userIngredients, setUserIngredients ] = useState([]);
	// const [ isLoading, setIsloading ] = useState(false);
	// const [ error, setError ] = useState();

	useEffect(
		() => {
			console.log('Rendering Ingredients', userIngredients);
		},
		[ userIngredients ]
	);

	const filteredIngredientHandler = useCallback(filteredIngredients => {
		// setUserIngredients(filteredIngredients);
		dispatch({ type: 'SET', ingredients: filteredIngredients });
	}, []);

	const addIngredientHandle = ingredient => {
		dispatchHttp({ type: 'SEND' });
		fetch('https://ingredients-using-hooks.firebaseio.com/ingredients.json', {
			method: 'POST',
			body: JSON.stringify(ingredient),
			headers: { 'Content-Type': 'application/json' }
		})
			.then(response => {
				dispatchHttp({ type: 'RESPONSE' });
				return response.json();
			})
			.then(responseData => {
				// setUserIngredients(prevIngredients => [
				// 	...prevIngredients,
				// 	{ id: responseData.name, ...ingredient }
				// ]);
				dispatch({
					type: 'ADD',
					ingredient: { id: responseData.name, ...ingredient }
				});
			});
	};

	const onRemoveIngredient = ingredientId => {
		dispatchHttp({ type: 'SEND' });
		// return setUserIngredients(userIngredients.filter(ingredient => ingredient.id !== ingredientId));
		fetch(`https://ingredients-using-hooks.firebaseio.com/ingredients/${ingredientId}.json`, {
			method: 'DELETE'
		})
			.then(response => {
				dispatchHttp({ type: 'RESPONSE' });
				// setUserIngredients(prevIngredients =>
				// 	prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
				// );
				dispatch({ type: 'DELETE', id: ingredientId });
			})
			.catch(error => {
				dispatchHttp({
					type: 'ERROR',
					errorMessage: 'Something went wrong with the Deleting the request'
				});
			});
	};

	const clearError = () => {
		dispatchHttp({ type: 'CLEAR' });
	};

	return (
		<div className='App'>
			{httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

			<IngredientForm onAddIngredient={addIngredientHandle} loading={httpState.loading} />

			<section>
				<Search onLoadIngredients={filteredIngredientHandler} />
				<IngredientList ingredients={userIngredients} onRemoveItem={onRemoveIngredient} />
			</section>
		</div>
	);
};

export default Ingredients;
