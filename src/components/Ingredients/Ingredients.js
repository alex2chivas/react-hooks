import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const Ingredients = () => {
	const [ userIngredients, setUserIngredients ] = useState([]);
	const [ isLoading, setIsloading ] = useState(false);
	const [ error, setError ] = useState();

	useEffect(
		() => {
			console.log('Rendering Ingredients', userIngredients);
		},
		[ userIngredients ]
	);

	const filteredIngredientHandler = useCallback(filteredIngredients => {
		setUserIngredients(filteredIngredients);
	}, []);

	const addIngredientHandle = ingredient => {
		setIsloading(true);
		fetch('https://ingredients-using-hooks.firebaseio.com/ingredients.json', {
			method: 'Post',
			body: JSON.stringify(ingredient),
			headers: { 'Content-Type': 'application/json' }
		})
			.then(response => {
				setIsloading(false);
				return response.json();
			})
			.then(responseData => {
				setUserIngredients(prevIngredients => [
					...prevIngredients,
					{ id: responseData.name, ...ingredient }
				]);
			});
	};

	const onRemoveIngredient = ingredientId => {
		setIsloading(true);
		// return setUserIngredients(userIngredients.filter(ingredient => ingredient.id !== ingredientId));
		fetch(`https://ingredients-using-hooks.firebaseio.com/ingredients/${ingredientId}.json`, {
			method: 'DELETE'
		})
			.then(response => {
				setIsloading(false);
				setUserIngredients(prevIngredients =>
					prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
				);
			})
			.catch(error => {
				console.log('Something went wrong with deleting your request');
				setIsloading(false);
			});
	};

	const clearError = () => {
		setError(null);
	};

	return (
		<div className='App'>
			{error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}

			<IngredientForm onAddIngredient={addIngredientHandle} loading={isLoading} />

			<section>
				<Search onLoadIngredients={filteredIngredientHandler} />
				<IngredientList ingredients={userIngredients} onRemoveItem={onRemoveIngredient} />
			</section>
		</div>
	);
};

export default Ingredients;
