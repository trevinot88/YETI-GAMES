// Yeti Games - Cowboy Shootout Integration
class YetiGames {
    constructor() {
        this.cowboySocket = null;
        this.lobbyUpdateInterval = null;
        this.gameServerUrl = 'http://localhost:3000'; // Your Cowboy Shootout server
        this.isConnected = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.createParticles();
        this.animateElements();
        this.loadHighScores();
        this.connectToCowboyServer();
    }

    // Connect to actual Cowboy Shootout server
    connectToCowboyServer() {
        try {
            // Try to connect to the real server
            this.cowboySocket = io(this.gameServerUrl);
            
            this.cowboySocket.on('connect', () => {
                console.log('Connected to Cowboy Shootout server');
                this.isConnected = true;
                this.initRealLobby();
            });
            
            this.cowboySocket.on('disconnect', () => {
                console.log('Disconnected from Cowboy Shootout server');
                this.isConnected = false;
                this.fallbackToSimulation();
            });
            
            this.cowboySocket.on('lobby-update', (data) => {
                this.updateLobbyDisplay(data);
            });
            
            // Fallback to simulation if server isn't running
            setTimeout(() => {
                if (!this.isConnected) {
                    console.log('Cowboy Shootout server not available, using simulation');
                    this.fallbackToSimulation();
                }
            }, 3000);
            
        } catch (error) {
            console.log('Could not connect to game server, using simulation');
            this.fallbackToSimulation();
        }
    }

    initRealLobby() {
        // Request lobby stats from real server
        this.cowboySocket.emit('get-lobby-stats');
        
        // Update lobby stats every 5 seconds
        this.lobbyUpdateInterval = setInterval(() => {
            if (this.isConnected) {
                this.cowboySocket.emit('get-lobby-stats');
            }
        }, 5000);
    }

    fallbackToSimulation() {
        // Fallback to simulated lobby data when server is unavailable
        this.updateCowboyLobby();
        this.lobbyUpdateInterval = setInterval(() => {
            this.updateCowboyLobby();
        }, 3000);
    }

    updateLobbyDisplay(data) {
        const onlineElement = document.getElementById('cowboy-online');
        const waitingElement = document.getElementById('cowboy-waiting');
        
        if (onlineElement && data.online !== undefined) {
            onlineElement.textContent = data.online;
            onlineElement.style.color = data.online > 1 ? '#00FF00' : '#FFD700';
        }
        
        if (waitingElement && data.waiting !== undefined) {
            waitingElement.textContent = data.waiting;
            waitingElement.style.color = data.waiting > 0 ? '#FF6B6B' : '#00FF00';
        }
    }

