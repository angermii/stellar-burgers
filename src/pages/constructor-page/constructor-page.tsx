import { useSelector } from '../../services/store';

import styles from './constructor-page.module.css';

import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import { FC } from 'react';

export const ConstructorPage: FC = () => {
  const isIngredientsLoading = useSelector(
    (state) => state.ingredients.loading
  );
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const error = useSelector((state) => state.ingredients.error);
  if (isIngredientsLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className={`${styles.error} text text_type_main-medium pt-4`}>
        {error}
      </div>
    );
  }

  if (ingredients.length > 0) {
    return (
      <main className={styles.containerMain}>
        <h1
          className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
        >
          Соберите бургер
        </h1>
        <div className={`${styles.main} pl-5 pr-5`}>
          <BurgerIngredients />
          <BurgerConstructor />
        </div>
      </main>
    );
  } else {
    return (
      <div className={`${styles.title} text text_type_main-medium pt-4`}>
        Нет игредиентов
      </div>
    );
  }
};
