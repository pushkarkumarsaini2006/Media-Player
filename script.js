// Interactive Media Player JavaScript

class MediaPlayer {
    constructor() {
        this.videos = document.querySelectorAll('video');
        this.audios = document.querySelectorAll('audio');
        this.allMedia = [...this.videos, ...this.audios];
        this.currentlyPlaying = [];
        
        this.init();
    }

    init() {
        this.setupGlobalControls();
        this.setupIndividualControls();
        this.setupAudioPlayers();
        this.addAnimations();
        this.setupKeyboardControls();
    }

    // Global Controls
    setupGlobalControls() {
        const playAllVideos = document.getElementById('playAllVideos');
        const playAllAudios = document.getElementById('playAllAudios');
        const stopAll = document.getElementById('stopAll');
        const muteAll = document.getElementById('muteAll');

        playAllVideos.addEventListener('click', () => this.playAllMedia(this.videos));
        playAllAudios.addEventListener('click', () => this.playAllMedia(this.audios));
        stopAll.addEventListener('click', () => this.stopAllMedia());
        muteAll.addEventListener('click', () => this.toggleMuteAll());
    }

    playAllMedia(mediaElements) {
        this.stopAllMedia(); // Stop any currently playing media first
        
        mediaElements.forEach((media, index) => {
            setTimeout(() => {
                media.currentTime = 0;
                const playPromise = media.play();
                
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        this.currentlyPlaying.push(media);
                        this.addPlayingEffect(media);
                    }).catch(error => {
                        console.log('Auto-play prevented:', error);
                    });
                }
            }, index * 200); // Stagger the start times
        });
    }

    stopAllMedia() {
        this.allMedia.forEach(media => {
            media.pause();
            media.currentTime = 0;
            this.removePlayingEffect(media);
        });
        this.currentlyPlaying = [];
    }

    toggleMuteAll() {
        const allMuted = this.allMedia.every(media => media.muted);
        
        this.allMedia.forEach(media => {
            media.muted = !allMuted;
            this.updateMuteButton(media, media.muted);
        });
    }

    // Individual Controls
    setupIndividualControls() {
        // Video controls
        this.videos.forEach((video, index) => {
            const container = video.closest('.media-item');
            const playBtn = container.querySelector('.play-btn');
            const pauseBtn = container.querySelector('.pause-btn');
            const muteBtn = container.querySelector('.mute-btn');
            const volumeSlider = container.querySelector('.volume-slider');

            this.setupMediaControls(video, playBtn, pauseBtn, muteBtn, volumeSlider);
        });
    }

    setupMediaControls(media, playBtn, pauseBtn, muteBtn, volumeSlider) {
        // Play button
        playBtn.addEventListener('click', () => {
            const playPromise = media.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.addPlayingEffect(media);
                    if (!this.currentlyPlaying.includes(media)) {
                        this.currentlyPlaying.push(media);
                    }
                }).catch(error => {
                    console.log('Play prevented:', error);
                });
            }
        });

        // Pause button
        pauseBtn.addEventListener('click', () => {
            media.pause();
            this.removePlayingEffect(media);
            this.currentlyPlaying = this.currentlyPlaying.filter(m => m !== media);
        });

        // Mute button
        muteBtn.addEventListener('click', () => {
            media.muted = !media.muted;
            this.updateMuteButton(media, media.muted);
        });

        // Volume slider
        volumeSlider.addEventListener('input', (e) => {
            media.volume = e.target.value;
        });

        // Media event listeners
        media.addEventListener('play', () => {
            this.addPlayingEffect(media);
        });

        media.addEventListener('pause', () => {
            this.removePlayingEffect(media);
        });

        media.addEventListener('ended', () => {
            this.removePlayingEffect(media);
            this.currentlyPlaying = this.currentlyPlaying.filter(m => m !== media);
        });
    }

    // Audio Player Setup
    setupAudioPlayers() {
        this.audios.forEach((audio, index) => {
            const container = audio.closest('.audio-item');
            const playBtn = container.querySelector('.play-btn');
            const pauseBtn = container.querySelector('.pause-btn');
            const muteBtn = container.querySelector('.mute-btn');
            const volumeSlider = container.querySelector('.volume-slider');
            const progressBar = container.querySelector('.progress-bar');
            const progress = container.querySelector('.progress');
            const timeDisplay = container.querySelector('.time-display');

            this.setupMediaControls(audio, playBtn, pauseBtn, muteBtn, volumeSlider);
            this.setupAudioProgress(audio, progressBar, progress, timeDisplay);
        });
    }

    setupAudioProgress(audio, progressBar, progress, timeDisplay) {
        // Update progress and time
        audio.addEventListener('timeupdate', () => {
            if (audio.duration) {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.style.width = progressPercent + '%';
                
                const currentTime = this.formatTime(audio.currentTime);
                const duration = this.formatTime(audio.duration);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        });

        // Click to seek
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const seekTime = (clickX / width) * audio.duration;
            
            if (seekTime >= 0 && seekTime <= audio.duration) {
                audio.currentTime = seekTime;
            }
        });

        // Load metadata
        audio.addEventListener('loadedmetadata', () => {
            const duration = this.formatTime(audio.duration);
            timeDisplay.textContent = `0:00 / ${duration}`;
        });
    }

    // Utility Methods
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    addPlayingEffect(media) {
        const container = media.closest('.media-item, .audio-item');
        if (container) {
            container.classList.add('playing');
        }
    }

    removePlayingEffect(media) {
        const container = media.closest('.media-item, .audio-item');
        if (container) {
            container.classList.remove('playing');
        }
    }

    updateMuteButton(media, isMuted) {
        const container = media.closest('.media-item, .audio-item');
        const muteBtn = container.querySelector('.mute-btn');
        const icon = muteBtn.querySelector('i');
        
        if (isMuted) {
            icon.className = 'fas fa-volume-mute';
            container.classList.add('muted');
        } else {
            icon.className = 'fas fa-volume-up';
            container.classList.remove('muted');
        }
    }

    // Animations
    addAnimations() {
        // Fade in elements on load
        const mediaItems = document.querySelectorAll('.media-item, .audio-item');
        mediaItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 100);
        });

        // Add hover effects
        const controlBtns = document.querySelectorAll('.control-btn');
        controlBtns.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.classList.add('pulse');
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.classList.remove('pulse');
            });
        });
    }

    // Keyboard Controls
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            switch(e.key.toLowerCase()) {
                case ' ': // Spacebar
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
                case 's': // S key
                    e.preventDefault();
                    this.stopAllMedia();
                    break;
                case 'm': // M key
                    e.preventDefault();
                    this.toggleMuteAll();
                    break;
                case 'v': // V key
                    e.preventDefault();
                    this.playAllMedia(this.videos);
                    break;
                case 'a': // A key
                    e.preventDefault();
                    this.playAllMedia(this.audios);
                    break;
            }
        });
    }

    togglePlayPause() {
        if (this.currentlyPlaying.length > 0) {
            this.currentlyPlaying.forEach(media => {
                media.pause();
            });
        } else {
            // Play the first video if nothing is playing
            if (this.videos.length > 0) {
                this.videos[0].play();
            }
        }
    }
}