    updateCowboyLobby() {
        // Simulate realistic lobby numbers
        const onlineCount = Math.floor(Math.random() * 20) + 5; // 5-25 online
        const waitingCount = Math.floor(Math.random() * 6); // 0-5 waiting
        
        const onlineElement = document.getElementById('cowboy-online');
        const waitingElement = document.getElementById('cowboy-waiting');
        
        if (onlineElement) {
            onlineElement.textContent = onlineCount;
            onlineElement.style.color = onlineCount > 10 ? '#00FF00' : '#FFD700';
        }
        
        if (waitingElement) {
            waitingElement.textContent = waitingCount;
            waitingElement.style.color = waitingCount > 0 ? '#FF6B6B' : '#00FF00';
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(item);
            });
        });

        // Instructions hover effects
        document.querySelectorAll('.instruction-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.createClickEffect(item);
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

    showLeaderboards() {
        alert('🏆 Full Leaderboards\n\nComing Soon!\nView complete rankings, achievements, and player statistics.');
    }

    showProfile() {
        alert('👤 Player Profile\n\nComing Soon!\nCustomize your avatar, view your achievements, and track your progress.');
    }

    // Join Cowboy Shootout lobby
    joinCowboyLobby() {
        const modal = document.createElement('div');
        modal.className = 'lobby-modal';
        modal.innerHTML = `
            <div class="modal-content lobby-content">
                <div class="modal-header">
                    <h2>🤠 COWBOY SHOOTOUT LOBBY</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="lobby-status">
                        <div class="status-item">
                            <span class="status-label">Players Online:</span>
                            <span class="status-value" id="lobby-online">${document.getElementById('cowboy-online').textContent}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">In Queue:</span>
                            <span class="status-value" id="lobby-queue">${document.getElementById('cowboy-waiting').textContent}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">Active Matches:</span>
                            <span class="status-value" id="lobby-matches">${Math.floor(Math.random() * 5) + 2}</span>
                        </div>
                    </div>
                    
                    <div class="lobby-controls">
                        <button class="lobby-btn quick-match" onclick="startQuickMatch()">⚡ QUICK MATCH</button>
                        <button class="lobby-btn create-room" onclick="createRoom()">🎯 CREATE ROOM</button>
                        <button class="lobby-btn join-room" onclick="joinRoom()">🚪 JOIN ROOM</button>
                    </div>
                    
                    <div class="game-info">
                        <h3>🎮 Game Features:</h3>
                        <ul>
                            <li>• 1v1 Real-time PvP Combat</li>
                            <li>• Strategic Bullet Management</li>
                            <li>• Platform-based Movement</li>
                            <li>• Health & Ammo Pickups</li>
                            <li>• Skill-based Matchmaking</li>
                        </ul>
                    </div>
                    
                    <div class="connection-status">
                        <div class="status-indicator connected"></div>
                        <span>Connected to Lobby Server</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add lobby modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
            .lobby-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease;
            }
            
            .lobby-content {
                background: linear-gradient(135deg, rgba(26, 42, 108, 0.9), rgba(138, 43, 226, 0.8));
                backdrop-filter: blur(20px);
                border: 2px solid #00FFFF;
                border-radius: 20px;
                padding: 30px;
                max-width: 600px;
                width: 90%;
                color: white;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 0 50px rgba(0, 255, 255, 0.3);
            }
            
            .lobby-status {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                gap: 15px;
                margin: 20px 0;
                padding: 20px;
                background: rgba(0,0,0,0.3);
                border-radius: 15px;
                border: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .status-item {
                text-align: center;
                padding: 10px;
            }
            
            .status-label {
                display: block;
                font-size: 0.9rem;
                color: #A8E6FF;
                margin-bottom: 5px;
            }
            
            .status-value {
                display: block;
                font-size: 1.8rem;
                font-weight: bold;
                color: #00FF00;
                text-shadow: 0 0 10px #00FF00;
            }
            
            .lobby-controls {
                display: flex;
                gap: 15px;
                justify-content: center;
                flex-wrap: wrap;
                margin: 25px 0;
            }
            
            .lobby-btn {
                padding: 15px 25px;
                border: none;
                border-radius: 25px;
                font-weight: 700;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s;
                text-transform: uppercase;
                letter-spacing: 1px;
                min-width: 150px;
            }
            
            .quick-match {
                background: linear-gradient(145deg, #FF6B6B, #FF4757);
                color: white;
                box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
            }
            
            .create-room {
                background: linear-gradient(145deg, #00FF80, #00CC66);
                color: white;
                box-shadow: 0 0 20px rgba(0, 255, 128, 0.4);
            }
            
            .join-room {
                background: linear-gradient(145deg, #8A2BE2, #9B59B6);
                color: white;
                box-shadow: 0 0 20px rgba(138, 43, 226, 0.4);
            }
            
            .lobby-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 30px rgba(255, 255, 255, 0.2);
            }
            
            .game-info {
                background: rgba(0,0,0,0.2);
                border-radius: 15px;
                padding: 20px;
                margin: 20px 0;
                border-left: 4px solid #00FFFF;
            }
            
            .game-info h3 {
                color: #00FFFF;
                margin-bottom: 15px;
                text-shadow: 0 0 10px #00FFFF;
            }
            
            .game-info ul {
                list-style: none;
                padding: 0;
            }
            
            .game-info li {
                color: #A8E6FF;
                margin: 8px 0;
                font-size: 0.95rem;
            }
            
            .connection-status {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
                padding: 10px;
                background: rgba(0, 255, 0, 0.1);
                border-radius: 10px;
                border: 1px solid rgba(0, 255, 0, 0.3);
            }
            
            .status-indicator {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                animation: pulse 2s infinite;
            }
            
            .status-indicator.connected {
                background: #00FF00;
                box-shadow: 0 0 10px #00FF00;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        
        document.head.appendChild(modalStyles);
        document.body.appendChild(modal);
        
        // Close functionality
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'modalFadeOut 0.3s ease forwards';
            setTimeout(() => {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyles);
            }, 300);
        });
        
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
    window.yetiGames = new YetiGames();
});

// Global functions for lobby interactions
function showMatchmakingModal() {
    // Create enhanced matchmaking modal
    const modal = document.createElement('div');
    modal.className = 'matchmaking-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>🤠 Cowboy Shootout Lobby</h2>
                <button class="close-btn" onclick="this.parentElement.parentElement.parentElement.remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="lobby-options">
                    <div class="lobby-stats">
                        <div class="stat-box">
                            <span class="stat-number" id="online-players">2</span>
                            <span class="stat-label">Players Online</span>
                        </div>
                        <div class="stat-box">
                            <span class="stat-number" id="active-games">1</span>
                            <span class="stat-label">Active Games</span>
                        </div>
                    </div>
                    
                    <div class="game-modes">
                        <h3>🎯 Select Game Mode</h3>
                        <button class="mode-btn quick-match" onclick="startQuickMatch()">
                            ⚡ Quick Match
                            <small>Find opponent instantly</small>
                        </button>
                        <button class="mode-btn private-game" onclick="createPrivateRoom()">
                            🏠 Private Room
                            <small>Play with friends</small>
                        </button>
                        <button class="mode-btn invite-link" onclick="generateInviteLink()">
                            🔗 Invite Friends
                            <small>Share link to play together</small>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        <style>
            .matchmaking-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                backdrop-filter: blur(10px);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: modalFadeIn 0.3s ease;
            }
            
            .lobby-options {
                text-align: center;
            }
            
            .lobby-stats {
                display: flex;
                justify-content: center;
                gap: 30px;
                margin-bottom: 30px;
            }
            
            .stat-box {
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px;
                padding: 20px;
                min-width: 120px;
                display: flex;
                flex-direction: column;
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: bold;
                color: #00FFFF;
                text-shadow: 0 0 20px #00FFFF;
            }
            
            .stat-label {
                color: #A8E6FF;
                font-size: 0.9rem;
                margin-top: 5px;
            }
            
            .game-modes h3 {
                color: #FFFFFF;
                margin-bottom: 20px;
                text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
            }
            
            .mode-btn {
                display: block;
                width: 280px;
                margin: 15px auto;
                padding: 20px;
                background: linear-gradient(145deg, #1A2A6C, #0B1426);
                border: 2px solid #00FFFF;
                border-radius: 15px;
                color: white;
                font-size: 1.2rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 5px 20px rgba(0, 255, 255, 0.2);
            }
            
            .mode-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 30px rgba(0, 255, 255, 0.4);
                background: linear-gradient(145deg, #00FFFF, #1A2A6C);
                color: #000;
            }
            
            .mode-btn small {
                display: block;
                font-size: 0.8rem;
                font-weight: normal;
                margin-top: 5px;
                opacity: 0.8;
            }
        </style>
    `;
    
    document.body.appendChild(modal);
    
    // Update lobby stats periodically
    updateLobbyStats();
}

function updateLobbyStats() {
    // Simulate real lobby stats (you can connect this to actual server data)
    const onlinePlayers = Math.floor(Math.random() * 8) + 2; // 2-10 players
    const activeGames = Math.floor(onlinePlayers / 2);
    
    const playersElement = document.getElementById('online-players');
    const gamesElement = document.getElementById('active-games');
    
    if (playersElement) playersElement.textContent = onlinePlayers;
    if (gamesElement) gamesElement.textContent = activeGames;
}

function createPrivateRoom() {
    const modal = document.querySelector('.matchmaking-modal .modal-body');
    modal.innerHTML = `
        <div class="private-room-setup">
            <h3>🏠 Create Private Room</h3>
            <div class="room-options">
                <div class="input-group">
                    <label>Room Name:</label>
                    <input type="text" id="room-name" placeholder="Enter room name..." maxlength="20">
                </div>
                <div class="input-group">
                    <label>Room Code:</label>
                    <input type="text" id="room-code" value="${Math.random().toString(36).substr(2, 6).toUpperCase()}" readonly>
                    <button onclick="copyRoomCode()" class="copy-btn">📋 Copy</button>
                </div>
            </div>
            <div class="room-actions">
                <button class="create-room-btn" onclick="finalizePrivateRoom()">🚀 Create Room</button>
                <button class="back-btn" onclick="showMatchmakingModal()">← Back</button>
            </div>
        </div>
        
        <style>
            .private-room-setup {
                text-align: center;
                padding: 20px;
            }
            
            .input-group {
                margin: 20px 0;
                text-align: left;
            }
            
            .input-group label {
                display: block;
                color: #A8E6FF;
                margin-bottom: 8px;
                font-weight: bold;
            }
            
            .input-group input {
                width: 100%;
                padding: 12px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 8px;
                color: white;
                font-size: 1rem;
            }
            
            .copy-btn {
                background: #00FF80;
                color: black;
                border: none;
                padding: 8px 12px;
                border-radius: 5px;
                margin-left: 10px;
                cursor: pointer;
                font-weight: bold;
            }
            
            .room-actions {
                margin-top: 30px;
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .create-room-btn, .back-btn {
                padding: 12px 25px;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .create-room-btn {
                background: linear-gradient(145deg, #00FF80, #00CC66);
                color: white;
            }
            
            .back-btn {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
            }
        </style>
    `;
}

function copyRoomCode() {
    const roomCode = document.getElementById('room-code');
    roomCode.select();
    document.execCommand('copy');
    
    // Show feedback
    const copyBtn = event.target;
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => {
        copyBtn.textContent = '📋 Copy';
    }, 2000);
}

