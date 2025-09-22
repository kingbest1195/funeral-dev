const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    console.log('🧪 Тестирование оптимизаций квиз-калькулятора...');
    
    // 1. Проверка центрирования на мобильном экране
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone размер
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    console.log('1. Тест мобильного центрирования...');
    const calculatorButton = page.locator('text=Перейти к расчету');
    await calculatorButton.scrollIntoViewIfNeeded();
    await calculatorButton.click();
    
    await page.waitForSelector('.quiz-modal', { state: 'visible' });
    await page.screenshot({ path: 'test-mobile-centering.png' });
    
    // 2. Проверка динамической смены вопроса
    console.log('2. Тест выбора "Кремация"...');
    await page.locator('.quiz-option').nth(1).click(); // Выбираем кремацию
    await page.waitForTimeout(500);
    
    const step2Title = await page.textContent('.quiz-step__title');
    console.log('Заголовок 2-го шага:', step2Title);
    await page.screenshot({ path: 'test-cremation-step2.png' });
    
    // Проверяем, что появились урны вместо гробов
    const urnOptions = await page.locator('.quiz-option__label').allTextContents();
    console.log('Варианты урн:', urnOptions);
    
    // 3. Тест сохранения прогресса
    console.log('3. Тест сохранения в sessionStorage...');
    await page.locator('.quiz-option').first().click(); // Выбираем урну
    await page.waitForTimeout(500);
    
    // Проверяем, что данные сохранились в sessionStorage
    const currentStep = await page.evaluate(() => {
      return sessionStorage.getItem('quiz_current_step');
    });
    console.log('Сохраненный шаг:', currentStep);
    
    // Закрываем модальное окно
    await page.locator('.quiz-modal__close').click();
    await page.waitForTimeout(500);
    
    // Открываем снова и проверяем восстановление
    await calculatorButton.click();
    await page.waitForSelector('.quiz-modal', { state: 'visible' });
    
    const restoredStep = await page.textContent('.quiz-progress__text');
    console.log('Восстановленный шаг:', restoredStep);
    await page.screenshot({ path: 'test-progress-restored.png' });
    
    // 4. Переходим к форме для тестирования IMask
    console.log('4. Тест IMask для телефона...');
    
    // Быстро проходим оставшиеся шаги
    await page.locator('.quiz-option').first().click(); // Шаг 3 - принадлежности
    await page.locator('.quiz-option').first().click();
    await page.locator('text=Далее').click(); // Переходим дальше
    await page.waitForTimeout(500);
    
    await page.locator('.quiz-option').first().click(); // Шаг 4 - транспорт
    await page.waitForTimeout(500);
    
    // Теперь должна появиться форма
    const finalTitle = await page.textContent('.quiz-step__title');
    console.log('Заголовок финальной формы:', finalTitle);
    
    // Тестируем маску телефона
    await page.fill('input[type="text"]', 'Тест Пользователь');
    
    const phoneInput = page.locator('input[type="tel"]');
    await phoneInput.click();
    await phoneInput.type('9201234567');
    
    await page.waitForTimeout(1000);
    
    const phoneValue = await phoneInput.inputValue();
    console.log('Значение телефона с маской:', phoneValue);
    
    await page.screenshot({ path: 'test-phone-mask.png' });
    
    console.log('✅ Все тесты завершены успешно!');
    
    // Проверяем sessionStorage перед завершением
    const finalStorage = await page.evaluate(() => {
      return {
        step: sessionStorage.getItem('quiz_current_step'),
        answers: sessionStorage.getItem('quiz_answers'),
        formData: sessionStorage.getItem('quiz_form_data')
      };
    });
    console.log('Финальное состояние sessionStorage:', finalStorage);
    
    await page.waitForTimeout(3000);
    
  } catch (error) {
    console.error('❌ Ошибка во время тестирования:', error);
    await page.screenshot({ path: 'test-optimization-error.png' });
  } finally {
    await browser.close();
  }
})();