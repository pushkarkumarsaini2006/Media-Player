# Luminex Media Player

A professional, interactive media player with video and audio playback, featuring dark/light themes and glassmorphism design.

## Live Demo

[media-player-ten-self.vercel.app](https://media-player-ten-self.vercel.app/)

## Features

- **Video Player** - Custom controls, playback speed, fullscreen, Picture-in-Picture
- **Audio Player** - Album art, visualizer, shuffle/repeat modes
- **Dark/Light Theme** - One-click theme switching
- **Keyboard Shortcuts** - Space, arrows, M, F, N, P for quick control
- **Playback Resilience** - Auto-skip when a source fails to load
- **No Dependencies** - Pure HTML, CSS, and JavaScript

## Media Included

### Videos
- Flower Motion (MDN Media Samples)
- Big Buck Clip (W3Schools Media)
- Sample Reel (Samplelib)

### Audio (SoundHelix)
- Pulse One
- Pulse Two
- Pulse Three

## Running Locally

For best browser compatibility, run through a local server instead of opening `index.html` with `file://`.

```bash
npx serve .
```

Then open the localhost URL shown in terminal.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` / `→` | Seek 10s |
| `↑` / `↓` | Volume |
| `M` | Mute |
| `F` | Fullscreen |
| `N` / `P` | Next/Previous |

## Project Structure

```
Media-Player/
├── index.html      # Main HTML structure
├── styles.css      # All styling
├── script.js       # LuminexPlayer class and playback logic
├── LICENSE
└── README.md
```

## License

MIT
