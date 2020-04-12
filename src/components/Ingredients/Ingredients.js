import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import Search from './Search';

const Ingredients = () => {
	const [ userIngredients, setUserIngredients ] = useState([]);

	const addIngredientHandle = ingredient => {
		setUserIngredients(prevIngredients => [
			...prevIngredients,
			{ id: Math.floor(Math.random() * 100).toString(), ...ingredient }
		]);
	};

	const onRemoveIngredient = ingredientId => {
		// return setUserIngredients(userIngredients.filter(ingredient => ingredient.id !== ingredientId));
		setUserIngredients(prevIngredients =>
			prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
		);
	};

	return (
		<div className='App'>
			<IngredientForm onAddIngredient={addIngredientHandle} />

			<section>
				<Search />
				<IngredientList ingredients={userIngredients} onRemoveItem={onRemoveIngredient} />
			</section>
		</div>
	);
};

export default Ingredients;
