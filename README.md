# 🎬 Interactive Media Player

<div align="center">

![Media Player](https://img.shields.io/badge/Media-Player-blueviolet?style=for-the-badge&logo=play&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)

**A beautiful, responsive, and feature-rich media player built with vanilla JavaScript**

[✨ Features](#-features) • [🚀 Demo](#-demo) • [📦 Installation](#-installation) • [🎮 Usage](#-usage) • [🤝 Contributing](#-contributing)

</div>

---

## 🌟 Overview

Interactive Media Player is a modern, responsive web-based media player that supports both video and audio files. Built with vanilla HTML, CSS, and JavaScript, it offers a sleek interface with advanced controls and smooth animations.

## ✨ Features

### 🎥 **Video & Audio Support**
- 📹 Multiple video format support (MP4, WebM, OGG)
- 🎵 Multiple audio format support (MP3, WAV, OGG)
- 🔄 Seamless switching between media types

### 🎛️ **Advanced Controls**
- ▶️ **Global Controls**: Play all videos/audios at once
- ⏸️ **Individual Controls**: Control each media item separately
- 🔇 **Mute/Unmute**: Global and individual mute functionality
- 🔊 **Volume Control**: Precise volume adjustment with sliders
- ⏹️ **Stop All**: Stop all playing media with one click

### 🎨 **Beautiful Interface**
- 🌈 Gradient backgrounds and modern design
- 📱 Fully responsive layout for all devices
- ✨ Smooth animations and transitions
- 🎯 Interactive hover effects
- 📊 Visual feedback for playing state

### ⌨️ **Keyboard Support**
- `Space` - Play/Pause
- `M` - Mute/Unmute
- `↑/↓` - Volume control
- `←/→` - Seek controls

### 🔧 **Developer-Friendly**
- 📝 Clean, well-commented code
- 🏗️ Modular architecture
- 🎯 ES6+ JavaScript features
- 📱 Mobile-first responsive design

## 🚀 Demo

![Media Player Demo](https://via.placeholder.com/800x400/667eea/ffffff?text=Interactive+Media+Player+Demo)

> **🌟 Live Demo**: [**View the Interactive Media Player in Action**](https://media-player-ten-self.vercel.app/) 
> 
> *Experience the full functionality of the media player with live video and audio playback!*

## 📦 Installation

### 🌐 Try Online First!
**Want to see it in action immediately?** Check out the [**Live Demo**](https://media-player-ten-self.vercel.app/) deployed on Vercel!

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Media-Player.git
   cd Media-Player
   ```

2. **Add your media files**
   - Place your video files (1.mp4, 2.mp4, etc.) in the root directory
   - Place your audio files (1.mp3, 2.mp3, etc.) in the root directory

3. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   # Or serve with a local server:
   python -m http.server 8000
   # Then visit: http://localhost:8000
   ```

### 📁 File Structure
```
Media-Player/
├── 📄 index.html          # Main HTML file
├── 🎨 styles.css          # CSS styling
├── ⚡ script.js           # JavaScript functionality
├── 📋 README.md           # This file
├── 📜 LICENSE             # MIT License
├── 🎬 1.mp4, 2.mp4...     # Your video files
└── 🎵 1.mp3, 2.mp3...     # Your audio files
```

## 🎮 Usage

### Basic Usage

1. **Load Media**: Place your media files in the project directory
2. **Open**: Launch `index.html` in your web browser
3. **Enjoy**: Use the controls to play, pause, and manage your media

### Global Controls

| Button | Function |
|--------|----------|
| 🎬 **Play All Videos** | Plays all video files sequentially |
| 🎵 **Play All Audios** | Plays all audio files sequentially |
| ⏹️ **Stop All** | Stops all currently playing media |
| 🔇 **Mute All** | Toggles mute for all media items |

### Individual Controls

Each media item has its own set of controls:
- ▶️ **Play Button**: Start playback
- ⏸️ **Pause Button**: Pause playback
- 🔊 **Mute Button**: Toggle audio
- 🎚️ **Volume Slider**: Adjust volume (0-100%)

## 🛠️ Customization

### Adding New Media

To add new media files, simply:

1. Place files in the root directory
2. Update the HTML to include new media elements:

```html
<div class="media-item">
    <video width="300" src="your-video.mp4" controls>
        <source src="your-video.mp4" type="video/mp4">
    </video>
    <div class="media-info">
        <h3>Your Video Title</h3>
        <!-- Controls will be automatically added -->
    </div>
</div>
```

### Styling Customization

The player uses CSS custom properties for easy theming:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-color: #ff6b6b;
    --text-color: #333;
    --border-radius: 15px;
}
```

## 🌐 Browser Support

| Browser | Supported Versions |
|---------|-------------------|
| 🌐 Chrome | 60+ |
| 🦊 Firefox | 55+ |
| 🧭 Safari | 12+ |
| 📘 Edge | 79+ |

## 📱 Responsive Design

The media player is fully responsive and works seamlessly across:
- 🖥️ **Desktop** (1200px+)
- 💻 **Laptop** (768px - 1199px)
- 📱 **Tablet** (481px - 767px)
- 📱 **Mobile** (320px - 480px)

## 🔧 Technical Details

### Built With
- **HTML5**: Semantic markup and media elements
- **CSS3**: Flexbox, Grid, Custom Properties, Animations
- **JavaScript ES6+**: Classes, Arrow Functions, Promises
- **Font Awesome**: Beautiful icons

### Key Features Implementation
- **Object-Oriented Design**: Clean MediaPlayer class
- **Event-Driven Architecture**: Efficient event handling
- **Progressive Enhancement**: Works without JavaScript
- **Accessibility**: Keyboard navigation and ARIA labels

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/Media-Player.git

# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes and test
# Submit a pull request
```

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Pushkar Kumar Saini**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- 🎨 **Font Awesome** for the beautiful icons
- 🌈 **CSS Gradient** inspiration from various design resources
- 🎵 **HTML5 Media API** for robust media support

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/yourusername/Media-Player?style=social)
![GitHub forks](https://img.shields.io/github/forks/yourusername/Media-Player?style=social)
![GitHub issues](https://img.shields.io/github/issues/yourusername/Media-Player)
![GitHub pull requests](https://img.shields.io/github/issues-pr/yourusername/Media-Player)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by [Pushkar Kumar Saini](https://github.com/yourusername)

</div>