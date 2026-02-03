// Yeti Games - Interactive JavaScript
class YetiGames {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.animateElements();
        this.setupGameCards();
        this.loadHighScores();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });

        // Game cards
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleGamePlay(e.target);
            });
        });

        // Featured games
        document.querySelectorAll('.featured-item').forEach(item => {
            item.addEventListener('click', (e) => {
                this.handleFeaturedGame(item);
            });
        });

        // Responsive aurora on mouse move
        document.addEventListener('mousemove', (e) => {
            this.updateAurora(e);
        });
    }

    handleNavigation(item) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('active');
        });
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Add click effect
        this.createClickEffect(item);
        
        // Handle different navigation options
        const text = item.textContent.trim();
        switch(text) {
            case '🏠 HOME':
                this.showHomeView();
                break;
            case '🏆 LEADERBOARDS':
                this.showLeaderboards();
                break;
            case '👤 PROFILE':
                this.showProfile();
                break;
        }
    }

    handleGamePlay(button) {
        const card = button.closest('.game-card');
        const gameTitle = card.querySelector('.game-title').textContent.trim();
        
        // Add loading state
        button.textContent = 'LOADING...';
        button.disabled = true;
        
        // Create play effect
        this.createPlayEffect(card);
        
        // Simulate game loading
        setTimeout(() => {
            button.textContent = 'PLAY NOW';
            button.disabled = false;
            this.launchGame(gameTitle);
        }, 2000);
    }

    handleFeaturedGame(item) {
        const gameTitle = item.querySelector('span').textContent;
        this.createClickEffect(item);
        
        setTimeout(() => {
            alert(`🎮 ${gameTitle} - Coming Soon!\nThis game is currently under development.`);
        }, 200);
    }

    launchGame(gameTitle) {
        const games = {
            'COSMIC\nPIRATE': 'Blast off into space! Navigate through asteroid fields and battle cosmic enemies!',
            'ANCIENT\nRUNES': 'Decode mysterious runes and unlock ancient secrets in this puzzle adventure!',
            'NEON\nSPEEDWAYS': 'Race through cyberpunk cities at lightning speed! Can you handle the neon rush?'
        };
        
        const description = games[gameTitle] || 'An amazing gaming experience awaits!';
        
        // Create game modal
        this.showGameModal(gameTitle, description);
    }

    showGameModal(title, description) {
        const modal = document.createElement('div');
        modal.className = 'game-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎮 ${title.replace('\n', ' ')}</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <p>${description}</p>
                    <div class="game-preview">
                        <div class="preview-screen">
                            <div class="loading-game">
                                <div class="game-loader"></div>
                                <p>Initializing Game Engine...</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button class="start-game-btn">START GAME</button>
                        <button class="demo-btn">WATCH DEMO</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .game-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                backdrop-filter: blur(10px);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease;
            }
            
            .modal-content {
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                color: white;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 2rem;
                cursor: pointer;
                opacity: 0.7;
                transition: opacity 0.3s;
            }
            
            .close-btn:hover {
                opacity: 1;
            }
            
            .preview-screen {
                background: #000;
                border-radius: 10px;
                height: 200px;
                margin: 20px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid #333;
            }
            
            .loading-game {
                text-align: center;
                color: #00ff80;
            }
            
            .game-loader {
                width: 50px;
                height: 50px;
                border: 3px solid #333;
                border-top: 3px solid #00ff80;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 15px;
            }
            
            .modal-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 20px;
            }
            
            .start-game-btn, .demo-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .start-game-btn {
                background: linear-gradient(145deg, #00ff80, #00cc66);
                color: white;
            }
            
            .demo-btn {
                background: rgba(255,255,255,0.1);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
            }
            
            .start-game-btn:hover, .demo-btn:hover {
                transform: translateY(-2px);
            }
            
            @keyframes modalFadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-btn');
        const startBtn = modal.querySelector('.start-game-btn');
        const demoBtn = modal.querySelector('.demo-btn');
        
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'modalFadeOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyles);
            }, 300);
        });
        
        startBtn.addEventListener('click', () => {
            alert('🚀 Game launching in full-screen mode!\n(Demo - Full game would start here)');
            closeBtn.click();
        });
        
        demoBtn.addEventListener('click', () => {
            alert('📺 Demo video would play here!\n(Feature coming soon)');
        });
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeBtn.click();
        });
    }

    createClickEffect(element) {
        const rect = element.getBoundingClientRect();
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            left: ${rect.left + rect.width/2}px;
            top: ${rect.top + rect.height/2}px;
            width: 10px;
            height: 10px;
            background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
            border-radius: 50%;
            pointer-events: none;
            z-index: 999;
            animation: clickPulse 0.6s ease-out forwards;
        `;
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            document.body.removeChild(effect);
        }, 600);
    }

    createPlayEffect(card) {
        const particles = [];
        const rect = card.getBoundingClientRect();
        
        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                left: ${rect.left + rect.width/2}px;
                top: ${rect.top + rect.height/2}px;
                width: 6px;
                height: 6px;
                background: ${['#ff1493', '#00ffff', '#00ff80'][Math.floor(Math.random() * 3)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 999;
                animation: particleBurst 1s ease-out forwards;
                animation-delay: ${Math.random() * 0.2}s;
                transform: translate(-50%, -50%);
            `;
            
            particles.push(particle);
            document.body.appendChild(particle);
        }
        
        setTimeout(() => {
            particles.forEach(p => {
                if (document.body.contains(p)) {
                    document.body.removeChild(p);
                }
            });
        }, 1200);
    }

    updateAurora(e) {
        const { clientX, clientY } = e;
        const xPercent = clientX / window.innerWidth;
        const yPercent = clientY / window.innerHeight;
        
        document.documentElement.style.setProperty('--mouse-x', `${xPercent * 100}%`);
        document.documentElement.style.setProperty('--mouse-y', `${yPercent * 100}%`);
    }

    loadHighScores() {
        // Simulate dynamic score updates
        const scores = [
            { player: 'ICE_KING', points: Math.floor(Math.random() * 50) + 50 },
            { player: 'SNOW_QUEEN', points: Math.floor(Math.random() * 40) + 30 },
            { player: 'FROST_BITE', points: Math.floor(Math.random() * 35) + 25 },
            { player: 'YETI_MASTER', points: Math.floor(Math.random() * 60) + 40 }
        ];
        
        const scoresList = document.querySelector('.scores-list');
        scoresList.innerHTML = '';
        
        scores.sort((a, b) => b.points - a.points).forEach(score => {
            const item = document.createElement('div');
            item.className = 'score-item';
            item.innerHTML = `
                <span class="player">${score.player}</span>
                <span class="points">${score.points}</span>
            `;
            scoresList.appendChild(item);
        });
    }

    showHomeView() {
        // Already on home - add some visual feedback
        document.body.style.animation = 'homeGlow 0.5s ease';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 500);
    }

    showLeaderboards() {
        alert('🏆 Full Leaderboards\n\nComing Soon!\nView complete rankings, achievements, and player statistics.');
    }

    showProfile() {
        alert('👤 Player Profile\n\nComing Soon!\nCustomize your avatar, view your achievements, and track your progress.');
    }

    createParticles() {
        // Add floating particles effect
        setInterval(() => {
            if (Math.random() > 0.7) {
                this.createFloatingParticle();
            }
        }, 2000);
    }

    createFloatingParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${Math.random() * 100}vw;
            bottom: -10px;
            width: 4px;
            height: 4px;
            background: rgba(255,255,255,0.6);
            border-radius: 50%;
            pointer-events: none;
            z-index: 5;
            animation: floatUp ${5 + Math.random() * 5}s linear forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 10000);
    }

    animateElements() {
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes clickPulse {
                0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
            }
            
            @keyframes particleBurst {
                0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
                100% { 
                    transform: translate(-50%, -50%) scale(0) rotate(360deg) 
                              translateX(${Math.random() * 100 - 50}px) 
                              translateY(${Math.random() * 100 - 50}px); 
                    opacity: 0; 
                }
            }
            
            @keyframes floatUp {
                0% { transform: translateY(0px); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh); opacity: 0; }
            }
            
            @keyframes homeGlow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.1); }
            }
            
            @keyframes modalFadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(style);
    }

    setupGameCards() {
        // Add hover sound effects (visual feedback)
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.filter = 'brightness(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.filter = 'brightness(1)';
            });
        });
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new YetiGames();
});

// Add some extra interactive features
document.addEventListener('keydown', (e) => {
    // Easter egg: Konami code
    if (e.code === 'ArrowUp') {
        document.body.style.filter = 'hue-rotate(45deg)';
        setTimeout(() => {
            document.body.style.filter = '';
        }, 1000);
    }
});

// Performance optimization: Throttle mouse move events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}