import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';
import ingredientsApiCall from '../../api/ingredients';

const IngredientForm = React.memo(props => {
	const [ enteredTitle, setEnteredTitle ] = useState('');
	const [ enteredAmount, setEnteredAmount ] = useState('');

	const submitHandler = async event => {
		event.preventDefault();
		const response = await ingredientsApiCall.post('/ingredients', {
			title: enteredTitle,
			amount: enteredAmount
		});
		props.onAddIngredient(response.data);
	};

	return (
		<section className='ingredient-form'>
			<Card>
				<form onSubmit={submitHandler}>
					<div className='form-control'>
						<label htmlFor='title'>Name</label>
						<input
							type='text'
							id='title'
							value={enteredTitle}
							onChange={event => {
								setEnteredTitle(event.target.value);
							}}
						/>
					</div>
					<div className='form-control'>
						<label htmlFor='amount'>Amount</label>
						<input
							type='number'
							id='amount'
							value={enteredAmount}
							onChange={event => {
								setEnteredAmount(event.target.value);
							}}
						/>
					</div>
					<div className='ingredient-form__actions'>
						<button type='submit'>Add Ingredient</button>
					</div>
				</form>
			</Card>
		</section>
	);
});

export default IngredientForm;