function generateInviteLink() {
    const modal = document.querySelector('.matchmaking-modal .modal-body');
    const gameId = Math.random().toString(36).substr(2, 8).toUpperCase();
    const inviteUrl = `${window.location.origin}/cowboy-game/?invite=${gameId}`;
    
    modal.innerHTML = `
        <div class="invite-link-screen">
            <h3>🔗 Invite Friends to Play</h3>
            <div class="invite-container">
                <div class="invite-details">
                    <p>Share this link with your friends to play together!</p>
                    <div class="link-container">
                        <input type="text" id="invite-url" value="${inviteUrl}" readonly>
                        <button onclick="copyInviteLink()" class="copy-link-btn">📋 Copy Link</button>
                    </div>
                    
                    <div class="invite-options">
                        <h4>Share via:</h4>
                        <div class="share-buttons">
                            <button onclick="shareViaEmail('${inviteUrl}')" class="share-btn email-btn">
                                📧 Email
                            </button>
                            <button onclick="shareViaSMS('${inviteUrl}')" class="share-btn sms-btn">
                                💬 SMS
                            </button>
                            <button onclick="shareToClipboard('${inviteUrl}')" class="share-btn clipboard-btn">
                                📋 Copy
                            </button>
                        </div>
                    </div>
                    
                    <div class="game-info">
                        <div class="info-item">
                            <span class="info-label">Game ID:</span>
                            <span class="info-value">${gameId}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Players:</span>
                            <span class="info-value">1/2 joined</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Status:</span>
                            <span class="info-value waiting-status">Waiting for players...</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="invite-actions">
                <button class="start-waiting-btn" onclick="startWaitingForFriend('${gameId}')">🎮 Start Waiting</button>
                <button class="back-btn" onclick="showMatchmakingModal()">← Back to Lobby</button>
            </div>
        </div>
        
        <style>
            .invite-link-screen {
                text-align: center;
                padding: 20px;
            }
            
            .invite-container {
                margin: 20px 0;
            }
            
            .invite-details p {
                color: #A8E6FF;
                margin-bottom: 20px;
                font-size: 1.1rem;
            }
            
            .link-container {
                display: flex;
                gap: 10px;
                margin-bottom: 25px;
                align-items: center;
            }
            
            .link-container input {
                flex: 1;
                padding: 12px;
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 8px;
                color: white;
                font-size: 0.9rem;
                text-align: center;
            }
            
            .copy-link-btn {
                background: #00FFFF;
                color: black;
                border: none;
                padding: 12px 20px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .copy-link-btn:hover {
                background: #00E6E6;
                transform: translateY(-2px);
            }
            
            .invite-options h4 {
                color: white;
                margin: 20px 0 15px 0;
            }
            
            .share-buttons {
                display: flex;
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
            }
            
            .share-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 20px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
                font-size: 0.9rem;
            }
            
            .email-btn {
                background: linear-gradient(145deg, #FF6B6B, #EE5A24);
                color: white;
            }
            
            .sms-btn {
                background: linear-gradient(145deg, #00D2D3, #01A3A4);
                color: white;
            }
            
            .clipboard-btn {
                background: linear-gradient(145deg, #8A2BE2, #FF00FF);
                color: white;
            }
            
            .share-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .game-info {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                padding: 20px;
                margin: 25px 0;
                border: 1px solid rgba(0, 255, 255, 0.2);
            }
            
            .info-item {
                display: flex;
                justify-content: space-between;
                margin: 10px 0;
            }
            
            .info-label {
                color: #A8E6FF;
                font-weight: bold;
            }
            
            .info-value {
                color: white;
            }
            
            .waiting-status {
                color: #FFFF00;
                animation: blink 2s infinite;
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0.5; }
            }
            
            .invite-actions {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 25px;
            }
            
            .start-waiting-btn {
                background: linear-gradient(145deg, #00FF80, #00CC66);
                color: black;
                padding: 15px 30px;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .start-waiting-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0, 255, 128, 0.4);
            }
            
            .back-btn {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 15px 25px;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .back-btn:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
            }
        </style>
    `;
}

