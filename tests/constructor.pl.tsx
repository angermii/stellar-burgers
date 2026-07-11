import { test, expect, Page } from '@playwright/test';
async function addIngredients(page: Page) {
  // находим булку
  const bun = 'Краторная булка N-200i';
  const bunElement = page.locator(`li:has-text("${bun}")`);

  // нажатие кнопки добавить на булке
  await bunElement.getByRole('button', { name: /добавить/i }).click();

  // проверяем ее в конструкторе
  const bunTop = page.getByText(`${bun} (верх)`);
  const bunBottom = page.getByText(`${bun} (низ)`);
  await expect(bunTop).toBeVisible();
  await expect(bunBottom).toBeVisible();

  // находим начинку
  const ingredient = 'Говяжий метеорит (отбивная)';
  const ingredientElement = page.locator(`li:has-text("${ingredient}")`);

  // нажатие кнопки добавить на начинке
  await ingredientElement.getByRole('button', { name: /добавить/i }).click();

  // проверяем в конструкторе
  await expect(
    page.locator(`.constructor-element:has-text("${ingredient}")`)
  ).toBeVisible();
}

test('HAR-файл пользователя', async ({ page }) => {
  const responce = await page.request.post(
    'https://norma.education-services.ru/api/auth/login',
    {
      data: {
        email: 'user@test.com',
        password: '111111'
      }
    }
  );

  const loginData = await responce.json();

  // Извлекаем токены из ответа
  const accessToken = loginData.accessToken;
  const refreshToken = loginData.refreshToken;

  await page.addInitScript(
    ({ accessToken, refreshToken }) => {
      document.cookie = `accessToken=${accessToken}; path=/`;
      localStorage.setItem('refreshToken', refreshToken);
    },
    { accessToken, refreshToken }
  );

  await page.routeFromHAR('./tests/hars/users.har', {
    url: '**/auth/user',
    update: false
  });

  const responcePromise = page.waitForResponse((responce) =>
    responce.url().includes('/auth/user')
  );

  await page.goto('/');

  await responcePromise;
});

test('HAR-файл ингредиентов', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/ingredients',
    update: false // Режим записи
  });

  await page.goto('/');

  await expect(
    page.getByRole('button', { name: /добавить/i }).first()
  ).toBeVisible();
});

test.describe('Создание заказа с пользователем и ингредиентами HAR', () => {
  test('открытие модальных окн ингредиентов', async ({ page }) => {
    // загрузка ингредиентов
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients'
    });

    await page.goto('/');

    // находим булку и кликаем
    const bun = 'Краторная булка N-200i';
    const bunElement = page.locator(`li:has-text("${bun}") a`);
    await expect(bunElement).toBeVisible();
    await bunElement.click();

    // модальное окно открылось
    const modal = page
      .locator('h3:has-text("Ingredient Details")')
      .locator('../..');
    await expect(modal).toBeVisible();
    await expect(modal).toContainText(bun);

    // закрытие по кнопке
    await modal
      .locator('button')
      .filter({ has: page.locator('svg') })
      .click();
    await expect(modal).not.toBeVisible();

    // закрытие по оверлею
    await page.getByText(bun).click();
    await expect(modal).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(modal).not.toBeVisible();
  });

  test('добавление булки и начинки', async ({ page }) => {
    // загрузка ингредиентов
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients'
    });

    // загрузка пользователя
    await page.routeFromHAR('./tests/hars/users.har', {
      url: '**/auth/user'
    });

    // open page
    await page.goto('/');

    await addIngredients(page);
  });

  test('оформление заказа', async ({ page }) => {
    // загрузка ингредиентов
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/ingredients'
    });

    // загрузка пользователя
    await page.routeFromHAR('./tests/hars/users.har', {
      url: '**/auth/user'
    });

    // загрузка ордера
    await page.routeFromHAR('./tests/hars/order.har', {
      url: '**/orders',
      update: false // Режим записи
    });

    // open page
    await page.goto('/');

    await addIngredients(page);

    // оформляем заказ
    await page.getByRole('button', { name: /оформить заказ/i }).click();

    // модалка с заказом открылась
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    const modal = page.getByText('идентификатор заказа').locator('../..');

    // проверка очищение конструктора
    await expect(page.getByText('Выберите начинку')).toBeVisible();
    await expect(page.getByText('Выберите булки').first()).toBeVisible();

    // закрытие по кнопке
    await modal
      .locator('button')
      .filter({ has: page.locator('svg') })
      .click();
    await expect(modal).not.toBeVisible();
  });
});
