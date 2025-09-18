
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


### Tool call: browser_evaluate
- Args
```json
{
  "function": "() => {\n  // Прокручиваем к секции с картой\n  const mapSection = document.querySelector('.contacts-map');\n  if (mapSection) {\n    mapSection.scrollIntoView({ behavior: 'smooth' });\n    return 'Прокручиваем к секции с картой';\n  }\n  return 'Секция с картой не найдена';\n}"
}
```
- Result
```
"Прокручиваем к секции с картой"
```
- Code
```js
await page.evaluate('() => {\n  // Прокручиваем к секции с картой\n  const mapSection = document.querySelector(\'.contacts-map\');\n  if (mapSection) {\n    mapSection.scrollIntoView({ behavior: \'smooth\' });\n    return \'Прокручиваем к секции с картой\';\n  }\n  return \'Секция с картой не найдена\';\n}');
```
- Snapshot: 002.snapshot.yml

