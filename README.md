# Team Zetrax Chrome Extensions

Two custom **Chrome new-tab extensions** (Manifest V3) with live video wallpapers, search, shortcuts and built-in tools.

| Extension | Folder | What it is |
|-----------|--------|------------|
| **Skull ZEN** | [`skull-zen/`](skull-zen/) | A dashboard-style new tab: clock, weather, AI greeting, sticky notes, speed gauge, GPU/FPS/battery stats, app launchers |
| **Team Zetrax Wallpaper** | [`team-zetrax-wallpaper/`](team-zetrax-wallpaper/) | A cleaner live-wallpaper new tab: multi-engine search, shortcuts, and AI / Edit / Dev / Electronics tool launchers |

Made by **Soumayadeep Pal (Espal) & Team Zetrax**.

## Repository layout

```
.
├── skull-zen/                 # Extension 1 (load this folder in Chrome)
│   ├── manifest.json
│   ├── newtab.html
│   ├── js/  css/  img/  _locales/
│   ├── js/config.example.js   # copy to js/config.js and add your API keys
│   └── app.py                 # optional helper: pushes Chrome memory usage to Firebase
├── team-zetrax-wallpaper/     # Extension 2 (load this folder in Chrome)
│   ├── manifest.json
│   ├── index.html
│   └── ...
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## Install (developer mode)

1. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/Team-Zetrax-Chrome-Extensions.git
   ```
2. Open `chrome://extensions` and switch on **Developer mode**.
3. Click **Load unpacked** and pick **one** extension folder (`skull-zen/` or `team-zetrax-wallpaper/`).
4. Open a new tab.

> Chrome allows only one extension to override the new tab page at a time, so enable one of the two.

For Skull ZEN, create your API keys file first. See [`skull-zen/README.md`](skull-zen/README.md).

## Security

API keys are **not** stored in this repository. `js/config.js` is git-ignored; use `config.example.js` as a template. Keys inside any browser extension can be read by whoever installs it, so restrict them in the provider's console (HTTP referrer / API restrictions and quotas).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE) for the original code. Third-party pieces keep their own licenses (for example jQuery, MIT). Make sure you have the right to redistribute any video, GIF or image assets you add.
