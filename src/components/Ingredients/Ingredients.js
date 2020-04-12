import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
	const [ userIngredients, setUserIngredients ] = useState([]);

	const addIngredientHandle = ingredient => {
		fetch('https://ingredients-using-hooks.firebaseio.com/ingredients.json', {
			method: 'Post',
			body: JSON.stringify(ingredient),
			headers: { 'Content-Type': 'application/json' }
		})
			.then(response => {
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
		// return setUserIngredients(userIngredients.filter(ingredient => ingredient.id !== ingredientId));
		setUserIngredients(prevIngredients =>
			prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
		);
	};

	const filteredIngredientHandler = useCallback(filteredIngredients => {
		setUserIngredients(filteredIngredients)
	}, [])

	return (
		<div className='App'>
			<IngredientForm onAddIngredient={addIngredientHandle} />

			<section>
				<Search onLoadIngredients={filteredIngredientHandler} />
				<IngredientList ingredients={userIngredients} onRemoveItem={onRemoveIngredient} />
			</section>
		</div>
	);
};

export default Ingredients;
