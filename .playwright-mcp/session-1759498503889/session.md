
### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "chrome-error://chromewebdata/"
}
```
- Code
```js
await page.goto('chrome-error://chromewebdata/');
```
- Snapshot: 001.snapshot.yml


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "chrome-error://chromewebdata/"
}
```
- Code
```js
await page.goto('chrome-error://chromewebdata/');
```
- Snapshot: 002.snapshot.yml


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "chrome-error://chromewebdata/"
}
```
- Code
```js
await page.goto('chrome-error://chromewebdata/');
```
- Snapshot: 003.snapshot.yml


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "chrome-error://chromewebdata/"
}
```
- Code
```js
await page.goto('chrome-error://chromewebdata/');
```
- Snapshot: 004.snapshot.yml


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "https://wordstat.yandex.com/"
}
```
- Code
```js
await page.goto('https://wordstat.yandex.com/');
```
- Snapshot: 005.snapshot.yml


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "https://wordstat.yandex.com/"
}
```
- Code
```js
await page.goto('https://wordstat.yandex.com/');
```
- Snapshot: 006.snapshot.yml


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "https://wordstat.yandex.com/"
}
```
- Code
```js
await page.goto('https://wordstat.yandex.com/');
```
- Snapshot: 007.snapshot.yml


### Tool call: browser_navigate
- Args
```json
{
  "url": "https://wordstat.yandex.com/"
}
```
- Code
```js
await page.goto('https://wordstat.yandex.com/');
```
- Snapshot: 008.snapshot.yml


### Tool call: browser_snapshot
- Args
```json
{}
```
- Snapshot: 009.snapshot.yml


### Tool call: browser_type
- Args
```json
{
  "element": "Поле ввода для поиска запросов",
  "ref": "e14",
  "text": "ритуальные услуги шуя",
  "submit": true
}
```
- Code
```js
await page.getByRole('textbox', { name: 'Enter a word or phrase' }).fill('ритуальные услуги шуя');
await page.getByRole('textbox', { name: 'Enter a word or phrase' }).press('Enter');
```
- Snapshot: 010.snapshot.yml


### User action: click
- Args
```json
{
  "name": "click",
  "ref": "e56",
  "button": "left",
  "modifiers": 0,
  "clickCount": 1
}
```
- Code
```js
await page.getByRole('button', { name: 'QR code' }).click();
```
- Snapshot: 011.snapshot.yml


### User action: navigate
- Args
```json
{
  "name": "navigate",
  "url": "https://wordstat.yandex.com/?region=all&view=table&words=%D1%80%D0%B8%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8%20%D1%88%D1%83%D1%8F"
}
```
- Code
```js
await page.goto('https://wordstat.yandex.com/?region=all&view=table&words=%D1%80%D0%B8%D1%82%D1%83%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8%20%D1%88%D1%83%D1%8F');
```
- Snapshot: 012.snapshot.yml


### User action: click
- Args
```json
{
  "name": "click",
  "ref": "e131",
  "button": "left",
  "modifiers": 0,
  "clickCount": 1
}
```
- Code
```js
await page.getByRole('button', { name: 'Дальше' }).click();
```
- Snapshot: 013.snapshot.yml


### User action: click
- Args
```json
{
  "name": "click",
  "button": "left",
  "modifiers": 0,
  "clickCount": 1
}
```
- Code
```js
await page.getByRole('button', { name: 'Close Tour' }).click();
```
- Snapshot: 014.snapshot.yml


### Tool call: browser_snapshot
- Args
```json
{}
```
- Snapshot: 015.snapshot.yml


### Tool call: browser_type
- Args
```json
{
  "element": "Поле ввода запроса",
  "ref": "e23",
  "text": "похоронное бюро шуя",
  "submit": true
}
```
- Code
```js
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).fill('похоронное бюро шуя');
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).press('Enter');
```
- Snapshot: 016.snapshot.yml


### Tool call: browser_type
- Args
```json
{
  "element": "Поле ввода запроса",
  "ref": "e23",
  "text": "организация похорон шуя",
  "submit": true
}
```
- Code
```js
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).fill('организация похорон шуя');
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).press('Enter');
```
- Snapshot: 017.snapshot.yml


### Tool call: browser_type
- Args
```json
{
  "element": "Поле ввода запроса",
  "ref": "e23",
  "text": "кремация шуя",
  "submit": true
}
```
- Code
```js
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).fill('кремация шуя');
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).press('Enter');
```
- Snapshot: 018.snapshot.yml


### Tool call: browser_type
- Args
```json
{
  "element": "Поле ввода запроса",
  "ref": "e23",
  "text": "памятники шуя",
  "submit": true
}
```
- Code
```js
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).fill('памятники шуя');
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).press('Enter');
```
- Snapshot: 019.snapshot.yml


### Tool call: browser_type
- Args
```json
{
  "element": "Поле ввода запроса",
  "ref": "e23",
  "text": "груз 200 шуя",
  "submit": true
}
```
- Code
```js
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).fill('груз 200 шуя');
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).press('Enter');
```
- Snapshot: 020.snapshot.yml


### Tool call: browser_type
- Args
```json
{
  "element": "Поле ввода запроса",
  "ref": "e23",
  "text": "благоустройство могил шуя",
  "submit": true
}
```
- Code
```js
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).fill('благоустройство могил шуя');
await page.getByRole('textbox', { name: 'Введите слово или словосочетание' }).press('Enter');
```
- Snapshot: 021.snapshot.yml


### Tool call: browser_close
- Args
```json
{}
```
- Code
```js
await page.close()
```

