# Leaper 
Open any Google search result instantly. No mouse required. 

--- 

## What is it?
Leaper is a Chrome extension that lets you navigate Google search results entirely from the keyboard. Hold `Alt` to reveal numbered badges on every result, then press a digit to go there directly, or open several at once in background tabs.

| Shortcut | Action |
|---|---|
| `Alt` (hold) | Show numbered badges on results |
| `Alt + 1`–`9` | Open that result in the current tab |
| `Alt + Shift + 1`–`9` | Open the first *n* results in background tabs |

Badges disappear the moment you release `Alt`. Results glow briefly on activation so you always know what was triggered.

--- 
## Why I built this
90% of the time i search for something in Google I do two things. Either I want the top search result (google's search algorithm is pretty good), or I want to open the first few tabs in the background so I can read through them. And no matter how much I looked there didn't seem to be any tool publicly available (and high quality) that could allow me to just do these two simple things. So I started to work on this as a personal tool, and later turned it into a personal project to explore the Chrome Extension API and familiarize myself with the platform. 


---

## Technical Overview 

```
Search-Faster/
├── manifest.json       # Manifest V3 config. Handles permissions, commands, content scripts
├── background.js       # Service worker. Handles command relay, tab creation
├── content.js          # Injected into search pages. Handles hints, glows, navigation
└── icons/              # The extension icon
```

**Key implementation details:**
 
- **Search results only:** Results are filtered to only offer real search results. 
- **CSS injection:** All hint styles are injected once as a `<style>` tag rather than written inline per element, keeping the DOM clean and styles easy to update
- **Key-repeat guard:** — `e.repeat` prevents the browser's hold-key repeat from re-rendering badges on every tick
- **Capture-phase listeners:** — event listeners registered with `{ capture: true }` intercept keystrokes before the page's own JS, preventing interference on JS-heavy pages
**Absolute-positioned badges:** Badges use `position: absolute` with `window.scrollX/Y + getBoundingClientRect()` to anchor them to document coordinates rather than the viewport; they move with the page naturally with zero JS and no scroll handler needed
- **URL safety guard:** Background.js rejects any non-`http(s)` message before creating a tab
- **Background tabs open adjacent:** New tabs insert next to the current tab (`index + 1`) rather than at the end of the tab bar
- **Only active on search:** The extension is only active on search pages. Guarantees privacy and performance. 
---


## Installation
 
> The extension is not yet on the Chrome Web Store. I am currently in the process of registering a CWS developer account but in the meantime, you can install it in developer mode:
 
1. Clone the repo
   ```bash
   git clone https://github.com/William-Lamer/Search-Faster.git
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle in the top right)
4. Click **Load unpacked** and select the Leaper folder
5. That's it! Search for anything, and hold `Alt`!
 


## Known Limitations and Future Plans

| Limitation | Status |
|---|---|
| Google only | Planned: multi-engine support (Bing, DuckDuckGo) via an `ENGINES` selector map |
| Shortcuts limited to results 1–9 | Planned: extend to `a`–`z` using `e.key` directly |
| Opening a result already open in another tab creates a duplicate | Planned: check `chrome.tabs.query` first and focus the existing tab |
| No Firefox support | Planned: porting to Firefox |
| Opening a result that's already in another tab opens a duplicate | Planned: check `chrome.tabs.query` first and focus the existing tab |
| Keybindings are not user-configurable | Planned: settings page via `chrome.storage` |
 
---















