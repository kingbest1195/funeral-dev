import { chromium } from 'playwright';

(async () => {
  console.log('Запуск браузера...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Открытие страницы http://localhost:3001...');
  try {
    await page.goto('http://localhost:3001', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    console.log('Создание скриншота...');
    await page.screenshot({ 
      path: 'homepage-screenshot.png',
      fullPage: true
    });
    
    console.log('Скриншот сохранен как homepage-screenshot.png');
    
    // Получаем заголовок страницы для проверки
    const title = await page.title();
    console.log('Заголовок страницы:', title);
    
    // Также получим статус загрузки CSS
    const cssLinks = await page.$$eval('link[rel="stylesheet"]', links => 
      links.map(link => ({ href: link.href, loaded: link.sheet !== null }))
    );
    console.log('CSS файлы:', cssLinks);
    
  } catch (error) {
    console.error('Ошибка при открытии страницы:', error.message);
  }
  
  await browser.close();
  console.log('Браузер закрыт');
})();