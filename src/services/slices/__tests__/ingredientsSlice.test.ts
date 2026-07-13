import { expect, test, describe } from '@jest/globals';
import store from '../../store';
import * as api from '@api';
import reducer, { initialState, fetchIngredients } from '../ingredientsSlice';

const expectedResult = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093f',
    name: 'Мясо бессмертных моллюсков Protostomia',
    type: 'main',
    proteins: 433,
    fat: 244,
    carbohydrates: 33,
    calories: 420,
    price: 1337,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0940',
    name: 'Говяжий метеорит (отбивная)',
    type: 'main',
    proteins: 800,
    fat: 800,
    carbohydrates: 300,
    calories: 2674,
    price: 3000,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa093d',
    name: 'Флюоресцентная булка R2-D3',
    type: 'bun',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0944',
    name: 'Соус традиционный галактический',
    type: 'sauce',
    proteins: 42,
    fat: 24,
    carbohydrates: 42,
    calories: 99,
    price: 15,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0945',
    name: 'Соус с шипами Антарианского плоскоходца',
    type: 'sauce',
    proteins: 101,
    fat: 99,
    carbohydrates: 100,
    calories: 100,
    price: 88,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0946',
    name: 'Хрустящие минеральные кольца',
    type: 'main',
    proteins: 808,
    fat: 689,
    carbohydrates: 609,
    calories: 986,
    price: 300,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0947',
    name: 'Плоды Фалленианского дерева',
    type: 'main',
    proteins: 20,
    fat: 5,
    carbohydrates: 55,
    calories: 77,
    price: 874,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0948',
    name: 'Кристаллы марсианских альфа-сахаридов',
    type: 'main',
    proteins: 234,
    fat: 432,
    carbohydrates: 111,
    calories: 189,
    price: 762,
    image: '...',
    image_mobile: '...',
    image_large: '...'
  },
  {
    _id: '643d69a5c3f7b9001cfa0949',
    name: 'Мини-салат Экзо-Плантаго',
    type: 'main',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 6,
    price: 4400,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa094a',
    name: 'Сыр с астероидной плесенью',
    type: 'main',
    proteins: 84,
    fat: 48,
    carbohydrates: 420,
    calories: 3377,
    price: 4142,
    image: '...',
    image_mobile: '...',
    image_large: '...',
    __v: 0
  }
];

describe('тест синхронных экшенов ingredientsSlice', () => {
  test('получения экшена, несуществующего в приложении', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('pending', () => {
    expect(
      reducer(initialState, fetchIngredients.pending('', undefined))
    ).toEqual({ ...initialState, loading: true, error: null });
  });

  test('rejected', () => {
    expect(
      reducer(
        initialState,
        fetchIngredients.rejected(new Error('ошибка'), '', undefined)
      )
    ).toEqual({ ...initialState, loading: false, error: 'ошибка' });
  });

  test('fulfilled', () => {
    expect(
      reducer(
        initialState,
        fetchIngredients.fulfilled(expectedResult, '', undefined)
      )
    ).toEqual({ ...initialState, loading: false, ingredients: expectedResult });
  });
});

describe('тест асинхронных экшенов ingredientsSlice', () => {
  test('получения ингредиентов', async () => {
    const getIngredientsSpy = jest
      .spyOn(api, 'getIngredientsApi')
      .mockResolvedValue(expectedResult);

    await store.dispatch(fetchIngredients());
    const { ingredients } = store.getState().ingredients;

    // сравнение
    expect(ingredients).toEqual(expectedResult);
    // проверяем что функция `getTracksSpy` была вызвана 1 раз
    expect(getIngredientsSpy).toHaveBeenCalledTimes(1);
  });
});
