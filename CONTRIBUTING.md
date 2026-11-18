# Contributing

Thanks for your interest! Bug reports and pull requests are welcome.

## Reporting bugs
Open an issue with your Chrome version, the extension name, steps to reproduce, and any errors from the new tab page (`F12` -> Console) or the service worker (`chrome://extensions` -> *service worker*).

## Pull requests
1. Fork the repo and create a branch: `git checkout -b feature/my-change`
2. Load the extension folder as an unpacked extension and test your change.
3. Keep one extension per PR where possible.
4. **Never commit API keys, tokens, service-account files or personal data.** Use `js/config.example.js` for placeholders.
5. Describe what changed and why in the PR.

## Code style
Plain HTML/CSS/JavaScript, no build step. Keep files readable and comment non-obvious logic.
