# Team Zetrax Wallpaper

A "Skull AI" live-wallpaper new-tab extension for Chrome.

## Features
- Live video wallpaper (`img/bg.webm`)
- Search bar with an engine selector: Google, Startpage, Brave, Bing, DuckDuckGo
- Add / remove your own website shortcuts
- Google Apps launcher
- Tool launchers: **Gen AI** link menu, **AI Tool** honeycomb, **Edit Tool**, **Dev Tool** and **Electronics Tool**
- Tooltips and blur overlays for a clean look

## Install
1. Open `chrome://extensions` and enable **Developer mode**.
2. Click **Load unpacked** and select this folder.
3. Open a new tab.

No API keys are needed.

## Permissions
Only `search` (to run searches with Chrome's default search provider). Fonts come from Google Fonts.

## Notes
- `bg.js` clears the extension's IndexedDB databases on startup.
- `s.js`, `test.html`, `test1.html` and `test2.html` are experiments and are not loaded by `index.html`. Delete them if you don't need them.
