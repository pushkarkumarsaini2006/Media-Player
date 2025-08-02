// YouTube Media Player JavaScript

class YouTubeMediaPlayer {
    constructor() {
        this.videoLinks = [];
        this.audioLinks = [];
        this.init();
    }

    init() {
        this.collectMediaLinks();
        this.setupGlobalControls();
        this.setupAnimations();
        this.setupKeyboardControls();
        this.handleResponsive();
    }

    collectMediaLinks() {
        // Collect all YouTube video links
        const videoLinks = document.querySelectorAll('.youtube-btn');
        videoLinks.forEach(link => {
            this.videoLinks.push(link.href);
        });

        // Collect all YouTube audio links
        const audioLinks = document.querySelectorAll('.youtube-audio-btn');
        audioLinks.forEach(link => {
            this.audioLinks.push(link.href);
        });
    }

    // Global Controls
    setupGlobalControls() {
        const openAllVideos = document.getElementById('openAllVideos');
        const openAllAudios = document.getElementById('openAllAudios');

        if (openAllVideos) {
            openAllVideos.addEventListener('click', () => this.openAllMedia(this.videoLinks, 'videos'));
        }
        
        if (openAllAudios) {
            openAllAudios.addEventListener('click', () => this.openAllMedia(this.audioLinks, 'audio'));
        }
    }

    openAllMedia(mediaLinks, type) {
        if (mediaLinks.length === 0) {
            alert(`No ${type} links found!`);
            return;
        }

        // Ask user for confirmation before opening multiple tabs
        const confirmed = confirm(`This will open ${mediaLinks.length} new tabs for ${type}. Continue?`);
        if (confirmed) {
            mediaLinks.forEach((link, index) => {
                setTimeout(() => {
                    window.open(link, '_blank');
                }, index * 500); // Stagger the opening to avoid browser blocking
            });
        }
    }

    // Animation and Visual Effects
    setupAnimations() {
        // Add staggered animation to media items
        const mediaItems = document.querySelectorAll('.media-item, .audio-item');
        
        mediaItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Add hover effects to media items
        mediaItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add click effects to buttons
        const allButtons = document.querySelectorAll('.control-btn, .youtube-btn, .youtube-audio-btn');
        
        allButtons.forEach(button => {
            button.addEventListener('click', () => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }

    // Keyboard Controls
    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Only trigger if not typing in an input field
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
                switch(e.key.toLowerCase()) {
                    case 'v':
                        e.preventDefault();
                        document.getElementById('openAllVideos')?.click();
                        break;
                    case 'a':
                        e.preventDefault();
                        document.getElementById('openAllAudios')?.click();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.showKeyboardShortcuts();
                        break;
                    case 'escape':
                        e.preventDefault();
                        this.showWelcomeMessage();
                        break;
                }
            }
        });
    }

    showKeyboardShortcuts() {
        const shortcuts = `
🎹 Keyboard Shortcuts:
• V - Open all videos
• A - Open all audio content  
• H - Show this help
• ESC - Show welcome message

📺 YouTube Integration:
• Click individual items to open on YouTube
• Use global controls to open multiple items
• All content opens in new tabs for better experience

🎯 Topics Covered:
• MongoDB - NoSQL Database
• React.js - Frontend Framework  
• Express.js - Backend Framework
        `;
        
        alert(shortcuts);
    }

    showWelcomeMessage() {
        const message = `
🎬 Welcome to the Full Stack Web Development Media Player!

This curated collection includes:
📚 MongoDB Tutorial Videos
⚛️ React.js Learning Content
🚀 Express.js Development Guides

All content is hosted on YouTube for the best learning experience.
Press 'H' for keyboard shortcuts or explore the content below!
        `;
        
        alert(message);
    }

    // Utility method for responsive behavior
    handleResponsive() {
        const mediaGrid = document.querySelector('.media-grid');
        const audioGrid = document.querySelector('.audio-grid');
        
        const updateLayout = () => {
            const width = window.innerWidth;
            if (width < 768) {
                // Mobile layout adjustments
                if (mediaGrid) mediaGrid.style.gridTemplateColumns = '1fr';
                if (audioGrid) audioGrid.style.gridTemplateColumns = '1fr';
            } else if (width < 1024) {
                // Tablet layout
                if (mediaGrid) mediaGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                if (audioGrid) audioGrid.style.gridTemplateColumns = '1fr';
            } else {
                // Desktop layout
                if (mediaGrid) mediaGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
                if (audioGrid) audioGrid.style.gridTemplateColumns = '1fr';
            }
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
    }

    // Performance tracking
    trackPerformance() {
        console.log(`📊 Media Player Stats:
        Videos: ${this.videoLinks.length}
        Audio: ${this.audioLinks.length}
        Total Items: ${this.videoLinks.length + this.audioLinks.length}`);
    }
}

// Initialize the YouTube Media Player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new YouTubeMediaPlayer();
    
    // Show welcome message after a short delay
    setTimeout(() => {
        player.showWelcomeMessage();
    }, 1000);
    
    // Track performance
    player.trackPerformance();
    
    // Add success message to console
    console.log('🎬 YouTube Media Player loaded successfully!');
    console.log('📚 Ready to explore MongoDB, React, and Express content!');
    console.log('Press H for keyboard shortcuts');
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = YouTubeMediaPlayer;
}
