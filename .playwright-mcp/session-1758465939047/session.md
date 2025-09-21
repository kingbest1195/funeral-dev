
### Tool call: browser_navigate
- Args
```json
{
  "url": "https://github.com/kingbest1195/funeral-dev/actions"
}
```
- Code
```js
await page.goto('https://github.com/kingbest1195/funeral-dev/actions');
```
- Snapshot: 001.snapshot.yml


### Tool call: browser_click
- Args
```json
{
  "element": "failed workflow run link",
  "ref": "e209"
}
```
- Code
```js
await page.getByRole('link', { name: 'failed: Run 1 of Deploy to' }).click();
```
- Snapshot: 002.snapshot.yml


### Tool call: browser_click
- Args
```json
{
  "element": "deploy job link",
  "ref": "e460"
}
```
- Code
```js
await page.getByRole('link', { name: 'failed: deploy 3s' }).click();
```
- Snapshot: 003.snapshot.yml


### Tool call: browser_close
- Args
```json
{}
```
- Code
```js
await page.close()
```

