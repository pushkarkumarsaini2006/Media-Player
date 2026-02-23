// ===== Luminex Media Player - Professional Interactive Media Player =====

class LuminexPlayer {
    constructor() {
        // Video elements
        this.mainVideo = document.getElementById('mainVideo');
        this.videoWrapper = document.querySelector('.video-wrapper');
        this.videoTitle = document.getElementById('videoTitle');
        this.videoDescription = document.getElementById('videoDescription');
        
        // Audio elements
        this.audioPlayer = document.getElementById('audioPlayer');
        this.albumArt = document.getElementById('albumArt');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        this.visualizerCanvas = document.getElementById('visualizer');
        this.audioContext = null;
        this.analyser = null;
        
        // State
        this.currentVideoIndex = 0;
        this.currentTrackIndex = 0;
        this.isVideoPlaying = false;
        this.isAudioPlaying = false;
        this.playbackSpeed = 1;
        this.favorites = JSON.parse(localStorage.getItem('luminexFavorites')) || [];
        this.isShuffleOn = false;
        this.isRepeatOn = false;
        
        // Media collections
        this.videos = [
            {
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                title: 'Big Buck Bunny',
                description: 'A comedic animated short film featuring a giant rabbit dealing with bullying rodents.',
                poster: 'https://peach.blender.org/wp-content/uploads/bbb-splash.png',
                duration: '9:56',
                views: '2.4M',
                likes: '45K',
                year: '2008'
            },
            {
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
                title: 'Sintel',
                description: 'An epic animated short about a girl\'s quest to find her pet dragon in a fantasy world.',
                poster: 'https://durian.blender.org/wp-content/uploads/2010/06/05.8b_comp_000272.jpg',
                duration: '14:48',
                views: '1.8M',
                likes: '32K',
                year: '2010'
            },
            {
                src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
                title: 'Elephants Dream',
                description: 'The world\'s first open movie, a surreal science fiction story about two characters exploring a machine.',
                poster: 'https://i.ytimg.com/vi/TLkA0RELQ1g/maxresdefault.jpg',
                duration: '10:54',
                views: '1.2M',
                likes: '28K',
                year: '2006'
            }
        ];
        
        this.tracks = [
            {
                src: 'https://archive.org/download/IGM-V7/IGM%20-%20Vol.%207/25%20Diablo%20-%20Tristram%20%28Blizzard%29.mp3',
                title: 'Tristram Theme',
                artist: 'Blizzard Entertainment',
                cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
                duration: '6:26'
            },
            {
                src: 'https://archive.org/download/testmp3testfile/mpthreetest.mp3',
                title: 'Test Audio',
                artist: 'Archive.org',
                cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
                duration: '0:12'
            },
            {
                src: 'https://archive.org/download/IGM-V7/IGM%20-%20Vol.%207/01%20Age%20Of%20Empires%20II%20-%20Menu%20%28Microsoft%29.mp3',
                title: 'Age of Empires II Menu',
                artist: 'Microsoft',
                cover: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
                duration: '2:44'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupVideoPlayer();
        this.setupAudioPlayer();
        this.setupMediaCards();
        this.setupTrackList();
        this.setupFavorites();
        this.setupSearch();
        this.setupMiniPlayer();
        this.setupKeyboardControls();
        this.setupVisualizer();
        this.setupHeaderButtons();
        this.setupViewToggle();
        this.setupTrackOptions();
        this.setupPlaylistSection();
        this.loadFavorites();
        
        // Initial animations
        this.animateOnLoad();
    }
    
    // ===== Navigation =====
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const target = item.dataset.section;
                
                // Update active nav
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show target section
                sections.forEach(section => {
                    section.classList.remove('active');
                    if (section.id === `${target}-section`) {
                        section.classList.add('active');
                    }
                });
                
                // Animate section entrance
                const activeSection = document.querySelector('.content-section.active');
                activeSection.style.animation = 'none';
                activeSection.offsetHeight; // Trigger reflow
                activeSection.style.animation = 'fadeIn 0.5s ease';
            });
        });
    }
    
    // ===== Video Player =====
    setupVideoPlayer() {
        const playPauseBtn = document.getElementById('playPauseBtn');
        const bigPlayBtn = document.getElementById('bigPlayBtn');
        const prevBtn = document.getElementById('prevVideoBtn');
        const nextBtn = document.getElementById('nextVideoBtn');
        const muteBtn = document.getElementById('muteBtn');
        const volumeSlider = document.getElementById('volumeSlider');
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        const pipBtn = document.getElementById('pipBtn');
        const speedBtn = document.getElementById('speedBtn');
        const progressBar = document.getElementById('videoProgress');
        const currentTimeEl = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');
        
        // Set initial volume
        if (this.mainVideo) {
            this.mainVideo.volume = 0.8;
            this.mainVideo.muted = false;
        }
        
        // Play/Pause
        const toggleVideoPlay = () => {
            if (this.mainVideo.paused) {
                this.mainVideo.play();
                this.isVideoPlaying = true;
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                bigPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                this.videoWrapper.classList.add('playing');
            } else {
                this.mainVideo.pause();
                this.isVideoPlaying = false;
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                bigPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
                this.videoWrapper.classList.remove('playing');
            }
        };
        
        playPauseBtn?.addEventListener('click', toggleVideoPlay);
        bigPlayBtn?.addEventListener('click', toggleVideoPlay);
        this.mainVideo?.addEventListener('click', toggleVideoPlay);
        
        // Previous/Next
        prevBtn?.addEventListener('click', () => this.changeVideo(-1));
        nextBtn?.addEventListener('click', () => this.changeVideo(1));
        
        // Volume
        muteBtn?.addEventListener('click', () => {
            this.mainVideo.muted = !this.mainVideo.muted;
            muteBtn.innerHTML = this.mainVideo.muted ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        });
        
        volumeSlider?.addEventListener('input', (e) => {
            this.mainVideo.volume = e.target.value / 100;
            muteBtn.innerHTML = e.target.value == 0 ? 
                '<i class="fas fa-volume-mute"></i>' : 
                '<i class="fas fa-volume-up"></i>';
        });
        
        // Progress bar
        this.mainVideo?.addEventListener('timeupdate', () => {
            const progress = (this.mainVideo.currentTime / this.mainVideo.duration) * 100;
            const progressFilled = progressBar?.querySelector('.progress-filled');
            const progressThumb = progressBar?.querySelector('.progress-thumb');
            if (progressFilled) progressFilled.style.width = `${progress}%`;
            if (progressThumb) progressThumb.style.left = `${progress}%`;
            if (currentTimeEl) currentTimeEl.textContent = this.formatTime(this.mainVideo.currentTime);
        });
        
        this.mainVideo?.addEventListener('loadedmetadata', () => {
            if (durationEl) durationEl.textContent = this.formatTime(this.mainVideo.duration);
        });
        
        progressBar?.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.mainVideo.currentTime = pos * this.mainVideo.duration;
        });
        
        // Fullscreen
        fullscreenBtn?.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                this.videoWrapper.requestFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
            } else {
                document.exitFullscreen();
                fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
            }
        });
        
        // Picture in Picture
        pipBtn?.addEventListener('click', async () => {
            try {
                if (document.pictureInPictureElement) {
                    await document.exitPictureInPicture();
                } else {
                    await this.mainVideo.requestPictureInPicture();
                }
            } catch (error) {
                console.log('PiP not supported');
            }
        });
        
        // Playback speed
        const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
        let speedIndex = 2;
        speedBtn?.addEventListener('click', () => {
            speedIndex = (speedIndex + 1) % speeds.length;
            this.playbackSpeed = speeds[speedIndex];
            this.mainVideo.playbackRate = this.playbackSpeed;
            speedBtn.querySelector('.speed-label').textContent = `${this.playbackSpeed}x`;
        });
        
        // Video ended
        this.mainVideo?.addEventListener('ended', () => {
            this.changeVideo(1);
        });
    }
    
    changeVideo(direction) {
        this.currentVideoIndex = (this.currentVideoIndex + direction + this.videos.length) % this.videos.length;
        const video = this.videos[this.currentVideoIndex];
        
        this.mainVideo.src = video.src;
        this.mainVideo.load();
        this.mainVideo.volume = 0.8;
        this.mainVideo.muted = false;
        this.mainVideo.poster = video.poster;
        this.videoTitle.textContent = video.title;
        this.videoDescription.textContent = video.description;
        
        // Update meta
        const metaSpans = document.querySelectorAll('.video-meta span');
        if (metaSpans[0]) metaSpans[0].innerHTML = `<i class="fas fa-eye"></i> ${video.views} views`;
        if (metaSpans[1]) metaSpans[1].innerHTML = `<i class="fas fa-clock"></i> ${video.duration}`;
        if (metaSpans[2]) metaSpans[2].innerHTML = `<i class="fas fa-calendar"></i> ${video.year}`;
        
        // Update active card
        document.querySelectorAll('.media-card').forEach((card, index) => {
            card.classList.toggle('playing', index === this.currentVideoIndex);
        });
        
        if (this.isVideoPlaying) {
            this.mainVideo.play();
        }
        
        this.showToast(`Now playing: ${video.title}`);
    }
    
    // ===== Audio Player =====
    setupAudioPlayer() {
        const playPauseBtn = document.getElementById('audioPlayPauseBtn');
        const prevBtn = document.getElementById('prevAudioBtn');
        const nextBtn = document.getElementById('nextAudioBtn');
        const shuffleBtn = document.getElementById('shuffleAudioBtn');
        const repeatBtn = document.getElementById('repeatAudioBtn');
        const volumeSlider = document.getElementById('audioVolumeSlider');
        const progressBar = document.getElementById('audioProgress');
        const currentTimeEl = document.getElementById('audioCurrentTime');
        const durationEl = document.getElementById('audioDuration');
        
        // Load first track
        this.loadTrack(0);
        
        // Set initial audio volume and ensure not muted
        if (this.audioPlayer) {
            this.audioPlayer.volume = 0.8;
            this.audioPlayer.muted = false;
        }
        
        // Play/Pause
        playPauseBtn?.addEventListener('click', () => this.toggleAudioPlay());
        
        // Previous/Next
        prevBtn?.addEventListener('click', () => this.changeTrack(-1));
        nextBtn?.addEventListener('click', () => this.changeTrack(1));
        
        // Shuffle
        shuffleBtn?.addEventListener('click', () => {
            this.isShuffleOn = !this.isShuffleOn;
            shuffleBtn.classList.toggle('active', this.isShuffleOn);
            this.showToast(this.isShuffleOn ? 'Shuffle on' : 'Shuffle off');
        });
        
        // Repeat
        repeatBtn?.addEventListener('click', () => {
            this.isRepeatOn = !this.isRepeatOn;
            repeatBtn.classList.toggle('active', this.isRepeatOn);
            this.audioPlayer.loop = this.isRepeatOn;
            this.showToast(this.isRepeatOn ? 'Repeat on' : 'Repeat off');
        });
        
        // Volume
        volumeSlider?.addEventListener('input', (e) => {
            this.audioPlayer.volume = e.target.value / 100;
        });
        
        // Progress
        this.audioPlayer?.addEventListener('timeupdate', () => {
            const progress = (this.audioPlayer.currentTime / this.audioPlayer.duration) * 100;
            const progressFilled = progressBar?.querySelector('.audio-progress-filled');
            if (progressFilled) progressFilled.style.width = `${progress}%`;
            if (currentTimeEl) currentTimeEl.textContent = this.formatTime(this.audioPlayer.currentTime);
            
            // Update mini player
            const miniProgress = document.querySelector('.mini-progress-filled');
            if (miniProgress) miniProgress.style.width = `${progress}%`;
        });
        
        this.audioPlayer?.addEventListener('loadedmetadata', () => {
            if (durationEl) durationEl.textContent = this.formatTime(this.audioPlayer.duration);
        });
        
        progressBar?.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            this.audioPlayer.currentTime = pos * this.audioPlayer.duration;
        });
        
        // Track ended
        this.audioPlayer?.addEventListener('ended', () => {
            if (!this.isRepeatOn) {
                this.changeTrack(1);
            }
        });
    }
    
    toggleAudioPlay() {
        const playPauseBtn = document.getElementById('audioPlayPauseBtn');
        const miniPlayBtn = document.getElementById('miniPlayBtn');
        
        if (this.audioPlayer.paused) {
            this.audioPlayer.muted = false;
            this.audioPlayer.volume = 0.8;
            
            const playPromise = this.audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isAudioPlaying = true;
                    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    this.startVisualizer();
                }).catch(error => {
                    console.error('Audio play failed:', error);
                    this.showToast('Unable to play audio. Click again to retry.');
                });
            }
        } else {
            this.audioPlayer.pause();
            this.isAudioPlaying = false;
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }
    
    loadTrack(index) {
        const track = this.tracks[index];
        this.audioPlayer.src = track.src;
        this.audioPlayer.load();
        this.audioPlayer.volume = 0.8;
        this.audioPlayer.muted = false;
        this.albumArt.src = track.cover;
        this.trackTitle.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        
        // Update mini player
        document.getElementById('miniCover').src = track.cover;
        document.getElementById('miniTitle').textContent = track.title;
        document.getElementById('miniArtist').textContent = track.artist;
        
        // Update active track in list
        document.querySelectorAll('.track-item').forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }
    
    changeTrack(direction) {
        if (this.isShuffleOn) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * this.tracks.length);
            } while (newIndex === this.currentTrackIndex && this.tracks.length > 1);
            this.currentTrackIndex = newIndex;
        } else {
            this.currentTrackIndex = (this.currentTrackIndex + direction + this.tracks.length) % this.tracks.length;
        }
        
        this.loadTrack(this.currentTrackIndex);
        
        if (this.isAudioPlaying) {
            this.audioPlayer.play();
        }
        
        this.showToast(`Now playing: ${this.tracks[this.currentTrackIndex].title}`);
    }
    
    // ===== Visualizer =====
    setupVisualizer() {
        if (!this.visualizerCanvas) return;
        
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
        this.visualizerCanvas.width = this.visualizerCanvas.offsetWidth;
        this.visualizerCanvas.height = this.visualizerCanvas.offsetHeight;
        
        // Draw default bars
        this.drawDefaultVisualizer();
    }
    
    drawDefaultVisualizer() {
        if (!this.visualizerCtx) return;
        
        const width = this.visualizerCanvas.width;
        const height = this.visualizerCanvas.height;
        const barCount = 64;
        const barWidth = width / barCount;
        
        this.visualizerCtx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < barCount; i++) {
            const barHeight = Math.random() * height * 0.3 + 10;
            const gradient = this.visualizerCtx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(1, '#818cf8');
            
            this.visualizerCtx.fillStyle = gradient;
            this.visualizerCtx.fillRect(i * barWidth, height - barHeight, barWidth - 2, barHeight);
        }
    }
    
    startVisualizer() {
        if (!this.audioContext) {
            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.analyser = this.audioContext.createAnalyser();
                const source = this.audioContext.createMediaElementSource(this.audioPlayer);
                source.connect(this.analyser);
                this.analyser.connect(this.audioContext.destination);
                this.analyser.fftSize = 256;
            } catch (e) {
                console.log('Audio context not supported');
                return;
            }
        }
        
        this.drawVisualizer();
    }
    
    drawVisualizer() {
        if (!this.isAudioPlaying || !this.analyser) {
            this.drawDefaultVisualizer();
            return;
        }
        
        requestAnimationFrame(() => this.drawVisualizer());
        
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        
        const width = this.visualizerCanvas.width;
        const height = this.visualizerCanvas.height;
        const barWidth = width / bufferLength;
        
        this.visualizerCtx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * height;
            const gradient = this.visualizerCtx.createLinearGradient(0, height, 0, height - barHeight);
            gradient.addColorStop(0, '#6366f1');
            gradient.addColorStop(0.5, '#a855f7');
            gradient.addColorStop(1, '#ec4899');
            
            this.visualizerCtx.fillStyle = gradient;
            this.visualizerCtx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
        }
    }
    
    // ===== Media Cards =====
    setupMediaCards() {
        const cards = document.querySelectorAll('.media-card');
        
        cards.forEach((card, index) => {
            // Play button
            const playBtn = card.querySelector('.play-btn');
            playBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentVideoIndex = index;
                this.changeVideo(0);
                this.mainVideo.play();
                document.getElementById('playPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
                document.getElementById('bigPlayBtn').innerHTML = '<i class="fas fa-pause"></i>';
                this.videoWrapper.classList.add('playing');
                this.isVideoPlaying = true;
                
                // Scroll to player
                document.querySelector('.featured-player').scrollIntoView({ behavior: 'smooth' });
            });
            
            // Favorite button
            const favBtn = card.querySelector('.favorite-btn');
            favBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFavorite('video', index, card);
            });
        });
    }
    
    // ===== Track List =====
    setupTrackList() {
        const trackItems = document.querySelectorAll('.track-item');
        
        trackItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                this.currentTrackIndex = index;
                this.loadTrack(index);
                this.audioPlayer.play();
                this.isAudioPlaying = true;
                document.getElementById('audioPlayPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
                document.getElementById('miniPlayBtn').innerHTML = '<i class="fas fa-pause"></i>';
                this.startVisualizer();
            });
        });
    }
    
    // ===== Favorites =====
    setupFavorites() {
        // Load favorites from localStorage
        this.favorites = JSON.parse(localStorage.getItem('luminexFavorites')) || [];
        this.updateFavoriteButtons();
    }
    
    toggleFavorite(type, index, element) {
        const id = `${type}-${index}`;
        const existingIndex = this.favorites.findIndex(f => f.id === id);
        
        if (existingIndex > -1) {
            this.favorites.splice(existingIndex, 1);
            element?.querySelector('.favorite-btn')?.classList.remove('active');
            element?.querySelector('.favorite-btn i')?.classList.replace('fas', 'far');
            this.showToast('Removed from favorites');
        } else {
            const item = type === 'video' ? this.videos[index] : this.tracks[index];
            this.favorites.push({ id, type, index, ...item });
            element?.querySelector('.favorite-btn')?.classList.add('active');
            element?.querySelector('.favorite-btn i')?.classList.replace('far', 'fas');
            this.showToast('Added to favorites');
        }
        
        localStorage.setItem('luminexFavorites', JSON.stringify(this.favorites));
        this.loadFavorites();
    }
    
    updateFavoriteButtons() {
        document.querySelectorAll('.media-card').forEach((card, index) => {
            const id = `video-${index}`;
            const isFav = this.favorites.some(f => f.id === id);
            const btn = card.querySelector('.favorite-btn');
            const icon = btn?.querySelector('i');
            
            if (isFav) {
                btn?.classList.add('active');
                icon?.classList.replace('far', 'fas');
            }
        });
    }
    
    loadFavorites() {
        const grid = document.getElementById('favoritesGrid');
        const empty = document.getElementById('favoritesEmpty');
        
        if (!grid) return;
        
        if (this.favorites.length === 0) {
            empty.style.display = 'block';
            grid.innerHTML = '';
            return;
        }
        
        empty.style.display = 'none';
        grid.innerHTML = this.favorites.map((item, i) => `
            <div class="media-card" data-fav-index="${i}">
                <div class="card-thumbnail">
                    <img src="${item.poster || item.cover}" alt="${item.title}">
                    <div class="card-overlay">
                        <button class="play-btn"><i class="fas fa-play"></i></button>
                    </div>
                    <span class="duration-badge">${item.duration}</span>
                </div>
                <div class="card-info">
                    <h4>${item.title}</h4>
                    <p>${item.type === 'video' ? 'Video' : item.artist}</p>
                </div>
                <button class="favorite-btn active"><i class="fas fa-heart"></i></button>
            </div>
        `).join('');
        
        // Add event listeners to favorite cards
        grid.querySelectorAll('.media-card').forEach((card, i) => {
            const item = this.favorites[i];
            
            card.querySelector('.play-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                if (item.type === 'video') {
                    this.currentVideoIndex = item.index;
                    this.changeVideo(0);
                    this.mainVideo.play();
                    // Switch to videos section
                    document.querySelector('[data-section="videos"]').click();
                } else {
                    this.currentTrackIndex = item.index;
                    this.loadTrack(item.index);
                    this.audioPlayer.play();
                    this.isAudioPlaying = true;
                    document.getElementById('audioPlayPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
                    // Switch to music section
                    document.querySelector('[data-section="music"]').click();
                }
            });
            
            card.querySelector('.favorite-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.favorites.splice(i, 1);
                localStorage.setItem('luminexFavorites', JSON.stringify(this.favorites));
                this.loadFavorites();
                this.updateFavoriteButtons();
                this.showToast('Removed from favorites');
            });
        });
    }
    
    // ===== Search =====
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        
        searchInput?.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            // Filter videos
            document.querySelectorAll('#videoGrid .media-card').forEach((card, index) => {
                if (this.videos[index]) {
                    const video = this.videos[index];
                    const matches = video.title.toLowerCase().includes(query) || 
                                   video.description.toLowerCase().includes(query);
                    card.style.display = matches ? 'block' : 'none';
                }
            });
            
            // Filter tracks
            document.querySelectorAll('.track-item').forEach((item, index) => {
                if (this.tracks[index]) {
                    const track = this.tracks[index];
                    const matches = track.title.toLowerCase().includes(query) || 
                                   track.artist.toLowerCase().includes(query);
                    item.style.display = matches ? 'flex' : 'none';
                }
            });
        });
    }
    
    // ===== Header Buttons =====
    setupHeaderButtons() {
        // Load saved settings
        this.settings = JSON.parse(localStorage.getItem('luminexSettings')) || {
            theme: 'dark',
            autoplay: true,
            volume: 80,
            quality: 'auto',
            animations: true,
            visualizer: true
        };
        
        // Ensure dark theme is default - remove light-theme class first
        document.body.classList.remove('light-theme');
        const themeIcon = document.getElementById('themeToggle')?.querySelector('i');
        themeIcon?.classList.remove('fa-sun');
        themeIcon?.classList.add('fa-moon');
        
        // Apply saved theme on load (only if light was saved)
        if (this.settings.theme === 'light') {
            document.body.classList.add('light-theme');
            themeIcon?.classList.replace('fa-moon', 'fa-sun');
        }
        
        // Apply saved volume
        if (this.audioPlayer) this.audioPlayer.volume = this.settings.volume / 100;
        if (this.mainVideo) this.mainVideo.volume = this.settings.volume / 100;
        
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        themeToggle?.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const icon = themeToggle.querySelector('i');
            if (document.body.classList.contains('light-theme')) {
                icon?.classList.replace('fa-moon', 'fa-sun');
                this.settings.theme = 'light';
                this.showToast('Light theme enabled');
            } else {
                icon?.classList.replace('fa-sun', 'fa-moon');
                this.settings.theme = 'dark';
                this.showToast('Dark theme enabled');
            }
            this.saveSettings();
        });
        
        // Header shuffle button (shuffles all media)
        const shuffleBtn = document.getElementById('shuffleBtn');
        shuffleBtn?.addEventListener('click', () => {
            this.isShuffleOn = !this.isShuffleOn;
            shuffleBtn.classList.toggle('active', this.isShuffleOn);
            document.getElementById('shuffleAudioBtn')?.classList.toggle('active', this.isShuffleOn);
            this.showToast(this.isShuffleOn ? 'Shuffle mode enabled' : 'Shuffle mode disabled');
        });
        
        // Settings button
        const settingsBtn = document.getElementById('settingsBtn');
        settingsBtn?.addEventListener('click', () => {
            this.showSettingsModal();
        });
    }
    
    showSettingsModal() {
        // Check if modal already exists
        let modal = document.getElementById('settingsModal');
        if (modal) {
            modal.classList.add('show');
            return;
        }
        
        // Create settings modal
        modal = document.createElement('div');
        modal.id = 'settingsModal';
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="settings-content">
                <div class="settings-header">
                    <h3><i class="fas fa-cog"></i> Settings</h3>
                    <button class="settings-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="settings-body">
                    <div class="settings-group">
                        <h4>Playback</h4>
                        <div class="setting-item">
                            <label>Autoplay next</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="autoplayToggle" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>Default volume</label>
                            <input type="range" id="defaultVolume" min="0" max="100" value="80">
                            <span id="volumeValue">80%</span>
                        </div>
                        <div class="setting-item">
                            <label>Video quality</label>
                            <select id="videoQuality">
                                <option value="auto">Auto</option>
                                <option value="1080p">1080p HD</option>
                                <option value="720p">720p</option>
                                <option value="480p">480p</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-group">
                        <h4>Appearance</h4>
                        <div class="setting-item">
                            <label>Animations</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="animationsToggle" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                        <div class="setting-item">
                            <label>Show visualizer</label>
                            <label class="toggle-switch">
                                <input type="checkbox" id="visualizerToggle" checked>
                                <span class="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                    <div class="settings-group">
                        <h4>Data</h4>
                        <div class="setting-item">
                            <label>Clear favorites</label>
                            <button class="settings-btn danger" id="clearFavoritesBtn">Clear All</button>
                        </div>
                        <div class="setting-item">
                            <label>Reset settings</label>
                            <button class="settings-btn" id="resetSettingsBtn">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles if not already added
        if (!document.getElementById('settingsStyles')) {
            const styles = document.createElement('style');
            styles.id = 'settingsStyles';
            styles.textContent = `
                .settings-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .settings-modal.show {
                    opacity: 1;
                    visibility: visible;
                }
                .settings-content {
                    background: var(--bg-card);
                    border-radius: var(--radius-xl);
                    width: 90%;
                    max-width: 500px;
                    max-height: 80vh;
                    overflow-y: auto;
                    border: 1px solid var(--border);
                    transform: scale(0.9);
                    transition: transform 0.3s ease;
                }
                .settings-modal.show .settings-content {
                    transform: scale(1);
                }
                .settings-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid var(--border);
                }
                .settings-header h3 {
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .settings-close {
                    width: 36px;
                    height: 36px;
                    border: none;
                    background: rgba(255,255,255,0.1);
                    color: var(--text-primary);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .settings-close:hover {
                    background: var(--primary);
                }
                .settings-body {
                    padding: 24px;
                }
                .settings-group {
                    margin-bottom: 24px;
                }
                .settings-group h4 {
                    font-size: 14px;
                    color: var(--text-muted);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 16px;
                }
                .setting-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 12px 0;
                    border-bottom: 1px solid var(--border);
                }
                .setting-item:last-child {
                    border-bottom: none;
                }
                .setting-item label {
                    color: var(--text-secondary);
                }
                .setting-item select, .setting-item input[type="range"] {
                    background: rgba(255,255,255,0.1);
                    border: 1px solid var(--border);
                    color: var(--text-primary);
                    padding: 8px 12px;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                }
                .setting-item input[type="range"] {
                    width: 100px;
                }
                .toggle-switch {
                    position: relative;
                    width: 48px;
                    height: 24px;
                }
                .toggle-switch input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }
                .toggle-slider {
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.2);
                    border-radius: 24px;
                    transition: 0.3s;
                }
                .toggle-slider:before {
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background: white;
                    border-radius: 50%;
                    transition: 0.3s;
                }
                .toggle-switch input:checked + .toggle-slider {
                    background: var(--primary);
                }
                .toggle-switch input:checked + .toggle-slider:before {
                    transform: translateX(24px);
                }
                .settings-btn {
                    padding: 8px 16px;
                    background: var(--primary);
                    border: none;
                    color: white;
                    border-radius: var(--radius-sm);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .settings-btn:hover {
                    opacity: 0.8;
                }
                .settings-btn.danger {
                    background: #ef4444;
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Show modal
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Event listeners
        modal.querySelector('.settings-close')?.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
        
        modal.querySelector('#defaultVolume')?.addEventListener('input', (e) => {
            modal.querySelector('#volumeValue').textContent = `${e.target.value}%`;
            this.audioPlayer.volume = e.target.value / 100;
            this.mainVideo.volume = e.target.value / 100;
            this.settings.volume = parseInt(e.target.value);
            this.saveSettings();
        });
        
        modal.querySelector('#clearFavoritesBtn')?.addEventListener('click', () => {
            this.favorites = [];
            localStorage.setItem('luminexFavorites', JSON.stringify(this.favorites));
            this.loadFavorites();
            this.updateFavoriteButtons();
            this.showToast('Favorites cleared');
        });
        
        modal.querySelector('#resetSettingsBtn')?.addEventListener('click', () => {
            // Reset settings object
            this.settings = {
                theme: 'dark',
                autoplay: true,
                volume: 80,
                quality: 'auto',
                animations: true,
                visualizer: true
            };
            
            // Reset UI
            modal.querySelector('#autoplayToggle').checked = true;
            modal.querySelector('#defaultVolume').value = 80;
            modal.querySelector('#volumeValue').textContent = '80%';
            modal.querySelector('#videoQuality').value = 'auto';
            modal.querySelector('#animationsToggle').checked = true;
            modal.querySelector('#visualizerToggle').checked = true;
            
            // Apply reset theme
            document.body.classList.remove('light-theme', 'no-animations');
            const themeIcon = document.getElementById('themeToggle')?.querySelector('i');
            themeIcon?.classList.replace('fa-sun', 'fa-moon');
            
            // Reset volume
            if (this.audioPlayer) this.audioPlayer.volume = 0.8;
            if (this.mainVideo) this.mainVideo.volume = 0.8;
            
            // Show visualizer
            const visualizer = document.querySelector('.audio-visualizer');
            if (visualizer) visualizer.style.display = 'block';
            
            // Save reset settings
            this.saveSettings();
            this.showToast('Settings reset to defaults');
        });
        
        modal.querySelector('#visualizerToggle')?.addEventListener('change', (e) => {
            const visualizer = document.querySelector('.audio-visualizer');
            if (visualizer) {
                visualizer.style.display = e.target.checked ? 'block' : 'none';
            }
            this.settings.visualizer = e.target.checked;
            this.saveSettings();
        });
        
        // Autoplay toggle
        modal.querySelector('#autoplayToggle')?.addEventListener('change', (e) => {
            this.settings.autoplay = e.target.checked;
            this.saveSettings();
            this.showToast(e.target.checked ? 'Autoplay enabled' : 'Autoplay disabled');
        });
        
        // Animations toggle
        modal.querySelector('#animationsToggle')?.addEventListener('change', (e) => {
            this.settings.animations = e.target.checked;
            if (e.target.checked) {
                document.body.classList.remove('no-animations');
            } else {
                document.body.classList.add('no-animations');
            }
            this.saveSettings();
            this.showToast(e.target.checked ? 'Animations enabled' : 'Animations disabled');
        });
        
        // Video quality
        modal.querySelector('#videoQuality')?.addEventListener('change', (e) => {
            this.settings.quality = e.target.value;
            this.saveSettings();
            this.showToast(`Video quality set to ${e.target.value}`);
        });
        
        // Load current settings into modal
        modal.querySelector('#autoplayToggle').checked = this.settings.autoplay;
        modal.querySelector('#defaultVolume').value = this.settings.volume;
        modal.querySelector('#volumeValue').textContent = `${this.settings.volume}%`;
        modal.querySelector('#videoQuality').value = this.settings.quality;
        modal.querySelector('#animationsToggle').checked = this.settings.animations;
        modal.querySelector('#visualizerToggle').checked = this.settings.visualizer;
    }
    
    saveSettings() {
        localStorage.setItem('luminexSettings', JSON.stringify(this.settings));
    }
    
    // ===== View Toggle =====
    setupViewToggle() {
        const viewBtns = document.querySelectorAll('.view-btn');
        const mediaGrid = document.getElementById('videoGrid');
        
        viewBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const view = btn.dataset.view;
                if (mediaGrid) {
                    if (view === 'list') {
                        mediaGrid.classList.add('list-view');
                        this.showToast('List view');
                    } else {
                        mediaGrid.classList.remove('list-view');
                        this.showToast('Grid view');
                    }
                }
            });
        });
        
        // Add list view styles
        if (!document.getElementById('listViewStyles')) {
            const styles = document.createElement('style');
            styles.id = 'listViewStyles';
            styles.textContent = `
                .media-grid.list-view {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                .media-grid.list-view .media-card {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                }
                .media-grid.list-view .card-thumbnail {
                    width: 200px;
                    min-width: 200px;
                    aspect-ratio: 16/10;
                }
                .media-grid.list-view .card-info {
                    flex: 1;
                    padding: 16px 24px;
                }
                .media-grid.list-view .favorite-btn {
                    position: relative;
                    top: auto;
                    right: auto;
                    margin-right: 16px;
                }
            `;
            document.head.appendChild(styles);
        }
    }
    
    // ===== Track Options =====
    setupTrackOptions() {
        const trackOptions = document.querySelectorAll('.track-options');
        
        trackOptions.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showTrackOptionsMenu(e, index);
            });
        });
    }
    
    showTrackOptionsMenu(e, trackIndex) {
        // Remove existing menu
        document.querySelector('.track-options-menu')?.remove();
        
        const track = this.tracks[trackIndex];
        const menu = document.createElement('div');
        menu.className = 'track-options-menu';
        menu.innerHTML = `
            <button data-action="play"><i class="fas fa-play"></i> Play</button>
            <button data-action="next"><i class="fas fa-plus"></i> Play next</button>
            <button data-action="queue"><i class="fas fa-list"></i> Add to queue</button>
            <button data-action="favorite"><i class="fas fa-heart"></i> Add to favorites</button>
            <button data-action="share"><i class="fas fa-share"></i> Share</button>
        `;
        
        // Position menu
        const rect = e.target.getBoundingClientRect();
        menu.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 5}px;
            right: ${window.innerWidth - rect.right}px;
            background: var(--bg-card);
            border: 1px solid var(--border);
            border-radius: var(--radius-md);
            padding: 8px 0;
            z-index: 1000;
            box-shadow: var(--shadow);
            min-width: 180px;
        `;
        
        document.body.appendChild(menu);
        
        // Add styles for menu items
        const menuBtns = menu.querySelectorAll('button');
        menuBtns.forEach(btn => {
            btn.style.cssText = `
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
                padding: 12px 16px;
                background: none;
                border: none;
                color: var(--text-primary);
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            `;
            btn.addEventListener('mouseenter', () => {
                btn.style.background = 'rgba(255,255,255,0.1)';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.background = 'none';
            });
        });
        
        // Handle actions
        menu.addEventListener('click', (e) => {
            const action = e.target.closest('button')?.dataset.action;
            if (!action) return;
            
            switch (action) {
                case 'play':
                    this.currentTrackIndex = trackIndex;
                    this.loadTrack(trackIndex);
                    this.audioPlayer.play();
                    this.isAudioPlaying = true;
                    document.getElementById('audioPlayPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
                    document.getElementById('miniPlayBtn').innerHTML = '<i class="fas fa-pause"></i>';
                    this.startVisualizer();
                    this.showToast(`Playing: ${track.title}`);
                    break;
                case 'next':
                    this.showToast(`"${track.title}" will play next`);
                    break;
                case 'queue':
                    this.showToast(`Added "${track.title}" to queue`);
                    break;
                case 'favorite':
                    const trackItem = document.querySelectorAll('.track-item')[trackIndex];
                    this.toggleFavorite('track', trackIndex, trackItem);
                    break;
                case 'share':
                    if (navigator.share) {
                        navigator.share({
                            title: track.title,
                            text: `Check out ${track.title} by ${track.artist}`,
                            url: window.location.href
                        });
                    } else {
                        navigator.clipboard.writeText(window.location.href);
                        this.showToast('Link copied to clipboard');
                    }
                    break;
            }
            menu.remove();
        });
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 10);
    }
    
    // ===== Playlist Section =====
    setupPlaylistSection() {
        // Create playlist button
        const createBtn = document.querySelector('.create-playlist-btn');
        createBtn?.addEventListener('click', () => {
            this.showCreatePlaylistModal();
        });
        
        // Playlist play buttons
        const playlistPlays = document.querySelectorAll('.playlist-play');
        playlistPlays.forEach((btn, index) => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Simulate playing a playlist
                this.currentTrackIndex = 0;
                this.loadTrack(0);
                this.audioPlayer.play();
                this.isAudioPlaying = true;
                document.getElementById('audioPlayPauseBtn').innerHTML = '<i class="fas fa-pause"></i>';
                document.getElementById('miniPlayBtn').innerHTML = '<i class="fas fa-pause"></i>';
                this.startVisualizer();
                
                const playlistNames = ['Chill Vibes', 'Workout Mix', 'Focus Mode'];
                this.showToast(`Playing: ${playlistNames[index]} playlist`);
                
                // Switch to music section
                document.querySelector('[data-section="music"]').click();
            });
        });
        
        // Playlist card click
        const playlistCards = document.querySelectorAll('.playlist-card');
        playlistCards.forEach((card, index) => {
            card.addEventListener('click', () => {
                const playlistNames = ['Chill Vibes', 'Workout Mix', 'Focus Mode'];
                this.showToast(`Opening: ${playlistNames[index]}`);
                // Switch to music section
                document.querySelector('[data-section="music"]').click();
            });
        });
    }
    
    showCreatePlaylistModal() {
        let modal = document.getElementById('createPlaylistModal');
        if (modal) {
            modal.classList.add('show');
            return;
        }
        
        modal = document.createElement('div');
        modal.id = 'createPlaylistModal';
        modal.className = 'settings-modal';
        modal.innerHTML = `
            <div class="settings-content" style="max-width: 400px;">
                <div class="settings-header">
                    <h3><i class="fas fa-plus"></i> Create Playlist</h3>
                    <button class="settings-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="settings-body">
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Playlist Name</label>
                        <input type="text" id="playlistName" placeholder="My Awesome Playlist" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-primary); font-size: 14px;">
                    </div>
                    <div class="form-group" style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-secondary);">Description (optional)</label>
                        <textarea id="playlistDesc" placeholder="Add a description..." style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text-primary); font-size: 14px; min-height: 80px; resize: vertical;"></textarea>
                    </div>
                    <button id="createPlaylistSubmit" style="width: 100%; padding: 14px; background: var(--gradient-1); border: none; border-radius: var(--radius-md); color: white; font-weight: 600; cursor: pointer; transition: all 0.3s ease;">Create Playlist</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
        
        modal.querySelector('.settings-close')?.addEventListener('click', () => {
            modal.classList.remove('show');
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
        
        modal.querySelector('#createPlaylistSubmit')?.addEventListener('click', () => {
            const name = modal.querySelector('#playlistName').value.trim();
            if (name) {
                this.showToast(`Playlist "${name}" created!`);
                modal.classList.remove('show');
                modal.querySelector('#playlistName').value = '';
                modal.querySelector('#playlistDesc').value = '';
            } else {
                this.showToast('Please enter a playlist name');
            }
        });
    }
    
    // ===== Mini Player =====
    setupMiniPlayer() {
        const miniPlayBtn = document.getElementById('miniPlayBtn');
        const miniPrevBtn = document.getElementById('miniPrevBtn');
        const miniNextBtn = document.getElementById('miniNextBtn');
        const miniExpandBtn = document.getElementById('miniExpandBtn');
        
        miniPlayBtn?.addEventListener('click', () => this.toggleAudioPlay());
        miniPrevBtn?.addEventListener('click', () => this.changeTrack(-1));
        miniNextBtn?.addEventListener('click', () => this.changeTrack(1));
        
        miniExpandBtn?.addEventListener('click', () => {
            document.querySelector('[data-section="music"]').click();
            document.querySelector('.audio-player-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // ===== Keyboard Controls =====
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch (e.key.toLowerCase()) {
                case ' ':
                    e.preventDefault();
                    const activeSection = document.querySelector('.content-section.active');
                    if (activeSection.id === 'videos-section') {
                        document.getElementById('playPauseBtn')?.click();
                    } else if (activeSection.id === 'music-section') {
                        this.toggleAudioPlay();
                    }
                    break;
                case 'arrowleft':
                    if (document.querySelector('#music-section.active')) {
                        this.audioPlayer.currentTime -= 10;
                    } else {
                        this.mainVideo.currentTime -= 10;
                    }
                    break;
                case 'arrowright':
                    if (document.querySelector('#music-section.active')) {
                        this.audioPlayer.currentTime += 10;
                    } else {
                        this.mainVideo.currentTime += 10;
                    }
                    break;
                case 'arrowup':
                    e.preventDefault();
                    if (document.querySelector('#music-section.active')) {
                        this.audioPlayer.volume = Math.min(1, this.audioPlayer.volume + 0.1);
                    } else {
                        this.mainVideo.volume = Math.min(1, this.mainVideo.volume + 0.1);
                    }
                    break;
                case 'arrowdown':
                    e.preventDefault();
                    if (document.querySelector('#music-section.active')) {
                        this.audioPlayer.volume = Math.max(0, this.audioPlayer.volume - 0.1);
                    } else {
                        this.mainVideo.volume = Math.max(0, this.mainVideo.volume - 0.1);
                    }
                    break;
                case 'm':
                    if (document.querySelector('#music-section.active')) {
                        this.audioPlayer.muted = !this.audioPlayer.muted;
                    } else {
                        document.getElementById('muteBtn')?.click();
                    }
                    break;
                case 'f':
                    document.getElementById('fullscreenBtn')?.click();
                    break;
                case 'n':
                    if (document.querySelector('#music-section.active')) {
                        this.changeTrack(1);
                    } else {
                        this.changeVideo(1);
                    }
                    break;
                case 'p':
                    if (document.querySelector('#music-section.active')) {
                        this.changeTrack(-1);
                    } else {
                        this.changeVideo(-1);
                    }
                    break;
            }
        });
    }
    
    // ===== Utilities =====
    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
    
    animateOnLoad() {
        // Stagger animation for cards
        const cards = document.querySelectorAll('.media-card, .track-item, .playlist-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
}

// Initialize the player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.luminexPlayer = new LuminexPlayer();
    
    console.log('🎬 Luminex Media Player initialized');
    console.log('⌨️ Keyboard shortcuts: Space (play/pause), ←→ (seek), ↑↓ (volume), M (mute), F (fullscreen), N/P (next/prev)');
});