function copyInviteLink() {
    const urlInput = document.getElementById('invite-url');
    urlInput.select();
    document.execCommand('copy');
    
    // Show feedback
    const copyBtn = event.target;
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✅ Copied!';
    copyBtn.style.background = '#00FF80';
    
    setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.style.background = '#00FFFF';
    }, 2000);
}

function shareViaEmail(url) {
    const subject = encodeURIComponent('🤠 Join me for Cowboy Shootout!');
    const body = encodeURIComponent(`Hey! Want to play Cowboy Shootout with me?\\n\\nClick this link to join the game:\\n${url}\\n\\nSee you in the wild west! 🤠`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
}

function shareViaSMS(url) {
    const message = encodeURIComponent(`🤠 Join me for Cowboy Shootout! ${url}`);
    window.open(`sms:?body=${message}`, '_blank');
}

function shareToClipboard(url) {
    navigator.clipboard.writeText(url).then(() => {
        // Show feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅ Copied!';
        btn.style.background = '#00FF80';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = 'linear-gradient(145deg, #8A2BE2, #FF00FF)';
        }, 2000);
    });
}

function startWaitingForFriend(gameId) {
    const modal = document.querySelector('.matchmaking-modal .modal-body');
    
    modal.innerHTML = `
        <div class="waiting-screen">
            <h3>⏳ Waiting for Friends...</h3>
            <div class="waiting-animation">
                <div class="cowboy-waiting">🤠</div>
                <div class="dots">...</div>
            </div>
            <div class="waiting-info">
                <p>Game ID: <strong>${gameId}</strong></p>
                <p>Players: <span id="current-players">1</span>/2</p>
                <div class="waiting-status">
                    <span class="status-dot"></span>
                    <span>Waiting for players to join...</span>
                </div>
            </div>
            <div class="waiting-actions">
                <button class="cancel-waiting-btn" onclick="showMatchmakingModal()">❌ Cancel</button>
                <button class="start-anyway-btn" onclick="launchCowboyGame()">🎮 Play with AI</button>
            </div>
        </div>
        
        <style>
            .waiting-screen {
                text-align: center;
                padding: 30px 20px;
            }
            
            .waiting-animation {
                margin: 30px 0;
            }
            
            .cowboy-waiting {
                font-size: 4rem;
                animation: waitingBob 2s ease-in-out infinite;
            }
            
            .dots {
                font-size: 2rem;
                color: #00FFFF;
                animation: dotsBlink 1.5s infinite;
                margin-top: 10px;
            }
            
            @keyframes waitingBob {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
            }
            
            @keyframes dotsBlink {
                0%, 33% { opacity: 1; }
                34%, 66% { opacity: 0.5; }
                67%, 100% { opacity: 1; }
            }
            
            .waiting-info {
                background: rgba(0, 0, 0, 0.4);
                border-radius: 15px;
                padding: 20px;
                margin: 25px 0;
                border: 1px solid rgba(0, 255, 255, 0.3);
            }
            
            .waiting-info p {
                color: #A8E6FF;
                margin: 10px 0;
                font-size: 1.1rem;
            }
            
            .waiting-status {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-top: 15px;
            }
            
            .status-dot {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: #FFFF00;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.5; transform: scale(1.2); }
            }
            
            .waiting-actions {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 30px;
            }
            
            .cancel-waiting-btn {
                background: rgba(255, 0, 0, 0.2);
                color: white;
                border: 1px solid rgba(255, 0, 0, 0.5);
                padding: 12px 25px;
                border-radius: 20px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .start-anyway-btn {
                background: linear-gradient(145deg, #FF8C00, #FF6600);
                color: white;
                border: none;
                padding: 12px 25px;
                border-radius: 20px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .cancel-waiting-btn:hover {
                background: rgba(255, 0, 0, 0.4);
                transform: translateY(-2px);
            }
            
            .start-anyway-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 5px 20px rgba(255, 140, 0, 0.4);
            }
        </style>
    `;
    
    // Simulate checking for players (you can connect this to real server logic)
    setTimeout(() => {
        const playersElement = document.getElementById('current-players');
        if (playersElement && Math.random() > 0.7) {
            playersElement.textContent = '2';
            // Auto-start game when friend joins
            setTimeout(() => {
                showMatchFound();
            }, 1000);
        }
    }, 5000);
}

