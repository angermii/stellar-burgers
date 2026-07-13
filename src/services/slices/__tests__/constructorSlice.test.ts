import { expect, test, describe } from '@jest/globals';
import reducer, {
  addIngredient,
  clearConstructor,
  initialState,
  moveIngredient,
  removeIngredient
} from '../constructorSlice';

const bunIngredient = {
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
};

const mainIngredients = [
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
  }
];

let counter: number;
beforeEach(() => {
  counter = 1;
});

jest.mock('@reduxjs/toolkit', () => ({
  ...jest.requireActual('@reduxjs/toolkit'),
  nanoid: jest.fn(() => `id-${counter++}`)
}));

describe('тест синхронных экшенов constructorSlice', () => {
  test('получения экшена, несуществующего в приложении', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  test('addIngredient добавление булки', () => {
    const newState = reducer(initialState, addIngredient(bunIngredient));

    expect(newState.bun).toEqual({ ...bunIngredient, id: 'id-1' });
    expect(newState.ingredients).toEqual([]);
  });

  test('addIngredient добавление начинки', () => {
    const state = reducer(initialState, addIngredient(mainIngredients[0]));

    expect(state.ingredients).toEqual([{ ...mainIngredients[0], id: 'id-1' }]);
    const newState = reducer(state, addIngredient(mainIngredients[1]));

    expect(newState.ingredients).toHaveLength(2);
  });

  test('removeIngredient, удаление ингредиента', () => {
    const state = {
      bun: null,
      ingredients: [
        { ...mainIngredients[0], id: 'id-1' },
        { ...mainIngredients[1], id: 'id-2' }
      ]
    };
    const newState = reducer(
      state,
      removeIngredient({ ...mainIngredients[0], id: 'id-1' })
    );

    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients).toEqual([
      { ...mainIngredients[1], id: 'id-2' }
    ]);
  });

  test('clearConstructor, очистка конструктора', () => {
    const state = {
      bun: { ...bunIngredient, id: 'bun:id' },
      ingredients: [
        { ...mainIngredients[0], id: 'id-1' },
        { ...mainIngredients[1], id: 'id-2' }
      ]
    };

    const newState = reducer(state, clearConstructor());
    expect(newState).toEqual(initialState);
  });

  test('moveIngredient, движение ингредиента', () => {
    const ingredients = [
      { ...mainIngredients[0], id: 'id-1' },
      { ...mainIngredients[0], id: 'id-2' },
      { ...mainIngredients[1], id: 'id-3' }
    ];
    const state = { bun: null, ingredients: [...ingredients] };

    const newState = reducer(state, moveIngredient({ from: 0, to: 2 }));
    expect(newState.ingredients).toEqual([
      ingredients[1],
      ingredients[2],
      ingredients[0]
    ]);
  });
});
