const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('1. Навигация на главную страницу...');
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Скриншот главной страницы
    await page.screenshot({ path: 'test-1-homepage.png', fullPage: true });
    
    console.log('2. Поиск кнопки "Перейти к расчету"...');
    const calculatorButton = page.locator('text=Перейти к расчету');
    await calculatorButton.waitFor({ state: 'visible' });
    
    // Прокрутка к кнопке
    await calculatorButton.scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'test-2-calculator-button.png' });
    
    console.log('3. Клик по кнопке калькулятора...');
    await calculatorButton.click();
    
    // Ждем появления модального окна
    await page.waitForSelector('.quiz-modal', { state: 'visible' });
    await page.screenshot({ path: 'test-3-quiz-opened.png' });
    
    console.log('4. Проверка первого шага квиза...');
    // Проверяем заголовок
    const step1Title = await page.textContent('.quiz-step__title');
    console.log('Заголовок шага 1:', step1Title);
    
    // Проверяем наличие иконок
    const icons = await page.locator('.quiz-option__icon img').count();
    console.log('Количество иконок:', icons);
    
    await page.screenshot({ path: 'test-4-step1-icons.png' });
    
    console.log('5. Выбор первого варианта...');
    await page.locator('.quiz-option').first().click();
    
    // Ждем перехода ко второму шагу
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-5-step2.png' });
    
    console.log('6. Проверка второго шага...');
    const step2Title = await page.textContent('.quiz-step__title');
    console.log('Заголовок шага 2:', step2Title);
    
    // Выбираем вариант на втором шаге
    await page.locator('.quiz-option').first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-6-step3.png' });
    
    console.log('7. Проверка третьего шага (множественный выбор)...');
    const step3Title = await page.textContent('.quiz-step__title');
    console.log('Заголовок шага 3:', step3Title);
    
    // Выбираем несколько вариантов
    await page.locator('.quiz-option').first().click();
    await page.locator('.quiz-option').nth(1).click();
    
    // Нажимаем "Далее"
    await page.locator('text=Далее').click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-7-step4.png' });
    
    console.log('8. Проверка четвертого шага...');
    const step4Title = await page.textContent('.quiz-step__title');
    console.log('Заголовок шага 4:', step4Title);
    
    await page.locator('.quiz-option').first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'test-8-final-form.png' });
    
    console.log('9. Проверка финальной формы...');
    const finalTitle = await page.textContent('.quiz-step__title');
    console.log('Заголовок финальной формы:', finalTitle);
    
    // Заполняем форму
    await page.fill('input[type="text"]', 'Тест Тестович');
    await page.fill('input[type="tel"]', '+7 920 123-45-67');
    
    await page.screenshot({ path: 'test-9-form-filled.png' });
    
    console.log('10. Тестирование завершено успешно!');
    console.log('Все скриншоты сохранены в корневой папке проекта');
    
    await page.waitForTimeout(2000);
    
  } catch (error) {
    console.error('Ошибка во время тестирования:', error);
    await page.screenshot({ path: 'test-error.png' });
  } finally {
    await browser.close();
  }
})();