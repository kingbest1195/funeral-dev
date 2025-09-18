
### Tool call: browser_navigate
- Args
```json
{
  "url": "http://localhost:3001"
}
```
- Code
```js
await page.goto('http://localhost:3001');
```
- Snapshot: 001.snapshot.yml


### Tool call: browser_console_messages
- Args
```json
{}
```
- Result
```
[DEBUG] [vite] connecting... @ http://localhost:3001/@vite/client:732
[DEBUG] [vite] connected. @ http://localhost:3001/@vite/client:826
[INFO] %cDownload the React DevTools for a better development experience: https://react.dev/link/react-devtools font-weight:bold @ http://localhost:3001/node_modules/.vite/deps/react-dom_client.js?v=1074e000:17994
[ERROR] Invalid DOM property `%s`. Did you mean `%s`? fetchpriority fetchPriority @ http://localhost:3001/node_modules/.vite/deps/react-dom_client.js?v=1074e000:2400
[LOG] 🔄 Начинаем loadReviews @ http://localhost:3001/src/components/ReviewsWidget/ReviewsWidget.jsx:120
[LOG] 📦 Использую кешированные отзывы: 9 @ http://localhost:3001/src/components/ReviewsWidget/ReviewsWidget.jsx:123
[LOG] 🔍 Уникальных кешированных отзывов: 9 из 9 @ http://localhost:3001/src/components/ReviewsWidget/ReviewsWidget.jsx:131
[LOG] 🔄 Начинаем loadReviews @ http://localhost:3001/src/components/ReviewsWidget/ReviewsWidget.jsx:120
[LOG] 📦 Использую кешированные отзывы: 9 @ http://localhost:3001/src/components/ReviewsWidget/ReviewsWidget.jsx:123
[LOG] 🔍 Уникальных кешированных отзывов: 9 из 9 @ http://localhost:3001/src/components/ReviewsWidget/ReviewsWidget.jsx:131
[WARNING] (Yandex Maps JS API): Invalid API key @ https://api-maps.yandex.ru/2.1/?apikey=483677e0-faaf-4b9c-8cbb-6e92f31ae683&lang=ru_RU:0
```

