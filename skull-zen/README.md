# Skull ZEN

A dark, dashboard-style Chrome new-tab extension with a live video background.

## Features
- Live video wallpaper (`img/bg.mp4`) and a custom background option
- Search bar and add-your-own shortcuts
- Circular **Google Apps** launcher and **AI Apps** launcher (add / save your own shortcuts)
- Clock, date, detected city and live weather
- Typing-animated AI greeting (Gemini)
- Draggable sticky notes
- Internet download / upload speed gauge
- GPU name, FPS / frame time, JS heap bar and battery indicator

## Setup

1. Create your keys file:
   ```bash
   cp js/config.example.js js/config.js
   ```
2. Edit `js/config.js` and fill in:
   - `GEMINI_API_KEY` from <https://aistudio.google.com/app/apikey>
   - `OPENWEATHER_API_KEY` from <https://openweathermap.org/api>
3. Open `chrome://extensions`, enable **Developer mode**, click **Load unpacked** and select this folder.

Without `config.js` the extension still loads; the AI greeting shows a fallback message and weather will not load.

`manifest.json` contains a placeholder `oauth2.client_id`. Replace it with your own Google OAuth client ID only if you use the `identity` API.

## Optional: Chrome memory monitor (`app.py`)
A small Python script that pushes total Chrome memory usage to a Firebase Realtime Database every 2 seconds.

```bash
pip install -r requirements.txt
export FIREBASE_DATABASE_URL="https://<your-project>-default-rtdb.<region>.firebasedatabase.app/"
export FIREBASE_KEY_PATH="firebase_key.json"   # your service-account file, never commit it
export MEMORY_USER_ID="my_device"
python app.py
```

## Network requests
Google Gemini (greeting), OpenWeatherMap (weather), BigDataCloud (reverse geocoding), Google favicons, `api.gameograf.com` (shortcut list and popup message), Cloudinary (launcher icons) and jsDelivr (Chart.js). Location access uses the browser geolocation permission.

## Permissions
`search`, `geolocation`, `system.memory`, `identity`, `processes`, plus the host permissions listed in `manifest.json`. Some of these (`identity`, `processes`, the localhost host) look like leftovers from experiments. Remove what you don't use before publishing to the Chrome Web Store.

## Notes
`test1.html` is a scratch page and is not used by the extension.