// Playlist functionality
class Playlist {
    constructor() {
        this.currentIndex = 0;
        this.isShuffled = false;
        this.isRepeating = false;
        this.setupPlaylistControls();
    }

    setupPlaylistControls() {
        // Add playlist controls to audio section
        const audioSection = document.querySelector('.audio-grid').parentElement;
        const playlistControls = document.createElement('div');
        playlistControls.className = 'playlist-controls';
        playlistControls.innerHTML = `
            <button class="control-btn" id="shuffleBtn"><i class="fas fa-random"></i> Shuffle</button>
            <button class="control-btn" id="repeatBtn"><i class="fas fa-redo"></i> Repeat</button>
            <button class="control-btn" id="nextBtn"><i class="fas fa-forward"></i> Next</button>
            <button class="control-btn" id="prevBtn"><i class="fas fa-backward"></i> Previous</button>
        `;
        
        audioSection.insertBefore(playlistControls, audioSection.querySelector('.audio-grid'));

        // Add event listeners
        document.getElementById('shuffleBtn').addEventListener('click', () => this.toggleShuffle());
        document.getElementById('repeatBtn').addEventListener('click', () => this.toggleRepeat());
        document.getElementById('nextBtn').addEventListener('click', () => this.playNext());
        document.getElementById('prevBtn').addEventListener('click', () => this.playPrevious());
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const btn = document.getElementById('shuffleBtn');
        btn.style.background = this.isShuffled ? 
            'linear-gradient(45deg, #4ecdc4, #45b7b8)' : 
            'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    }

    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        const btn = document.getElementById('repeatBtn');
        btn.style.background = this.isRepeating ? 
            'linear-gradient(45deg, #4ecdc4, #45b7b8)' : 
            'linear-gradient(45deg, #ff6b6b, #ee5a24)';
    }

    playNext() {
        const audios = document.querySelectorAll('audio');
        if (audios.length === 0) return;

        // Stop current audio
        audios[this.currentIndex].pause();
        audios[this.currentIndex].currentTime = 0;

        // Calculate next index
        if (this.isShuffled) {
            this.currentIndex = Math.floor(Math.random() * audios.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % audios.length;
        }

        // Play next audio
        audios[this.currentIndex].play();
    }

    playPrevious() {
        const audios = document.querySelectorAll('audio');
        if (audios.length === 0) return;

        // Stop current audio
        audios[this.currentIndex].pause();
        audios[this.currentIndex].currentTime = 0;

        // Calculate previous index
        this.currentIndex = this.currentIndex === 0 ? 
            audios.length - 1 : this.currentIndex - 1;

        // Play previous audio
        audios[this.currentIndex].play();
    }
}

// Volume Visualizer (simplified)
class VolumeVisualizer {
    constructor() {
        this.setupVisualizer();
    }

    setupVisualizer() {
        // Add visual feedback when volume changes
        const volumeSliders = document.querySelectorAll('.volume-slider');
        volumeSliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const value = e.target.value;
                const container = slider.closest('.media-item, .audio-item');
                
                // Visual feedback based on volume level
                if (value > 0.7) {
                    container.style.borderColor = '#ff6b6b';
                } else if (value > 0.3) {
                    container.style.borderColor = '#feca57';
                } else {
                    container.style.borderColor = '#48dbfb';
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const mediaPlayer = new MediaPlayer();
    const playlist = new Playlist();
    const visualizer = new VolumeVisualizer();

    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Add some helpful tooltips
    const addTooltip = (element, text) => {
        element.title = text;
    };

    // Add tooltips to buttons
    addTooltip(document.getElementById('playAllVideos'), 'Play all videos (V key)');
    addTooltip(document.getElementById('playAllAudios'), 'Play all audios (A key)');
    addTooltip(document.getElementById('stopAll'), 'Stop all media (S key)');
    addTooltip(document.getElementById('muteAll'), 'Toggle mute all (M key)');

    console.log('🎵 Interactive Media Player Loaded Successfully! 🎵');
    console.log('Keyboard shortcuts:');
    console.log('- Spacebar: Play/Pause');
    console.log('- V: Play all videos');
    console.log('- A: Play all audios');
    console.log('- S: Stop all');
    console.log('- M: Mute/Unmute all');
});
