import React, { useState , useEffect} from 'react';

import './IngredientList.css';
import ingredientsApiCall from '../../api/ingredients'

const IngredientList = props => {
  const [ingredients, setIngredients] = useState([])

  const fetchLists = async () => {
    const response = await ingredientsApiCall.get('/ingredients')
    setIngredients(response.data)
  }

  useEffect(() => {
    fetchLists()
  }, [props.ingredients]);

  return (
    <section className="ingredient-list">
      <h2>Loaded Ingredients</h2>
      <ul>
        {ingredients.map(ig => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