function finalizePrivateRoom() {
    // Launch the game in new tab with room parameters
    const roomName = document.getElementById('room-name').value || 'Private Room';
    const roomCode = document.getElementById('room-code').value;
    
    // Close modal and launch game
    document.querySelector('.matchmaking-modal').remove();
    
    // Open game with room parameters
    window.open(`/cowboy-game/?room=${roomCode}&name=${encodeURIComponent(roomName)}`, '_blank');
}

function joinCowboyLobby() {
    if (window.yetiGames) {
        window.yetiGames.joinCowboyLobby();
    }
}

function startQuickMatch() {
    // Update modal to show matchmaking screen
    const modal = document.querySelector('.matchmaking-modal .modal-body');
    
    modal.innerHTML = `
        <div class="matchmaking-screen">
            <h3>🎯 Finding Opponent...</h3>
            <div class="matchmaking-spinner"></div>
            <div class="matchmaking-status">
                <p>Estimated wait time: <span id="wait-time">15</span> seconds</p>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
            </div>
            <button class="cancel-btn" onclick="showMatchmakingModal()">Cancel Search</button>
        </div>
        
        <style>
            .matchmaking-screen {
                text-align: center;
                padding: 30px;
            }
            
            .matchmaking-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(0, 255, 255, 0.3);
                border-top: 4px solid #00FFFF;
                border-radius: 50%;
                margin: 20px auto;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(0, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin: 15px 0;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00FFFF, #FF00FF);
                width: 0%;
                animation: fillProgress 3s ease-in-out forwards;
            }
            
            @keyframes fillProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
            
            .cancel-btn {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 10px 20px;
                border-radius: 20px;
                cursor: pointer;
                margin-top: 20px;
                transition: all 0.3s;
            }
            
            .cancel-btn:hover {
                background: rgba(255, 0, 0, 0.2);
                border-color: rgba(255, 0, 0, 0.5);
            }
        </style>
    `;
    
    // Simulate countdown and matchfinding
    let waitTime = 15;
    const waitElement = document.getElementById('wait-time');
    
    const countdown = setInterval(() => {
        waitTime--;
        if (waitElement) {
            waitElement.textContent = waitTime;
        }
        
        if (waitTime <= 0) {
            clearInterval(countdown);
            showMatchFound();
        }
    }, 1000);
    
    // Store interval for cancellation
    window.matchmakingInterval = countdown;
}
                padding: 40px 20px;
            }
            
            .matchmaking-spinner {
                width: 60px;
                height: 60px;
                border: 4px solid rgba(0, 255, 255, 0.2);
                border-top: 4px solid #00FFFF;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 20px auto;
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background: rgba(0,0,0,0.3);
                border-radius: 10px;
                margin: 15px 0;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00FFFF, #8A2BE2);
                width: 0%;
                border-radius: 10px;
                animation: fillProgress 15s linear forwards;
            }
            
            .cancel-btn {
                background: linear-gradient(145deg, #FF4757, #FF3742);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                margin-top: 20px;
                font-weight: bold;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes fillProgress {
                0% { width: 0%; }
                100% { width: 100%; }
            }
        </style>
    `;
    
    // Simulate finding match
    let waitTime = 15;
    const waitInterval = setInterval(() => {
        waitTime--;
        const waitElement = document.getElementById('wait-time');
        if (waitElement) {
            waitElement.textContent = waitTime;
        }
        
        if (waitTime <= 0) {
            clearInterval(waitInterval);
            showMatchFound();
        }
    }, 1000);
}

function showMatchFound() {
    // Clear any existing matchmaking interval
    if (window.matchmakingInterval) {
        clearInterval(window.matchmakingInterval);
    }
    
    const modal = document.querySelector('.matchmaking-modal .modal-body');
    
    modal.innerHTML = `
        <div class="match-found-screen">
            <h3>✅ OPPONENT FOUND!</h3>
            <div class="vs-display">
                <div class="player-card">
                    <div class="player-avatar">🤠</div>
                    <div class="player-name">You</div>
                    <div class="player-rank">Rank: ${Math.floor(Math.random() * 50) + 1}</div>
                </div>
                <div class="vs-text">VS</div>
                <div class="player-card">
                    <div class="player-avatar">🤠</div>
                    <div class="player-name">Gunslinger_${Math.floor(Math.random() * 999) + 100}</div>
                    <div class="player-rank">Rank: ${Math.floor(Math.random() * 50) + 1}</div>
                </div>
            </div>
            <div class="match-countdown">
                <p>Match starting in: <span id="countdown">10</span></p>
                <div class="countdown-progress">
                    <div class="countdown-fill"></div>
                </div>
            </div>
            <div class="match-actions">
                <button class="ready-btn" onclick="launchCowboyGame()">🎮 READY!</button>
                <button class="decline-btn" onclick="showMatchmakingModal()">❌ DECLINE</button>
            </div>
        </div>
        
        <style>
            .match-found-screen {
                text-align: center;
                padding: 20px;
            }
            
            .match-found-screen h3 {
                color: #00FF80;
                font-size: 1.8rem;
                margin-bottom: 25px;
                text-shadow: 0 0 20px #00FF80;
                animation: pulse 2s infinite;
            }
            
            .vs-display {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 30px;
                margin: 30px 0;
            }
            
            .player-card {
                background: rgba(0, 255, 255, 0.1);
                border: 1px solid rgba(0, 255, 255, 0.3);
                border-radius: 15px;
                padding: 20px;
                min-width: 120px;
            }
            
            .player-avatar {
                font-size: 2.5rem;
                margin-bottom: 10px;
            }
            
            .player-name {
                color: #FFFFFF;
                font-weight: bold;
                margin-bottom: 5px;
            }
            
            .player-rank {
                color: #A8E6FF;
                font-size: 0.9rem;
            }
            
            .vs-text {
                font-size: 2rem;
                font-weight: bold;
                color: #FF00FF;
                text-shadow: 0 0 15px #FF00FF;
                animation: glow 2s ease-in-out infinite alternate;
            }
            
            .match-countdown {
                margin: 25px 0;
            }
            
            .match-countdown p {
                color: #FFFF00;
                font-size: 1.2rem;
                font-weight: bold;
                margin-bottom: 15px;
            }
            
            .countdown-progress {
                width: 200px;
                height: 8px;
                background: rgba(255, 255, 0, 0.2);
                border-radius: 4px;
                margin: 0 auto;
                overflow: hidden;
            }
            
            .countdown-fill {
                height: 100%;
                background: linear-gradient(90deg, #FFFF00, #FF6600);
                width: 100%;
                animation: countdownShrink 10s linear forwards;
            }
            
            @keyframes countdownShrink {
                0% { width: 100%; }
                100% { width: 0%; }
            }
            
            @keyframes glow {
                from { text-shadow: 0 0 15px #FF00FF; }
                to { text-shadow: 0 0 25px #FF00FF, 0 0 35px #FF00FF; }
            }
            
            .match-actions {
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 30px;
            }
            
            .ready-btn, .decline-btn {
                padding: 15px 30px;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                font-size: 1.1rem;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .ready-btn {
                background: linear-gradient(145deg, #00FF80, #00CC66);
                color: white;
                box-shadow: 0 5px 20px rgba(0, 255, 128, 0.4);
            }
            
            .ready-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 30px rgba(0, 255, 128, 0.6);
            }
            
            .decline-btn {
                background: rgba(255, 0, 0, 0.2);
                color: white;
                border: 1px solid rgba(255, 0, 0, 0.5);
            }
            
            .decline-btn:hover {
                background: rgba(255, 0, 0, 0.4);
                transform: translateY(-2px);
            }
        </style>
    `;
    
    // Start countdown
    let countdown = 10;
    const countdownElement = document.getElementById('countdown');
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            // Auto-launch game when countdown reaches 0
            launchCowboyGame();
        }
    }, 1000);
}
        </div>
        
        <style>
            .match-found-screen {
                text-align: center;
                padding: 30px 20px;
            }
            
            .vs-display {
                display: flex;
                justify-content: space-around;
                align-items: center;
                margin: 30px 0;
                padding: 20px;
                background: rgba(0,0,0,0.2);
                border-radius: 15px;
            }
            
            .player-card {
                text-align: center;
            }
            
            .player-avatar {
                font-size: 3rem;
                margin-bottom: 10px;
            }
            
            .player-name {
                font-weight: bold;
                color: #00FFFF;
                margin-bottom: 5px;
            }
            
            .player-rank {
                font-size: 0.9rem;
                color: #A8E6FF;
            }
            
            .vs-text {
                font-size: 2rem;
                font-weight: bold;
                color: #FF6B6B;
                text-shadow: 0 0 10px #FF6B6B;
            }
            
            .match-countdown {
                margin: 25px 0;
                font-size: 1.2rem;
                color: #FFD700;
            }
            
            .ready-btn, .decline-btn {
                margin: 10px;
                padding: 15px 30px;
                border: none;
                border-radius: 25px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .ready-btn {
                background: linear-gradient(145deg, #00FF80, #00CC66);
                color: white;
            }
            
            .decline-btn {
                background: linear-gradient(145deg, #FF4757, #FF3742);
                color: white;
            }
        </style>
    `;
    
    // Countdown timer
    let countdown = 10;
    const countInterval = setInterval(() => {
        countdown--;
        const countElement = document.getElementById('countdown');
        if (countElement) {
            countElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
            clearInterval(countInterval);
            launchCowboyGame();
        }
    }, 1000);
}

function createRoom() {
    alert('🏗️ Create Room\n\nThis feature would allow you to:\n• Set room name and password\n• Choose game mode and settings\n• Invite specific players\n• Customize match rules\n\nComing in the full implementation!');
}

function joinRoom() {
    alert('🚪 Join Room\n\nThis feature would show:\n• Available public rooms\n• Room browser with filters\n• Password-protected rooms\n• Room details and player count\n\nComing in the full implementation!');
}

function cancelMatchmaking() {
    // Clear any matchmaking intervals
    if (window.matchmakingInterval) {
        clearInterval(window.matchmakingInterval);
        window.matchmakingInterval = null;
    }
    
    // Remove the matchmaking modal
    const modal = document.querySelector('.matchmaking-modal');
    if (modal) {
        modal.remove();
    }
}

function declineMatch() {
    cancelMatchmaking();
}

function launchCowboyGame() {
    // Close the lobby modal first
    cancelMatchmaking();
    
    // Open the Cowboy Shootout game in a new tab on same server
    window.open('/cowboy-game/', '_blank');
    
    // Keep the server connection logic for lobby updates
    if (!window.yetiGames || !window.yetiGames.isConnected) {
        // Server not available, show instructions to start it
        const modal = document.createElement('div');
        modal.className = 'server-info-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🤠 Start Cowboy Shootout Server</h2>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="server-instructions">
                        <h3>📋 To play Cowboy Shootout:</h3>
                        <ol>
                            <li>Open terminal in the <code>cowboy-shootout</code> folder</li>
                            <li>Run: <code>npm install</code> (first time only)</li>
                            <li>Run: <code>node server.js</code></li>
                            <li>Open: <code>http://localhost:3000</code></li>
                        </ol>
                        
                        <div class="server-status">
                            <span class="status-indicator offline"></span>
                            <span>Game server offline</span>
                        </div>
                        
                        <div class="direct-link">
                            <p>Or try the direct link:</p>
                            <a href="/cowboy-shootout/public/" target="_blank" class="direct-link-btn">
                                🎮 Open Game (If Server Running)
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>
                .server-info-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.9);
                    backdrop-filter: blur(10px);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: modalFadeIn 0.3s ease;
                }
                
                .server-instructions {
                    text-align: left;
                }
                
                .server-instructions ol {
                    background: rgba(0,0,0,0.3);
                    padding: 20px;
                    border-radius: 10px;
                    border-left: 4px solid #00FFFF;
                    margin: 20px 0;
                }
                
                .server-instructions li {
                    margin: 10px 0;
                    color: #A8E6FF;
                    font-size: 1rem;
                }
                
                .server-instructions code {
                    background: #1A2A6C;
                    color: #00FFFF;
                    padding: 4px 8px;
                    border-radius: 5px;
                    font-family: monospace;
                    font-weight: bold;
                }
                
                .server-status {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 20px 0;
                    padding: 10px;
                    background: rgba(255, 0, 0, 0.1);
                    border-radius: 10px;
                    border: 1px solid rgba(255, 0, 0, 0.3);
                }
                
                .status-indicator.offline {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: #FF4757;
                    box-shadow: 0 0 10px #FF4757;
                    animation: pulse 2s infinite;
                }
                
                .direct-link {
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(0, 255, 255, 0.3);
                }
                
                .direct-link-btn {
                    display: inline-block;
                    background: linear-gradient(145deg, #00FF80, #00CC66);
                    color: white;
                    text-decoration: none;
                    padding: 12px 25px;
                    border-radius: 25px;
                    font-weight: bold;
                    transition: all 0.3s;
                    margin-top: 10px;
                }
                
                .direct-link-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(0, 255, 128, 0.4);
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        // Close functionality
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeBtn.click();
        });
    }
}

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