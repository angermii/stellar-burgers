import { useSelector } from '../../services/store';

import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO1: взять переменную из стора */
  const { id } = useParams();
  const { ingredients } = useSelector((state) => state.ingredients);

  const ingredientData = useMemo(
    () => ingredients.find((item) => item._id === id) || null,
    [ingredients, id]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
