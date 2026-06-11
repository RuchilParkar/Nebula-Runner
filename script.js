/**
 * Neptune Runner - 2D Endless Runner Game Engine
 * Written in Object-Oriented ES6 JavaScript (Canvas API & Web Audio API)
 */

// ============================================================================
// 1. PSEUDO-RANDOM NUMBER GENERATOR (Seeded for Daily Challenges)
// ============================================================================
class PRNG {
  constructor(seed = 12345) {
    this.seed = seed;
  }

  // Mulberry32 generator
  next() {
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  // Range helper
  range(min, max) {
    return min + this.next() * (max - min);
  }

  // Choice helper
  choice(array) {
    const idx = Math.floor(this.next() * array.length);
    return array[idx];
  }
}

// ============================================================================
// 2. AUDIO SYNTHESIZER (Web Audio API - Procedural Sounds)
// ============================================================================
class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.muted = false;
    this.volume = 0.8; // 0.0 to 1.0

    // Music playback state
    this.musicInterval = null;
    this.musicTempo = 135; // BPM
    this.musicBeat = 0;
    this.musicPlaying = false;
    this.musicNodes = []; // Track active nodes to stop them instantly

    // Melody and Bass note frequencies
    // Am, F, C, G progression
    this.bassProgression = [
      [55.00, 55.00, 55.00, 55.00], // A1
      [43.65, 43.65, 43.65, 43.65], // F1
      [65.41, 65.41, 65.41, 65.41], // C2
      [49.00, 49.00, 49.00, 49.00]  // G1
    ];
    this.melodyProgression = [
      [220.00, 261.63, 329.63, 392.00, 440.00, 329.63, 261.63, 220.00], // A minor
      [174.61, 220.00, 261.63, 349.23, 261.63, 220.00, 174.61, 220.00], // F major
      [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 329.63], // C major
      [196.00, 246.94, 293.66, 392.00, 293.66, 246.94, 196.00, 293.66]  // G major
    ];
  }

  // Initialize context on user interaction
  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.init();
    if (this.masterGain && !this.muted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
  }

  setMute(isMuted) {
    this.muted = isMuted;
    this.init();
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
  }

  // --- Sound Effects Synthesis ---

  // Jump (Frequency rising sweep)
  playJump() {
    this.init();
    if (!this.ctx || this.muted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Double Jump (Higher pitch shift)
  playDoubleJump() {
    this.init();
    if (!this.ctx || this.muted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Slide (Low sound sweep)
  playSlide() {
    this.init();
    if (!this.ctx || this.muted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, this.ctx.currentTime + 0.3);

    // Filter to make slide sound smoother
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // Land (Low thud sound on landing)
  playLand() {
    this.init();
    if (!this.ctx || this.muted) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Coin Chime (Two quick high pitches)
  playCoin() {
    this.init();
    if (!this.ctx || this.muted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.22);
  }

  // Gem Chime (Ascending arpeggio)
  playGem() {
    this.init();
    if (!this.ctx || this.muted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1046.50, now); // C6
    osc.frequency.setValueAtTime(1318.51, now + 0.05); // E6
    osc.frequency.setValueAtTime(1567.98, now + 0.1); // G6
    osc.frequency.setValueAtTime(2093.00, now + 0.15); // C7

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.35);
  }

  // Power Up sweep
  playPowerUp() {
    this.init();
    if (!this.ctx || this.muted) return;

    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.45);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(225, now);
    osc2.frequency.exponentialRampToValueAtTime(890, now + 0.45);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start();
    osc2.start();
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  }

  // Hit sound (Explosive low decay)
  playHit() {
    this.init();
    if (!this.ctx || this.muted) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.linearRampToValueAtTime(50, now + 0.4);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(now + 0.4);
  }

  // --- Background Music Scheduler ---

  startMusic() {
    this.init();
    if (!this.ctx || this.musicPlaying) return;

    this.musicPlaying = true;
    this.musicBeat = 0;

    const beatDuration = 60 / this.musicTempo / 2; // Eighth notes
    
    const tick = () => {
      if (!this.musicPlaying) return;
      this.playMusicStep();
      this.musicBeat = (this.musicBeat + 1) % 32;
      this.musicInterval = setTimeout(tick, beatDuration * 1000);
    };

    tick();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
    // Instantly kill active note nodes
    this.musicNodes.forEach(node => {
      try { node.stop(); } catch (e) {}
    });
    this.musicNodes = [];
  }

  playMusicStep() {
    if (this.muted || !this.ctx) return;

    const now = this.ctx.currentTime;
    const measure = Math.floor(this.musicBeat / 8); // 4 measures
    const step = this.musicBeat % 8; // 8 beats per measure

    // Bassline (Plays on beats 0, 2, 4, 6)
    if (step % 2 === 0) {
      const bassFreq = this.bassProgression[measure][step / 2];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(bassFreq, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(now + 0.25);
      this.musicNodes.push(osc);
    }

    // Melody arpeggiator (Plays syncopated steps)
    if (step % 2 !== 0 || step === 0) {
      const melodyFreq = this.melodyProgression[measure][step];
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(melodyFreq, now);

      // Low volume back-ground sweep
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(now + 0.18);
      this.musicNodes.push(osc);
    }

    // Clean up dead nodes array
    if (this.musicNodes.length > 20) {
      this.musicNodes = this.musicNodes.slice(-10);
    }
  }
}

// ============================================================================
// 3. INPUT HANDLER (Keyboard & Touch Gestures)
// ============================================================================
class InputHandler {
  constructor(game) {
    this.game = game;
    
    // Controls triggers
    this.keys = {};
    
    // Swipe detection
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchThreshold = 40; // Pixels
    this.lastTapTime = 0;
    this.tapDelay = 250; // ms for double tap

    this.initListeners();
  }

  initListeners() {
    // Keyboard events
    window.addEventListener('keydown', (e) => {
      // Prevent browser default scroll behaviors for control keys
      if (['Space', 'ArrowUp', 'ArrowDown', ' '].includes(e.key) || e.keyCode === 32) {
        e.preventDefault();
      }

      const key = e.key.toLowerCase();
      if (!this.keys[key]) {
        this.keys[key] = true;
        this.handlePress(key);
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;
      this.handleRelease(key);
    });

    // Touch events
    const canvas = document.getElementById('gameCanvas');
    
    canvas.addEventListener('touchstart', (e) => {
      if (this.game.state !== 'RUNNING') return;
      e.preventDefault();
      
      const touch = e.changedTouches[0];
      this.touchStartX = touch.pageX;
      this.touchStartY = touch.pageY;
      
      // Tap & Double Tap logic
      const now = performance.now();
      const timeDiff = now - this.lastTapTime;
      
      if (timeDiff < this.tapDelay) {
        this.game.player.jump(true); // Double jump force
      } else {
        this.game.player.jump(false); // Single jump
      }
      this.lastTapTime = now;
    }, { passive: false });

    canvas.addEventListener('touchend', (e) => {
      if (this.game.state !== 'RUNNING') return;
      e.preventDefault();
      
      const touch = e.changedTouches[0];
      const diffX = touch.pageX - this.touchStartX;
      const diffY = touch.pageY - this.touchStartY;

      // Downward swipe detection
      if (diffY > this.touchThreshold && Math.abs(diffY) > Math.abs(diffX)) {
        this.game.player.slide();
      }
    }, { passive: false });
  }

  handlePress(key) {
    if (this.game.state !== 'RUNNING') return;

    if (key === ' ' || key === 'arrowup') {
      this.game.player.jump();
    }
    if (key === 'arrowdown') {
      this.game.player.slide();
    }
  }

  handleRelease(key) {
    if (this.game.state !== 'RUNNING') return;
    
    if (key === 'arrowdown') {
      this.game.player.stopSlide();
    }
  }
}

// ============================================================================
// 4. PARTICLE EFFECTS SYSTEM
// ============================================================================
class Particle {
  constructor(x, y, vx, vy, size, color, life, type = 'spark') {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.color = color;
    this.maxLife = life;
    this.life = life;
    this.type = type; // 'spark', 'dust', 'snow', 'rain', 'neon'
    this.alpha = 1;
  }

  update(dt, speedMultiplier) {
    this.life -= dt;
    this.alpha = Math.max(0, this.life / this.maxLife);

    if (this.type === 'rain') {
      this.x += this.vx;
      this.y += this.vy;
    } else if (this.type === 'snow') {
      this.x += this.vx + Math.sin(this.life * 5) * 0.5;
      this.y += this.vy;
    } else if (this.type === 'neon') {
      this.y += this.vy;
    } else {
      // Physics for gameplay particle sparks/dust
      this.x += this.vx;
      this.y += this.vy;
      // Gravity for sparks
      if (this.type === 'spark') {
        this.vy += 0.2;
      }
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    
    if (this.type === 'rain') {
      ctx.strokeStyle = this.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.vx * 1.5, this.y + this.vy * 1.5);
      ctx.stroke();
    } else if (this.type === 'neon') {
      ctx.fillStyle = this.color;
      ctx.fillRect(this.x, this.y, this.size, this.size * 4);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  }
}

class ParticleSystem {
  constructor(game) {
    this.game = game;
    this.particles = [];
  }

  update(dt) {
    const speedMult = this.game.speedMultiplier;
    
    // Update and filter expired particles
    this.particles = this.particles.filter(p => {
      p.update(dt, speedMult);
      return p.life > 0;
    });

    // Cap maximum particles to prevent memory exhaustion and lag crashes
    if (this.particles.length > 800) {
      this.particles = this.particles.slice(-800);
    }
  }

  draw(ctx) {
    for (const p of this.particles) {
      p.draw(ctx);
    }
  }

  clear() {
    this.particles = [];
  }

  // Effect generators
  
  // Jump dust
  spawnJumpDust(x, y) {
    const count = 10;
    const color = this.game.themeColors.dust || 'rgba(255, 255, 255, 0.4)';
    for (let i = 0; i < count; i++) {
      const vx = -2 - Math.random() * 3;
      const vy = -0.5 - Math.random() * 1.5;
      const size = 3 + Math.random() * 5;
      const life = 0.3 + Math.random() * 0.3;
      this.particles.push(new Particle(x, y, vx, vy, size, color, life, 'dust'));
    }
  }

  // Landing sparks
  spawnLandingSparks(x, y) {
    const count = 12;
    const color = this.game.themeColors.secondary;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI - Math.PI; // upward half circle
      const speed = 2 + Math.random() * 4;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 2 + Math.random() * 3;
      const life = 0.4 + Math.random() * 0.3;
      this.particles.push(new Particle(x, y, vx, vy, size, color, life, 'spark'));
    }
  }

  // Coin collect sparkles
  spawnCoinCollect(x, y, isGem = false) {
    const count = 15;
    const color = isGem ? '#a855f7' : '#f59e0b';
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 2 + Math.random() * 3;
      const life = 0.3 + Math.random() * 0.4;
      this.particles.push(new Particle(x, y, vx, vy, size, color, life, 'spark'));
    }
  }

  // Collision explosion
  spawnHitExplosion(x, y) {
    const count = 25;
    const colors = [this.game.themeColors.primary, this.game.themeColors.secondary, '#ffffff'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 6;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const size = 3 + Math.random() * 5;
      const life = 0.6 + Math.random() * 0.5;
      const col = colors[Math.floor(Math.random() * colors.length)];
      this.particles.push(new Particle(x, y, vx, vy, size, col, life, 'spark'));
    }
  }

  // Weather effects
  spawnWeather(width, height, type) {
    if (type === 'none') return;
    
    if (type === 'rain') {
      const spawnRate = 2;
      for (let i = 0; i < spawnRate; i++) {
        const x = Math.random() * width;
        const y = -10;
        const vx = -2 - Math.random() * 2;
        const vy = 10 + Math.random() * 5;
        const size = 1;
        const life = 2.0;
        this.particles.push(new Particle(x, y, vx, vy, size, 'rgba(156, 163, 175, 0.4)', life, 'rain'));
      }
    } else if (type === 'snow') {
      const spawnRate = 1;
      if (Math.random() < 0.4) {
        const x = Math.random() * width;
        const y = -10;
        const vx = -0.5 - Math.random() * 1;
        const vy = 1.5 + Math.random() * 2;
        const size = 2 + Math.random() * 3;
        const life = 6.0;
        this.particles.push(new Particle(x, y, vx, vy, size, 'rgba(255, 255, 255, 0.8)', life, 'snow'));
      }
    } else if (type === 'cyberpunk') {
      // Neon streams
      if (Math.random() < 0.3) {
        const x = Math.random() * width;
        const y = -10;
        const vx = 0;
        const vy = 12 + Math.random() * 6;
        const size = 1 + Math.random() * 2;
        const life = 2.0;
        const colors = ['rgba(236, 72, 153, 0.3)', 'rgba(6, 182, 212, 0.3)', 'rgba(168, 85, 247, 0.3)'];
        const col = colors[Math.floor(Math.random() * colors.length)];
        this.particles.push(new Particle(x, y, vx, vy, size, col, life, 'neon'));
      }
    }
  }
}

// ============================================================================
// 5. PLAYER CHARACTER
// ============================================================================
class Player {
  constructor(game) {
    this.game = game;
    
    // Geometry (Relative to 1280x720 layout)
    this.x = 150;
    this.width = 54;
    this.height = 80;
    this.groundY = 560 - this.height; // Base ground height (feet at 560)
    this.y = this.groundY;
    
    // Physics
    this.vy = 0;
    this.gravity = 1.15;
    this.jumpForce = -21;
    this.doubleJumpForce = -17.5;
    
    // State machine
    this.isGrounded = true;
    this.isSliding = false;
    this.doubleJumpAvailable = true;
    this.state = 'RUNNING'; // 'RUNNING', 'JUMPING', 'SLIDING', 'CRASHED'
    
    // Animation timers
    this.animTime = 0;
    this.slideDuration = 0.55; // Seconds
    this.slideTimer = 0;
    this.slideHeight = 44;

    // Power-up visual indicators
    this.shieldAngle = 0;
    this.boostAngle = 0;
  }

  reset() {
    this.y = this.groundY;
    this.vy = 0;
    this.isGrounded = true;
    this.isSliding = false;
    this.doubleJumpAvailable = true;
    this.state = 'RUNNING';
    this.animTime = 0;
    this.slideTimer = 0;
  }

  jump(forceDouble = false) {
    if (this.state === 'CRASHED') return;

    if (this.isGrounded && !forceDouble) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.doubleJumpAvailable = true;
      this.state = 'JUMPING';
      this.game.soundManager.playJump();
      this.game.particleSystem.spawnJumpDust(this.x + this.width / 2, this.groundY + this.height);
      this.game.statsManager.addStat('jumps', 1);
    } else if (this.doubleJumpAvailable || forceDouble) {
      this.vy = this.doubleJumpForce;
      this.doubleJumpAvailable = false;
      this.state = 'JUMPING';
      this.game.soundManager.playDoubleJump();
      this.game.particleSystem.spawnLandingSparks(this.x + this.width / 2, this.y + this.height);
      this.game.statsManager.addStat('jumps', 1);
    }
  }

  slide() {
    if (this.state === 'CRASHED' || !this.isGrounded || this.isSliding) return;
    
    this.isSliding = true;
    this.state = 'SLIDING';
    this.slideTimer = this.slideDuration;
    this.game.soundManager.playSlide();
    this.game.statsManager.addStat('slides', 1);
  }

  stopSlide() {
    if (this.isSliding) {
      this.isSliding = false;
      this.state = 'RUNNING';
      this.slideTimer = 0;
    }
  }

  getCollider() {
    const currentHeight = this.isSliding ? this.slideHeight : this.height;
    const yOffset = this.isSliding ? (this.height - this.slideHeight) : 0;
    return {
      x: this.x + 8,
      y: this.y + yOffset + 4,
      width: this.width - 16,
      height: currentHeight - 8
    };
  }

  update(dt) {
    if (this.state === 'CRASHED') return;

    this.animTime += dt * this.game.speedMultiplier;

    // Apply gravity
    if (!this.isGrounded) {
      this.vy += this.gravity;
      this.y += this.vy;
      
      // Check landing boundary
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.vy = 0;
        this.isGrounded = true;
        this.doubleJumpAvailable = true;
        if (!this.isSliding) {
          this.state = 'RUNNING';
        }
        this.game.soundManager.playLand();
        this.game.particleSystem.spawnLandingSparks(this.x + this.width / 2, this.groundY + this.height);
      }
    }

    // Handle Slide duration decrement
    if (this.isSliding) {
      this.slideTimer -= dt;
      // Emit slide friction particles
      if (Math.random() < 0.35) {
        this.game.particleSystem.particles.push(new Particle(
          this.x + Math.random() * this.width,
          this.groundY + this.height,
          -5 - Math.random() * 5,
          -Math.random() * 2,
          1 + Math.random() * 2,
          this.game.themeColors.secondary,
          0.3 + Math.random() * 0.2,
          'spark'
        ));
      }
      if (this.slideTimer <= 0) {
        this.stopSlide();
      }
    }

    // Magnet and Shield rotators
    this.shieldAngle = (this.shieldAngle + 0.05) % (Math.PI * 2);
    this.boostAngle = (this.boostAngle + 0.1) % (Math.PI * 2);
  }

  draw(ctx) {
    const equippedSkin = this.game.statsManager.equippedSkin;
    const bodyHeight = this.isSliding ? this.slideHeight : this.height;
    const drawY = this.y + (this.isSliding ? (this.height - this.slideHeight) : 0);

    ctx.save();
    
    // Glow effects
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.game.themeColors.secondary;

    // Draw Character according to skin choice
    switch (equippedSkin) {
      case 'cyber_ninja':
        this.drawCyberNinja(ctx, this.x, drawY, this.width, bodyHeight);
        break;
      case 'robo':
        this.drawNeonRobo(ctx, this.x, drawY, this.width, bodyHeight);
        break;
      case 'solar_raider':
        this.drawSolarRaider(ctx, this.x, drawY, this.width, bodyHeight);
        break;
      case 'astronaut':
      default:
        this.drawAstronaut(ctx, this.x, drawY, this.width, bodyHeight);
        break;
    }

    // --- Power-up Overlays ---
    
    // 1. Shield Bubble
    if (this.game.activePowerups.shield) {
      ctx.shadowColor = '#06b6d4';
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const radius = Math.max(this.width, this.height) / 1.3;
      ctx.arc(this.x + this.width / 2, drawY + bodyHeight / 2, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Glowing pulse pattern inside shield
      ctx.fillStyle = 'rgba(6, 182, 212, 0.08)';
      ctx.fill();

      // Rotating shield shards
      ctx.fillStyle = 'rgba(6, 182, 212, 0.6)';
      for (let i = 0; i < 3; i++) {
        const angle = this.shieldAngle + (i * Math.PI * 2 / 3);
        const sx = this.x + this.width / 2 + Math.cos(angle) * radius;
        const sy = drawY + bodyHeight / 2 + Math.sin(angle) * radius;
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 2. Speed Boost Wind lines
    if (this.game.activePowerups.speed) {
      ctx.shadowColor = '#10b981';
      ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
      for (let i = 0; i < 4; i++) {
        const offset = (this.boostAngle * 20 + i * 25) % 80;
        ctx.fillRect(this.x - 30 + offset, drawY + (i * bodyHeight / 4), 10, 2);
      }
    }

    // 3. Coin Magnet halo
    if (this.game.activePowerups.magnet) {
      ctx.strokeStyle = 'rgba(236, 72, 153, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const magnetRadius = 150; // Capture pull field indicator (scaled)
      ctx.arc(this.x + this.width / 2, drawY + bodyHeight / 2, 80 + Math.sin(this.shieldAngle * 4) * 8, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  // Visual Skin Renders

  // Skin 1: Standard Astronaut
  drawAstronaut(ctx, x, y, w, h) {
    // Body / Suit
    ctx.fillStyle = '#f8fafc'; // Space white
    this.drawRoundedRect(ctx, x + 8, y + 15, w - 16, h - 25, 12);
    ctx.fill();

    // Chest plate console
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 16, y + 35, w - 32, 14);
    ctx.fillStyle = '#06b6d4'; // Glowing dots
    ctx.fillRect(x + 20, y + 39, 4, 4);
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(x + 28, y + 39, 4, 4);

    // Oxygen Backpack
    ctx.fillStyle = '#cbd5e1';
    this.drawRoundedRect(ctx, x - 2, y + 25, 10, h - 45, 4);
    ctx.fill();

    // Helmet
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 18, 18, 0, Math.PI * 2);
    ctx.fill();

    // Dark Visor
    ctx.fillStyle = '#1e293b'; // Visor outline
    ctx.beginPath();
    ctx.arc(x + w / 2 + 3, y + 16, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#38bdf8'; // Sky blue glass
    ctx.beginPath();
    ctx.arc(x + w / 2 + 4, y + 15, 9, 0, Math.PI * 2);
    ctx.fill();

    // Legs animation details
    this.drawRunningLegs(ctx, x, y, w, h, '#e2e8f0');
  }

  // Skin 2: Cyber Ninja
  drawCyberNinja(ctx, x, y, w, h) {
    // Suit (Black/dark violet carbon)
    ctx.fillStyle = '#1e1b4b'; 
    this.drawRoundedRect(ctx, x + 10, y + 15, w - 20, h - 25, 8);
    ctx.fill();
    
    // Armor panels
    ctx.fillStyle = '#312e81';
    ctx.fillRect(x + 14, y + 28, w - 28, 20);

    // Glowing Neon Sash
    ctx.fillStyle = '#ec4899'; // Hot pink neon sash
    ctx.fillRect(x + 10, y + 38, w - 20, 4);

    // Mask / Head
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 16, 15, 0, Math.PI * 2);
    ctx.fill();

    // Visor / Eyes
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(x + w / 2 - 8, y + 12, 16, 4);

    this.drawRunningLegs(ctx, x, y, w, h, '#1e1b4b');
  }

  // Skin 3: Neon Robo
  drawNeonRobo(ctx, x, y, w, h) {
    // Metal Plates
    ctx.fillStyle = '#64748b';
    this.drawRoundedRect(ctx, x + 8, y + 18, w - 16, h - 28, 6);
    ctx.fill();

    // Neon heart core
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 36, 6, 0, Math.PI * 2);
    ctx.fill();

    // Robotic square head
    ctx.fillStyle = '#475569';
    this.drawRoundedRect(ctx, x + w / 2 - 15, y + 2, 30, 22, 4);
    ctx.fill();

    // Cyclops scanning laser eye
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(x + w / 2 - 10, y + 9, 20, 5);

    // Antenna
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y + 2);
    ctx.lineTo(x + w / 2, y - 8);
    ctx.stroke();
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    ctx.arc(x + w / 2, y - 8, 3, 0, Math.PI * 2);
    ctx.fill();

    this.drawRunningLegs(ctx, x, y, w, h, '#475569');
  }

  // Skin 4: Solar Raider
  drawSolarRaider(ctx, x, y, w, h) {
    // Hazard Orange Suit
    ctx.fillStyle = '#ea580c';
    this.drawRoundedRect(ctx, x + 8, y + 15, w - 16, h - 25, 10);
    ctx.fill();

    // Golden shoulder pads & details
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x + 5, y + 20, 8, 10);
    ctx.fillRect(x + w - 13, y + 20, 8, 10);

    // Dark grey chest rig
    ctx.fillStyle = '#374151';
    ctx.fillRect(x + 14, y + 30, w - 28, 15);

    // Solar Helmet
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.arc(x + w / 2, y + 16, 16, 0, Math.PI * 2);
    ctx.fill();

    // Gold glass visor
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(x + w / 2 + 2, y + 14, 11, 0, Math.PI * 2);
    ctx.fill();

    this.drawRunningLegs(ctx, x, y, w, h, '#ea580c');
  }

  // Rounded rect helper
  drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  // Running Legs Procedural Animation
  drawRunningLegs(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    
    // Leg cycle angles
    const speed = 15;
    const cycle = this.animTime * speed;
    
    let leftOffset = Math.sin(cycle) * 12;
    let rightOffset = -Math.sin(cycle) * 12;

    if (this.state === 'JUMPING') {
      // In air: legs bent in floating shape
      leftOffset = -8;
      rightOffset = 8;
    } else if (this.state === 'SLIDING') {
      // Sliding: legs tucked in/behind
      ctx.fillRect(x - 5, y + h - 14, 15, 8);
      return;
    }

    // Left leg
    ctx.fillRect(x + 14, y + h - 14 + (leftOffset > 0 ? 0 : leftOffset), 8, 14 - (leftOffset > 0 ? leftOffset : 0));
    // Right leg
    ctx.fillRect(x + w - 22, y + h - 14 + (rightOffset > 0 ? 0 : rightOffset), 8, 14 - (rightOffset > 0 ? rightOffset : 0));
  }
}

// ============================================================================
// 6. PROCEDURAL ENVIRONMENT & PARALLAX BACKGROUND
// ============================================================================
class Layer {
  constructor(game, y, height, speedFactor, drawCallback) {
    this.game = game;
    this.y = y;
    this.height = height;
    this.speedFactor = speedFactor;
    this.drawCallback = drawCallback;
    this.xOffset = 0;
  }

  update(dt, scrollSpeed) {
    // Calculate movement offset based on game speed and layer specific speed factor
    this.xOffset = (this.xOffset - scrollSpeed * this.speedFactor * dt * 60) % 1280;
  }

  draw(ctx) {
    ctx.save();
    // Translate and draw twice for seamless loop
    ctx.translate(this.xOffset, 0);
    this.drawCallback(ctx, 0, this.y, 1280, this.height);
    this.drawCallback(ctx, 1280, this.y, 1280, this.height);
    ctx.restore();
  }
}

class Background {
  constructor(game) {
    this.game = game;
    
    // Day/Night Cycle State
    this.cycleTime = 0;
    this.cycleDuration = 90; // Seconds for full Day -> Night -> Day
    this.ambientLight = 1.0; // 0.2 (night) to 1.0 (day)
    
    this.stars = [];
    this.clouds = [];
    this.generateStars();
    this.generateClouds();

    // Create the parallax background layers
    this.layers = [];
    this.initLayers();
  }

  generateStars() {
    this.stars = [];
    for (let i = 0; i < 60; i++) {
      this.stars.push({
        x: Math.random() * 1280,
        y: Math.random() * 300,
        size: 0.5 + Math.random() * 1.5,
        twinkle: Math.random()
      });
    }
  }

  generateClouds() {
    this.clouds = [];
    for (let i = 0; i < 8; i++) {
      this.clouds.push({
        x: Math.random() * 1280,
        y: 30 + Math.random() * 120,
        width: 100 + Math.random() * 120,
        height: 30 + Math.random() * 20,
        speed: 0.1 + Math.random() * 0.25
      });
    }
  }

  initLayers() {
    // Layer 1: Far Silhouette (skyscrapers or tall mountains)
    this.layers.push(new Layer(this.game, 250, 310, 0.08, (ctx, x, y, w, h) => {
      ctx.fillStyle = this.game.themeColors.farBG;
      ctx.beginPath();
      
      // Draw procedural mountain range
      ctx.moveTo(x, y + h);
      
      // Seed-based procedural outline for far mountains
      const points = [
        [0, 150], [180, 50], [350, 180], [520, 30], 
        [700, 160], [880, 70], [1050, 200], [1280, 110]
      ];
      ctx.lineTo(x + points[0][0], y + points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(x + points[i][0], y + points[i][1]);
      }
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fill();
    }));

    // Layer 2: Mid Silhouette (closer hills or city elements)
    this.layers.push(new Layer(this.game, 320, 240, 0.2, (ctx, x, y, w, h) => {
      ctx.fillStyle = this.game.themeColors.midBG;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      
      // Seed-based procedural outline for mid mountains/hills
      const points = [
        [0, 140], [120, 80], [260, 150], [420, 60], 
        [600, 160], [780, 90], [980, 170], [1150, 80], [1280, 130]
      ];
      ctx.lineTo(x + points[0][0], y + points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(x + points[i][0], y + points[i][1]);
      }
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fill();
    }));

    // Layer 3: Closer details (Deco tree outlines or lower ridges)
    this.layers.push(new Layer(this.game, 420, 140, 0.45, (ctx, x, y, w, h) => {
      ctx.fillStyle = this.game.themeColors.nearBG;
      ctx.beginPath();
      ctx.moveTo(x, y + h);
      
      const points = [
        [0, 90], [150, 60], [300, 110], [500, 50], 
        [720, 100], [900, 70], [1080, 110], [1280, 80]
      ];
      ctx.lineTo(x + points[0][0], y + points[0][1]);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(x + points[i][0], y + points[i][1]);
      }
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      ctx.fill();
      
      // Draw silhouettes of trees/objects along the ridge
      ctx.fillStyle = this.game.themeColors.nearBG;
      if (this.game.currentTheme === 'forest') {
        // Pine trees
        for (let tx = 80; tx < w; tx += 200) {
          this.drawTreeSilhouette(ctx, x + tx, y + 90);
        }
      } else if (this.game.currentTheme === 'desert') {
        // Cacti
        for (let cx = 150; cx < w; cx += 250) {
          this.drawCactusSilhouette(ctx, x + cx, y + 100);
        }
      } else if (this.game.currentTheme === 'cyberpunk') {
        // Glowing street lamps / antenna beams
        ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
        for (let ax = 120; ax < w; ax += 300) {
          ctx.fillRect(x + ax, y + 70, 2, 40);
          ctx.beginPath();
          ctx.arc(x + ax + 1, y + 70, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }));
  }

  drawTreeSilhouette(ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 12, y + 30);
    ctx.lineTo(x - 5, y + 30);
    ctx.lineTo(x - 18, y + 55);
    ctx.lineTo(x - 8, y + 55);
    ctx.lineTo(x - 22, y + 80);
    ctx.lineTo(x + 22, y + 80);
    ctx.lineTo(x + 8, y + 55);
    ctx.lineTo(x + 18, y + 55);
    ctx.lineTo(x + 5, y + 30);
    ctx.lineTo(x + 12, y + 30);
    ctx.closePath();
    ctx.fill();
  }

  drawCactusSilhouette(ctx, x, y) {
    ctx.fillRect(x - 3, y, 6, 40); // main stem
    ctx.fillRect(x - 14, y + 12, 11, 4); // left branch arm
    ctx.fillRect(x - 14, y + 4, 4, 8); // left branch tip
    ctx.fillRect(x + 3, y + 18, 12, 4); // right branch arm
    ctx.fillRect(x + 11, y + 10, 4, 8); // right branch tip
  }

  update(dt, scrollSpeed) {
    // Day/Night progression
    this.cycleTime = (this.cycleTime + dt) % this.cycleDuration;
    const progress = this.cycleTime / this.cycleDuration;

    // Ambient light maps (day -> sunset -> night -> sunrise -> day)
    // Night occupies progress 0.4 to 0.75
    if (progress < 0.25) { // Sunrise -> Day
      this.ambientLight = 0.3 + (progress / 0.25) * 0.7;
    } else if (progress >= 0.25 && progress < 0.5) { // Day -> Sunset
      this.ambientLight = 1.0 - ((progress - 0.25) / 0.25) * 0.6;
    } else if (progress >= 0.5 && progress < 0.8) { // Sunset -> Night
      this.ambientLight = 0.4 - ((progress - 0.5) / 0.3) * 0.2; // Floor to 0.2
    } else { // Night -> Sunrise
      this.ambientLight = 0.2 + ((progress - 0.8) / 0.2) * 0.1;
    }

    // Stars twinkle and scroll
    for (const star of this.stars) {
      star.twinkle = (star.twinkle + dt * 1.5) % 1;
      star.x = (star.x - scrollSpeed * 0.02 * dt * 60) % 1280;
      if (star.x < 0) star.x += 1280;
    }

    // Clouds scroll
    for (const cloud of this.clouds) {
      cloud.x -= cloud.speed * dt * 60;
      if (cloud.x + cloud.width < 0) {
        cloud.x = 1280 + cloud.width;
        cloud.y = 30 + Math.random() * 120;
      }
    }

    // Update parallax layers
    for (const layer of this.layers) {
      layer.update(dt, scrollSpeed);
    }
  }

  drawSky(ctx, width, height) {
    const progress = this.cycleTime / this.cycleDuration;
    
    // Create sky color gradient depending on time of day cycle
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    
    if (progress < 0.25) {
      // Sunrise transition
      const factor = progress / 0.25;
      skyGrad.addColorStop(0, this.blendColors('#020617', '#1e293b', factor));
      skyGrad.addColorStop(0.5, this.blendColors('#3b0764', '#0f172a', factor));
      skyGrad.addColorStop(1, this.blendColors('#db2777', '#f43f5e', factor));
    } else if (progress >= 0.25 && progress < 0.55) {
      // Day/Evening
      const factor = (progress - 0.25) / 0.3;
      skyGrad.addColorStop(0, this.blendColors('#1e293b', '#030712', factor));
      skyGrad.addColorStop(0.5, this.blendColors('#0f172a', '#1e1b4b', factor));
      skyGrad.addColorStop(1, this.blendColors('#f43f5e', '#7c2d12', factor));
    } else if (progress >= 0.55 && progress < 0.8) {
      // Night/Midnight
      const factor = (progress - 0.55) / 0.25;
      skyGrad.addColorStop(0, this.blendColors('#030712', '#020617', factor));
      skyGrad.addColorStop(0.5, this.blendColors('#1e1b4b', '#090514', factor));
      skyGrad.addColorStop(1, this.blendColors('#7c2d12', '#1e1b4b', factor));
    } else {
      // Deep night -> pre-dawn
      const factor = (progress - 0.8) / 0.2;
      skyGrad.addColorStop(0, this.blendColors('#020617', '#020617', factor));
      skyGrad.addColorStop(0.5, this.blendColors('#090514', '#3b0764', factor));
      skyGrad.addColorStop(1, this.blendColors('#1e1b4b', '#db2777', factor));
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Render stars at night (ambientLight low)
    if (this.ambientLight < 0.7) {
      ctx.save();
      ctx.globalAlpha = (0.7 - this.ambientLight) / 0.7; // fade stars in
      for (const star of this.stars) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = Math.sin(star.twinkle * Math.PI) * ((0.7 - this.ambientLight) / 0.7);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Draw procedural clouds (daylight)
    if (this.ambientLight > 0.4) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.globalAlpha = (this.ambientLight - 0.4) / 0.6;
      for (const cloud of this.clouds) {
        this.drawCloudShape(ctx, cloud.x, cloud.y, cloud.width, cloud.height);
      }
      ctx.restore();
    }
  }

  drawCloudShape(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.arc(x, y + h / 2, h / 2, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x + w * 0.25, y + h * 0.2, h * 0.6, Math.PI * 1.0, Math.PI * 1.95);
    ctx.arc(x + w * 0.6, y, h * 0.75, Math.PI * 1.1, Math.PI * 2.0);
    ctx.arc(x + w * 0.8, y + h * 0.2, h * 0.5, Math.PI * 1.2, Math.PI * 2.1);
    ctx.arc(x + w, y + h / 2, h / 2, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  draw(ctx) {
    // Sky drawn already
    // Parallax layers
    for (const layer of this.layers) {
      layer.draw(ctx);
    }
  }

  // Linear color blender (Hex)
  blendColors(c1, c2, weight) {
    // Simple hex blend
    const parse = (c) => {
      if (c[0] === '#') c = c.slice(1);
      if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
      return [
        parseInt(c.substring(0, 2), 16),
        parseInt(c.substring(2, 4), 16),
        parseInt(c.substring(4, 6), 16)
      ];
    };
    const rgb1 = parse(c1);
    const rgb2 = parse(c2);
    
    const r = Math.round(rgb1[0] + (rgb2[0] - rgb1[0]) * weight);
    const g = Math.round(rgb1[1] + (rgb2[1] - rgb1[1]) * weight);
    const b = Math.round(rgb1[2] + (rgb2[2] - rgb1[2]) * weight);

    return `rgb(${r}, ${g}, ${b})`;
  }
}

// ============================================================================
// 7. SEEDED PROCEDURAL TERRAIN
// ============================================================================
class Terrain {
  constructor(game) {
    this.game = game;
    this.groundY = 560;
    this.segmentWidth = 160; // size of terrain check step
    
    // Active ground blocks
    this.blocks = [];
    this.init();
  }

  init() {
    this.blocks = [];
    // Spawn initial seamless ground (covering width + extra buffer)
    for (let x = 0; x < 1280 + this.segmentWidth * 2; x += this.segmentWidth) {
      this.blocks.push({
        x: x,
        y: this.groundY,
        width: this.segmentWidth,
        isGap: false
      });
    }
  }

  update(dt, scrollSpeed) {
    const movement = scrollSpeed * dt * 60;
    
    // Scroll blocks left
    for (const block of this.blocks) {
      block.x -= movement;
    }

    // Filter offscreen blocks
    this.blocks = this.blocks.filter(b => b.x + b.width > -50);

    // Generate new blocks to fill empty space on the right
    let lastBlock = this.blocks[this.blocks.length - 1];
    while (lastBlock && lastBlock.x + lastBlock.width < 1280 + this.segmentWidth) {
      const nextX = lastBlock.x + lastBlock.width;
      
      // Seeded random decision for ground drops (Pits)
      // Never drop initially or twice in a row
      let isGap = false;
      if (this.game.prng.next() < 0.15 && !lastBlock.isGap && this.game.distanceTraveled > 200) {
        isGap = true;
      }

      this.blocks.push({
        x: nextX,
        y: this.groundY,
        width: this.segmentWidth,
        isGap: isGap
      });
      lastBlock = this.blocks[this.blocks.length - 1];
    }
  }

  // Collision boundary check for fall into pits
  isPlayerOnGround(player) {
    const collider = player.getCollider();
    const pxCenter = collider.x + collider.width / 2;
    
    // Find block matching the player horizontal center
    const activeBlock = this.blocks.find(b => pxCenter >= b.x && pxCenter <= b.x + b.width);
    
    if (activeBlock) {
      return !activeBlock.isGap;
    }
    return true; // Safe fallback
  }

  draw(ctx) {
    ctx.save();
    
    // Style ground fill
    const grad = ctx.createLinearGradient(0, this.groundY, 0, 720);
    grad.addColorStop(0, this.game.themeColors.groundTop);
    grad.addColorStop(1, this.game.themeColors.groundBottom);

    ctx.fillStyle = grad;
    
    // Style neon side strip
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.game.themeColors.secondary;
    
    for (const block of this.blocks) {
      if (block.isGap) continue;

      // Draw Main Ground Block
      ctx.fillRect(block.x, block.y, block.width, 160);

      // Draw Neon line edge
      ctx.strokeStyle = this.game.themeColors.secondary;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(block.x, block.y);
      ctx.lineTo(block.x + block.width, block.y);
      ctx.stroke();

      // Cyber gridlines on ground
      if (this.game.currentTheme === 'cyberpunk') {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        // vertical lines
        for (let gx = 0; gx < block.width; gx += 40) {
          ctx.moveTo(block.x + gx, block.y);
          ctx.lineTo(block.x + gx - 20, 720);
        }
        // horizontal line
        ctx.moveTo(block.x, block.y + 30);
        ctx.lineTo(block.x + block.width, block.y + 30);
        ctx.moveTo(block.x, block.y + 80);
        ctx.lineTo(block.x + block.width, block.y + 80);
        ctx.stroke();
      } else if (this.game.currentTheme === 'desert') {
        // Sand ripples
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.1)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(block.x, block.y + 12);
        ctx.bezierCurveTo(block.x + 40, block.y + 20, block.x + 80, block.y + 5, block.x + block.width, block.y + 12);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

// ============================================================================
// 8. ENTITIES (Obstacles, Enemies, Coins, Power-Ups)
// ============================================================================

// Base class for everything that scrolls along the screen
class Entity {
  constructor(game, x, y, width, height, type) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
  }

  update(dt, scrollSpeed) {
    this.x -= scrollSpeed * dt * 60;
  }

  getCollider() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  checkCollision(rect) {
    const col = this.getCollider();
    return rect.x < col.x + col.width &&
           rect.x + rect.width > col.x &&
           rect.y < col.y + col.height &&
           rect.y + rect.height > col.y;
  }

  isOffscreen() {
    return this.x + this.width < -100;
  }
}

// 8a. OBSTACLES (Spikes, Rocks, Logs)
class Obstacle extends Entity {
  constructor(game, x, subType) {
    // Size determined by obstacle subtype
    let width = 45;
    let height = 50;
    let y = 560 - height; // sitting on ground

    if (subType === 'spike_double') {
      width = 75;
      height = 40;
      y = 560 - height;
    } else if (subType === 'rock') {
      width = 56;
      height = 48;
      y = 560 - height;
    } else if (subType === 'log') {
      width = 70;
      height = 36;
      y = 560 - height;
    }

    super(game, x, y, width, height, 'obstacle');
    this.subType = subType;
  }

  draw(ctx) {
    ctx.save();
    
    // Add shadow glow for neon spikes
    ctx.shadowBlur = 12;
    ctx.shadowColor = this.game.themeColors.primary;

    if (this.subType === 'spike_single') {
      ctx.fillStyle = this.game.themeColors.primary;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + this.width / 2, this.y);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.subType === 'spike_double') {
      ctx.fillStyle = this.game.themeColors.primary;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      
      // Left spike
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + this.width * 0.3, this.y);
      ctx.lineTo(this.x + this.width * 0.6, this.y + this.height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right spike (overlapping slightly)
      ctx.beginPath();
      ctx.moveTo(this.x + this.width * 0.4, this.y + this.height);
      ctx.lineTo(this.x + this.width * 0.75, this.y + 10);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.subType === 'rock') {
      ctx.fillStyle = '#475569';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + 8, this.y + 18);
      ctx.lineTo(this.x + 28, this.y + 2);
      ctx.lineTo(this.x + 46, this.y + 15);
      ctx.lineTo(this.x + this.width, this.y + this.height);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.subType === 'log') {
      // Cylindrical wood log outline
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x + 6, this.y + this.height / 2, this.height / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Main barrel
      ctx.fillStyle = '#b45309';
      ctx.fillRect(this.x + 6, this.y, this.width - 12, this.height);
      ctx.strokeRect(this.x + 6, this.y, this.width - 12, this.height);
      
      // End cap rings
      ctx.strokeStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(this.x + 6, this.y + this.height / 2, this.height / 3, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// 8b. ENEMIES (Ground Patrollers, Flying Drones)
class Enemy extends Entity {
  constructor(game, x, subType) {
    let width = 50;
    let height = 50;
    let y = 560 - height;

    if (subType === 'flying') {
      width = 54;
      height = 40;
      y = 340; // in air
    }

    super(game, x, y, width, height, 'enemy');
    
    this.subType = subType;
    this.speed = subType === 'ground' ? -1.5 : -2.5; // moving relative to scene
    this.hoverTime = Math.random() * Math.PI;
  }

  update(dt, scrollSpeed) {
    // Enemies move independently along x
    this.x -= (scrollSpeed + this.speed * this.game.speedMultiplier) * dt * 60;
    
    if (this.subType === 'flying') {
      // Hover up/down in sine wave
      this.hoverTime += dt * 5;
      this.y = 320 + Math.sin(this.hoverTime) * 30;
    }
  }

  draw(ctx) {
    ctx.save();
    
    ctx.shadowBlur = 12;

    if (this.subType === 'ground') {
      ctx.shadowColor = '#dc2626';
      // Sphere on spikes or robotic sphere patrol
      ctx.fillStyle = '#7f1d1d';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Scanning eye slit
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(this.x + 8, this.y + 18, this.width - 16, 6);

      // Spike spikes
      ctx.fillStyle = '#3f0c10';
      ctx.beginPath();
      ctx.moveTo(this.x, this.y + this.height);
      ctx.lineTo(this.x + 8, this.y + this.height - 15);
      ctx.lineTo(this.x + 15, this.y + this.height);
      ctx.fill();
    } else if (this.subType === 'flying') {
      ctx.shadowColor = '#06b6d4';
      // Flying drone
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      
      // Wings shape
      const wingY = Math.sin(this.hoverTime * 2) * 12;
      ctx.fillStyle = '#0891b2';
      ctx.beginPath();
      // left wing
      ctx.moveTo(this.x + 10, this.y + 15);
      ctx.lineTo(this.x - 12, this.y + wingY);
      ctx.lineTo(this.x, this.y + 25);
      ctx.closePath();
      ctx.fill();

      // right wing
      ctx.beginPath();
      ctx.moveTo(this.x + this.width - 10, this.y + 15);
      ctx.lineTo(this.x + this.width + 12, this.y + wingY);
      ctx.lineTo(this.x + this.width, this.y + 25);
      ctx.closePath();
      ctx.fill();

      // Center sphere body
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Glowing lens camera
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// 8c. COLLECTIBLES (Coins & Gems)
class Collectible extends Entity {
  constructor(game, x, y, isGem = false) {
    const size = isGem ? 30 : 25;
    super(game, x, y, size, size, 'collectible');
    this.isGem = isGem;
    
    // Pulse animation details
    this.pulseTime = Math.random() * Math.PI;
    this.val = isGem ? 25 : 5; // coins/points weight (Upgraded: 5 per coin, 25 per gem)
  }

  update(dt, scrollSpeed) {
    this.pulseTime += dt * 5;

    // Pull logic if Magnet PowerUp is active
    if (this.game.activePowerups.magnet) {
      const px = this.game.player.x + this.game.player.width / 2;
      const py = this.game.player.y + this.game.player.height / 2;
      
      const dx = px - (this.x + this.width / 2);
      const dy = py - (this.y + this.height / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      const magnetRange = 160; // Field pull threshold
      if (dist < magnetRange) {
        // Accelerate magnet pulling speed
        const pullSpeed = 480 / Math.max(10, dist);
        this.x += (dx / dist) * pullSpeed * dt * 60;
        this.y += (dy / dist) * pullSpeed * dt * 60;
        
        // Return without normal scroll since pulled directly
        return;
      }
    }

    super.update(dt, scrollSpeed);
  }

  draw(ctx) {
    ctx.save();
    
    // Scale X to simulate a spin coin
    const spinFactor = Math.sin(this.pulseTime);
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.scale(spinFactor, 1);

    ctx.shadowBlur = 10;

    if (this.isGem) {
      ctx.shadowColor = '#a855f7';
      ctx.fillStyle = '#a855f7';
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 1.5;
      
      // Diamond paths
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 2);
      ctx.lineTo(this.width / 2, 0);
      ctx.lineTo(0, this.height / 2);
      ctx.lineTo(-this.width / 2, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Shiny inner highlight
      ctx.fillStyle = '#f3e8ff';
      ctx.beginPath();
      ctx.moveTo(0, -this.height / 3);
      ctx.lineTo(this.width / 4, 0);
      ctx.lineTo(0, this.height / 3);
      ctx.lineTo(-this.width / 4, 0);
      ctx.closePath();
      ctx.fill();
    } else {
      // Coin
      ctx.shadowColor = '#fbbf24';
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#fef3c7';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Embossed gold symbol inside coin
      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 13px var(--font-display)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('N', 0, 1);
    }

    ctx.restore();
  }
}

// 8d. POWER-UPS (Shield, Boost, Magnet, Multiplier)
class PowerUp extends Entity {
  constructor(game, x, y, subType) {
    super(game, x, y, 32, 32, 'powerup');
    this.subType = subType; // 'shield', 'speed', 'magnet', 'multiplier'
    this.pulseTime = Math.random() * Math.PI;
  }

  update(dt, scrollSpeed) {
    this.pulseTime += dt * 4;
    super.update(dt, scrollSpeed);
  }

  draw(ctx) {
    ctx.save();
    
    // Up-down bobbing effect
    const bobOffset = Math.sin(this.pulseTime) * 6;
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2 + bobOffset);

    // Glowing circular containment field
    let color = '#06b6d4'; // shield blue
    let iconStr = '🛡️';

    if (this.subType === 'speed') {
      color = '#10b981'; // speed green
      iconStr = '⚡';
    } else if (this.subType === 'magnet') {
      color = '#ec4899'; // magnet pink
      iconStr = '🧲';
    } else if (this.subType === 'multiplier') {
      color = '#a855f7'; // multiplier purple
      iconStr = '2x';
    }

    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.arc(0, 0, 20 + Math.sin(this.pulseTime * 2) * 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Icon drawing
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    if (this.subType === 'multiplier') {
      ctx.font = 'bold 12px var(--font-display)';
      ctx.fillText('2x', 0, 1);
    } else {
      ctx.fillText(iconStr, 0, 0);
    }

    ctx.restore();
  }
}

// ============================================================================
// 9. METAGAME LOGIC (Achievements, Skins, Stats Managers)
// ============================================================================
class StatsManager {
  constructor() {
    this.data = {
      runs: 0,
      distance: 0,
      coins: 200, // Upgraded: Start with 200 coins
      gems: 0,
      jumps: 0,
      slides: 0,
      highScore: 0,
      unlockedSkins: ['astronaut'],
      equippedSkin: 'astronaut',
      completedDailySeeds: []
    };
    this.load();
  }

  load() {
    try {
      const saved = localStorage.getItem('neptune_runner_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = { ...this.data, ...parsed };
      }
      // Guarantee array types to prevent crashes on legacy local storage properties
      if (!Array.isArray(this.data.unlockedSkins)) {
        this.data.unlockedSkins = ['astronaut'];
      }
      if (!Array.isArray(this.data.completedDailySeeds)) {
        this.data.completedDailySeeds = [];
      }
      if (typeof this.data.coins !== 'number') {
        this.data.coins = 200;
      }
    } catch (e) {
      console.warn('Failed parsing save data from localStorage:', e);
    }
  }

  save() {
    try {
      localStorage.setItem('neptune_runner_data', JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed saving data to localStorage:', e);
    }
  }

  get equippedSkin() {
    return this.data.equippedSkin;
  }

  set equippedSkin(skinId) {
    this.data.equippedSkin = skinId;
    this.save();
  }

  addStat(key, amount) {
    if (this.data[key] !== undefined) {
      if (Array.isArray(this.data[key])) return; // arrays can't increment
      this.data[key] += amount;
      this.save();
    }
  }

  updateHighScore(score) {
    if (score > this.data.highScore) {
      this.data.highScore = score;
      this.save();
      return true; // new high score
    }
    return false;
  }

  unlockSkin(skinId, cost) {
    if (this.data.coins >= cost && !this.data.unlockedSkins.includes(skinId)) {
      this.data.coins -= cost;
      this.data.unlockedSkins.push(skinId);
      this.save();
      return true;
    }
    return false;
  }

  wipeData() {
    try {
      localStorage.removeItem('neptune_runner_data');
      localStorage.removeItem('neptune_runner_achievements');
    } catch (e) {
      console.warn('Failed removing data from localStorage:', e);
    }
    this.data = {
      runs: 0,
      distance: 0,
      coins: 200, // Upgraded: Reset to 200 coins
      gems: 0,
      jumps: 0,
      slides: 0,
      highScore: 0,
      unlockedSkins: ['astronaut'],
      equippedSkin: 'astronaut',
      completedDailySeeds: []
    };
    if (this.game && this.game.achievementManager) {
      this.game.achievementManager.unlockedIds = [];
    }
    this.save();
  }
}

class AchievementManager {
  constructor(game) {
    this.game = game;
    
    // Awards schema definitions
    this.achievements = [
      { id: 'first_run', name: 'First Launch', desc: 'Complete your first run.', target: 1, type: 'runs', icon: '🚀' },
      { id: 'coin_collector', name: 'Energy Harvester', desc: 'Collect 100 total coins.', target: 100, type: 'coins', icon: '🪙' },
      { id: 'gem_hoarder', name: 'Quantum Core', desc: 'Find 10 glowing gems.', target: 10, type: 'gems', icon: '💎' },
      { id: 'distance_runner', name: 'Dark Void Explorer', desc: 'Run a total of 5,000 meters.', target: 5000, type: 'distance', icon: '🌌' },
      { id: 'high_scorer', name: 'Elite Captain', desc: 'Reach a score of 3,000 in a single run.', target: 3000, type: 'score', icon: '🏆' },
      { id: 'jumper', name: 'Double Jumper', desc: 'Jump 100 times.', target: 100, type: 'jumps', icon: '🦘' }
    ];

    this.unlockedIds = [];
    this.loadUnlocked();
  }

  loadUnlocked() {
    try {
      const saved = localStorage.getItem('neptune_runner_achievements');
      if (saved) {
        this.unlockedIds = JSON.parse(saved) || [];
      }
    } catch (e) {
      console.warn('Failed to load achievements from localStorage:', e);
      this.unlockedIds = [];
    }
  }

  saveUnlocked() {
    try {
      localStorage.setItem('neptune_runner_achievements', JSON.stringify(this.unlockedIds));
    } catch (e) {
      console.warn('Failed to save achievements to localStorage:', e);
    }
  }

  checkAchievements() {
    const stats = this.game.statsManager.data;
    let unlockedAny = false;

    for (const ach of this.achievements) {
      if (this.unlockedIds.includes(ach.id)) continue;

      let currentVal = 0;
      if (ach.type === 'score') {
        currentVal = this.game.score; // Checked on active run score
      } else {
        currentVal = stats[ach.type] || 0;
      }

      if (currentVal >= ach.target) {
        this.unlockedIds.push(ach.id);
        unlockedAny = true;
        
        // Spawn visual alert toast in overlay
        this.showAchievementToast(ach);
      }
    }

    if (unlockedAny) {
      this.saveUnlocked();
    }
  }

  showAchievementToast(ach) {
    const toast = document.createElement('div');
    toast.style.position = 'absolute';
    toast.style.bottom = '1.5rem';
    toast.style.left = '1.5rem';
    toast.style.background = 'rgba(15, 23, 42, 0.9)';
    toast.style.border = '1.5px solid var(--secondary)';
    toast.style.boxShadow = '0 0 15px var(--secondary-glow)';
    toast.style.padding = '0.75rem 1.25rem';
    toast.style.borderRadius = '10px';
    toast.style.zIndex = '99';
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '0.75rem';
    toast.style.pointerEvents = 'none';
    toast.style.animation = 'slideInLeft 0.3s ease-out, fadeOut 0.3s ease-in 2.5s forwards';

    toast.innerHTML = `
      <div style="font-size: 1.5rem;">${ach.icon}</div>
      <div>
        <div style="font-size: 0.6rem; color: var(--secondary); font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase;">AWARD UNLOCKED</div>
        <div style="font-size: 0.85rem; font-weight: 700; color: #ffffff;">${ach.name}</div>
      </div>
    `;

    // Inject fade out rule if not existing
    if (!document.getElementById('toast-anim-css')) {
      const style = document.createElement('style');
      style.id = 'toast-anim-css';
      style.innerHTML = `@keyframes fadeOut { to { opacity: 0; transform: translateY(10px); } }`;
      document.head.appendChild(style);
    }

    document.getElementById('game-container').appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

// ============================================================================
// 10. GAME CONTROLLER ENGINE
// ============================================================================
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Game States: 'MENU', 'RUNNING', 'PAUSED', 'GAMEOVER'
    this.state = 'MENU';
    
    // Seeded random number generator
    this.prng = new PRNG();
    this.isDailyChallenge = false;
    this.dailySeed = 0;

    // Time scaling variables
    this.lastTime = 0;
    this.speed = 8.5; // Scroll speed in pixels
    this.maxSpeed = 16.0;
    this.speedMultiplier = 1.0;
    this.difficultyTimer = 0;

    // Gameplay Statistics
    this.score = 0;
    this.distanceTraveled = 0;
    this.coinsCollected = 0;

    // Power-up durations map (in seconds)
    this.powerupDurations = {
      shield: 10,
      speed: 8,
      magnet: 12,
      multiplier: 10
    };
    
    this.activePowerups = {
      shield: 0,
      speed: 0,
      magnet: 0,
      multiplier: 0
    };

    // Spawn logic queue controls
    this.entitySpawnTimer = 0;
    this.entities = [];

    // Screen Shake effect
    this.shakeIntensity = 0;
    
    // System Instantiations
    this.soundManager = new SoundManager();
    this.statsManager = new StatsManager();
    this.statsManager.game = this;
    this.achievementManager = new AchievementManager(this);
    this.particleSystem = new ParticleSystem(this);
    this.player = new Player(this);
    this.background = new Background(this);
    this.terrain = new Terrain(this);
    this.input = new InputHandler(this);

    // Setup Theme settings
    this.themes = {
      cyberpunk: {
        sky: '#06030f',
        farBG: '#100b23',
        midBG: '#1a103c',
        nearBG: '#251654',
        groundTop: '#0d0722',
        groundBottom: '#04010b',
        primary: '#ff2a5f', // Synthwave Glowing Rose
        secondary: '#05f9e2', // Synthwave Electric Turquoise
        dust: 'rgba(255, 42, 95, 0.3)',
        weather: 'cyberpunk'
      },
      forest: {
        sky: '#020d0a',
        farBG: '#051812',
        midBG: '#08251b',
        nearBG: '#0e3d2c',
        groundTop: '#092d20',
        groundBottom: '#020e0a',
        primary: '#00f5aa', // Emerald Neon
        secondary: '#ffd700', // Neon Gold
        dust: 'rgba(0, 245, 170, 0.3)',
        weather: 'rain'
      },
      desert: {
        sky: '#140300',
        farBG: '#220802',
        midBG: '#3a0f03',
        nearBG: '#581602',
        groundTop: '#400f01',
        groundBottom: '#180400',
        primary: '#ff5500', // Solar Flare Orange
        secondary: '#ffcc00', // Solar Flare Gold
        dust: 'rgba(255, 85, 0, 0.3)',
        weather: 'none'
      },
      snow: {
        sky: '#030712',
        farBG: '#0b132b',
        midBG: '#1c2541',
        nearBG: '#3a506b',
        groundTop: '#e2e8f0',
        groundBottom: '#94a3b8',
        primary: '#00d2ff', // Neon Frost Blue
        secondary: '#ffffff', // Snow White
        dust: 'rgba(0, 210, 255, 0.4)',
        weather: 'snow'
      }
    };
    
    // Choose Theme
    this.currentTheme = 'cyberpunk';
    this.themeColors = this.themes[this.currentTheme];

    // Setup GUI handlers
    this.ui = new UIManager(this);

    // Initial audio setup (prevents frame-by-frame DOM querying in update loop)
    try {
      const initialMute = document.getElementById('toggle-audio').checked;
      this.soundManager.setMute(initialMute);
      const initialVolume = parseInt(document.getElementById('slider-volume').value) / 100;
      this.soundManager.setVolume(initialVolume);
    } catch (e) {
      console.warn('Could not sync initial audio settings from DOM:', e);
    }

    // Initial setup
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Run core engine loop
    requestAnimationFrame((t) => this.loop(t));
  }

  setTheme(themeId) {
    if (this.themes[themeId]) {
      this.currentTheme = themeId;
      this.themeColors = this.themes[themeId];
      // Reset background layers structure for new colors
      this.background.initLayers();
    }
  }

  resizeCanvas() {
    // Canvas sizing (1280x720 aspect ratio)
    const container = document.getElementById('game-container');
    if (!container) return;
    const width = container.clientWidth;
    const height = container.clientHeight;
    
    if (this.canvas) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  triggerScreenShake(duration = 0.25) {
    const container = document.getElementById('game-container');
    container.classList.add('shake');
    setTimeout(() => {
      container.classList.remove('shake');
    }, duration * 1000);
  }

  // Seed calculations for daily challenges
  initSeededRun() {
    this.isDailyChallenge = true;
    const now = new Date();
    // YYYYMMDD seed representation
    const dateSeed = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
    this.dailySeed = dateSeed;
    this.prng = new PRNG(dateSeed);
    
    this.startRun();
  }

  initRandomRun() {
    this.isDailyChallenge = false;
    this.prng = new PRNG(Math.floor(Math.random() * 1000000));
    
    this.startRun();
  }

  startRun() {
    this.score = 0;
    this.distanceTraveled = 0;
    this.coinsCollected = 0;
    this.speedMultiplier = 1.0;
    this.difficultyTimer = 0;
    this.entities = [];
    this.entitySpawnTimer = 0.5;

    // Reset active powerup clocks
    for (const key in this.activePowerups) {
      this.activePowerups[key] = 0;
    }

    this.player.reset();
    this.terrain.init();
    this.particleSystem.clear();
    
    this.state = 'RUNNING';
    this.soundManager.startMusic();
    this.ui.onRunStarted();
  }

  crash() {
    if (this.state === 'GAMEOVER') return;
    
    this.state = 'GAMEOVER';
    this.player.state = 'CRASHED';
    this.triggerScreenShake(0.3);
    
    // Sounds & particles
    this.soundManager.playHit();
    this.soundManager.stopMusic();
    this.particleSystem.spawnHitExplosion(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);

    // Save statistics in LocalStorage
    this.statsManager.addStat('runs', 1);
    this.statsManager.addStat('coins', this.coinsCollected);
    this.statsManager.addStat('gems', Math.floor(this.score / 200)); // proxy award for high score ratios
    this.statsManager.addStat('distance', Math.floor(this.distanceTraveled));
    
    const distanceInt = Math.floor(this.distanceTraveled);
    const wasNewHigh = this.statsManager.updateHighScore(this.score);
    this.achievementManager.checkAchievements();

    this.ui.onGameOver(this.score, distanceInt, this.coinsCollected, wasNewHigh);
  }

  pause() {
    if (this.state !== 'RUNNING') return;
    this.state = 'PAUSED';
    this.soundManager.stopMusic();
    this.ui.onPauseState(true);
  }

  resume() {
    if (this.state !== 'PAUSED') return;
    this.state = 'RUNNING';
    this.soundManager.startMusic();
    this.ui.onPauseState(false);
  }

  quitToMenu() {
    this.state = 'MENU';
    this.soundManager.stopMusic();
    this.ui.showMenu('main');
  }

  // --- MAIN LOOP ---
  loop(time) {
    if (!this.lastTime) this.lastTime = time;
    const dt = Math.min(0.1, (time - this.lastTime) / 1000); // Caps lags frames
    this.lastTime = time;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // Always update visual stars, clouds, weather overlays even on menu

    // Dynamic weather particle additions
    if (this.ui.dynamicWeatherEnabled) {
      this.particleSystem.spawnWeather(1280, 720, this.themeColors.weather);
    }
    this.particleSystem.update(dt);

    if (this.state === 'RUNNING') {
      // Difficulty progression
      this.difficultyTimer += dt;
      // Linear ramp over 3 minutes to max scale
      this.speedMultiplier = 1.0 + Math.min(1.0, this.difficultyTimer / 180) * 0.7;

      // Active speed boost speed override
      const baseSpeed = this.speed * this.speedMultiplier;
      const finalSpeed = this.activePowerups.speed > 0 ? baseSpeed * 1.6 : baseSpeed;

      // Distance and scores tracking
      this.distanceTraveled += (finalSpeed * dt * 0.35); // simulated meter metric
      
      let scoreGain = (finalSpeed * dt * 2.5);
      if (this.activePowerups.multiplier > 0) {
        scoreGain *= 2;
      }
      this.score += Math.round(scoreGain);

      // Background / Terrain scroll
      this.background.update(dt, finalSpeed);
      this.terrain.update(dt, finalSpeed);
      
      // Update Player
      this.player.update(dt);

      // Check if player fell in pit
      if (this.player.y >= this.player.groundY && !this.terrain.isPlayerOnGround(this.player)) {
        // Drop down pit
        this.player.y += 12; // accelerate fall offscreen
        if (this.player.y > 720) {
          this.crash();
        }
      }

      // Decrement powerup timers
      for (const key in this.activePowerups) {
        if (this.activePowerups[key] > 0) {
          this.activePowerups[key] = Math.max(0, this.activePowerups[key] - dt);
        }
      }

      // Handle entity updates (collisions and cleanup)
      this.updateEntities(dt, finalSpeed);

      // Entity spawning trigger
      this.entitySpawnTimer -= dt;
      if (this.entitySpawnTimer <= 0) {
        this.spawnNextEntities();
      }

      this.ui.updateHUD(this.score, Math.floor(this.distanceTraveled), this.coinsCollected);
      this.achievementManager.checkAchievements();
    }
  }

  updateEntities(dt, finalSpeed) {
    const playerRect = this.player.getCollider();
    
    // Filter and update
    this.entities = this.entities.filter(ent => {
      ent.update(dt, finalSpeed);
      
      // Offscreen clean
      if (ent.isOffscreen()) {
        return false;
      }

      // Collision check
      if (ent.checkCollision(playerRect)) {
        this.handleEntityCollision(ent);
        return false; // destroy entity upon collection/impact
      }

      return true;
    });
  }

  handleEntityCollision(ent) {
    if (this.state === 'GAMEOVER') return;

    if (ent.type === 'obstacle' || ent.type === 'enemy') {
      // Speed boost guarantees safety
      if (this.activePowerups.speed > 0) {
        // Destroy obstacle and burst sparkles
        this.soundManager.playHit();
        this.particleSystem.spawnHitExplosion(ent.x + ent.width / 2, ent.y + ent.height / 2);
        return;
      }

      // Shield protection
      if (this.activePowerups.shield > 0) {
        this.activePowerups.shield = 0; // shield breaks
        this.soundManager.playHit(); // play shield shatter sounds
        this.particleSystem.spawnLandingSparks(this.player.x + this.player.width / 2, this.player.y + this.player.height / 2);
        this.triggerScreenShake(0.15);
        return;
      }

      // Collision impact
      this.crash();
    } else if (ent.type === 'collectible') {
      const isGem = ent.isGem;
      
      if (isGem) {
        this.soundManager.playGem();
        // Add gem score & credits multiplier
        let value = ent.val;
        if (this.activePowerups.multiplier > 0) value *= 2;
        this.coinsCollected += value;
        this.score += 250;
      } else {
        this.soundManager.playCoin();
        let value = ent.val;
        if (this.activePowerups.multiplier > 0) value *= 2;
        this.coinsCollected += value;
        this.score += 50;
      }
      this.particleSystem.spawnCoinCollect(ent.x + ent.width / 2, ent.y + ent.height / 2, isGem);
    } else if (ent.type === 'powerup') {
      this.soundManager.playPowerUp();
      const sub = ent.subType;
      this.activePowerups[sub] = this.powerupDurations[sub];
      this.ui.createPowerupTimer(sub, this.powerupDurations[sub]);
    }
  }

  // Generator Queue Logic (Fair Obstacle placement)
  spawnNextEntities() {
    // Set next spawn delay: scales down as speed increases (faster spawning)
    const baseDelay = this.prng.range(1.5, 3.2);
    this.entitySpawnTimer = baseDelay / this.speedMultiplier;

    // Spawning choices
    const spawnRoll = this.prng.next();
    
    // Choose what to spawn
    if (spawnRoll < 0.20) {
      // 1. Spawning Obstacles (Rocks, spikes, fallen logs)
      const list = ['spike_single', 'spike_double', 'rock', 'log'];
      const sub = this.prng.choice(list);
      this.entities.push(new Obstacle(this, 1350, sub));
    } else if (spawnRoll >= 0.20 && spawnRoll < 0.35) {
      // 2. Spawning Enemies (Ground/Flying)
      const list = ['ground', 'flying'];
      const sub = this.prng.choice(list);
      this.entities.push(new Enemy(this, 1350, sub));
    } else if (spawnRoll >= 0.35 && spawnRoll < 0.85) {
      // 3. Spawning Coins or Gems line layout (Increased rate to 50% spawn rate)
      const isGem = this.prng.next() < 0.15; // 15% Gem chance
      const coinHeight = this.prng.choice([500, 420, 320]); // low, mid, high heights
      const patternLength = this.prng.choice([6, 7, 8, 9, 10, 11]); // Upgraded: longer patterns

      for (let i = 0; i < patternLength; i++) {
        // space pattern entries sequentially
        const px = 1350 + i * 42;
        // Draw coins in arch wave shape
        const angle = (i / (patternLength - 1)) * Math.PI;
        const py = coinHeight - Math.sin(angle) * 50;
        
        // Spawn main row (which can contain a gem in the middle)
        this.entities.push(new Collectible(this, px, py, isGem && i === Math.floor(patternLength / 2)));
        // Spawn parallel double row (36px above main row)
        this.entities.push(new Collectible(this, px, py - 36, false));
      }
    } else {
      // 4. Spawning Power-up (Shield, Speed, Magnet, Multiplier)
      const list = ['shield', 'speed', 'magnet', 'multiplier'];
      const sub = this.prng.choice(list);
      const py = this.prng.choice([460, 360]); // jump/double jump height reachable
      this.entities.push(new PowerUp(this, 1350, py, sub));
    }
  }

  // --- DRAW LOOP ---
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Save and scale virtual viewport coordinates
    this.ctx.save();
    const scaleX = this.canvas.width / 1280;
    const scaleY = this.canvas.height / 720;
    this.ctx.scale(scaleX, scaleY);

    // 1. Sky layer
    this.background.drawSky(this.ctx, 1280, 720);

    // 2. Parallax backgrounds
    this.background.draw(this.ctx);

    // 3. Seeded procedural ground/terrain
    this.terrain.draw(this.ctx);

    // 4. Entities (Spikes, coins, powerups)
    for (const ent of this.entities) {
      ent.draw(this.ctx);
    }

    // 5. Particle trails/effects
    this.particleSystem.draw(this.ctx);

    // 6. Character
    this.player.draw(this.ctx);

    this.ctx.restore();
  }
}

// ============================================================================
// 11. UI SCREEN COORDINATOR INTERFACE
// ============================================================================
class UIManager {
  constructor(game) {
    this.game = game;
    this.dynamicWeatherEnabled = true;

    // Cache elements
    this.screens = {
      main: document.getElementById('menu-main'),
      pause: document.getElementById('menu-pause'),
      gameover: document.getElementById('menu-gameover'),
      settings: document.getElementById('menu-settings'),
      achievements: document.getElementById('menu-achievements'),
      stats: document.getElementById('menu-stats'),
      skins: document.getElementById('menu-skins')
    };

    this.hud = document.getElementById('hud');
    this.hudControls = document.getElementById('hud-controls');
    
    // Skins configuration definition list
    this.skinsData = [
      { id: 'astronaut', name: 'Astronaut Suit', desc: 'Standard issue planetary spacesuit.', cost: 0 },
      { id: 'cyber_ninja', name: 'Cyber Ninja', desc: 'Sleek stealth suit fitted with visual pink trailing sparks.', cost: 250 },
      { id: 'robo', name: 'Neon Robo Unit', desc: 'Metallic autonomous frame with scanning cyclops lens.', cost: 500 },
      { id: 'solar_raider', name: 'Solar Raider', desc: 'Heat-resistant orange suit with gilded visor highlights.', cost: 1000 }
    ];
    this.skinsPreviewCanvas = document.getElementById('skinPreviewCanvas');
    this.skinsPreviewCtx = this.skinsPreviewCanvas.getContext('2d');
    this.skinsPreviewTimer = 0;
    this.previewSkinId = 'astronaut';

    this.initBindings();
    this.updateMenuHighScore();
    this.runSkinPreviewLoop();
  }

  showMenu(menuKey) {
    // Hide all panels
    for (const key in this.screens) {
      this.screens[key].classList.add('hidden');
      this.screens[key].classList.remove('active');
    }
    
    // Show chosen screen overlay
    if (this.screens[menuKey]) {
      this.screens[menuKey].classList.remove('hidden');
      this.screens[menuKey].classList.add('active');
    }

    if (menuKey === 'main') {
      this.hud.classList.add('hidden');
      this.hudControls.classList.add('hidden');
      this.updateMenuHighScore();
    }
  }

  updateMenuHighScore() {
    document.getElementById('menu-high-score').innerText = this.game.statsManager.data.highScore.toLocaleString();
  }

  initBindings() {
    // --- Button Bindings ---
    
    // 1. Play Mission
    document.getElementById('btn-play').addEventListener('click', () => {
      this.game.soundManager.init(); // ensure context unlocked
      this.game.initRandomRun();
    });

    // 2. Daily challenge
    document.getElementById('btn-daily').addEventListener('click', () => {
      this.game.soundManager.init();
      
      const seedKey = new Date().toDateString();
      if (this.game.statsManager.data.completedDailySeeds.includes(seedKey)) {
        alert("You have already submitted a Daily Challenge score today! Try again tomorrow.");
        return;
      }
      this.game.initSeededRun();
    });

    // Pause triggering buttons
    document.getElementById('btn-pause-toggle').addEventListener('click', () => {
      this.game.pause();
    });

    document.getElementById('btn-resume').addEventListener('click', () => {
      this.game.resume();
    });

    // Audio switches
    const muteCheck = document.getElementById('toggle-audio');
    const audioBtn = document.getElementById('btn-audio-toggle');
    
    const updateAudioButtonLabel = () => {
      audioBtn.innerText = muteCheck.checked ? '🔇' : '🔊';
    };

    muteCheck.addEventListener('change', () => {
      this.game.soundManager.setMute(muteCheck.checked);
      updateAudioButtonLabel();
    });

    audioBtn.addEventListener('click', () => {
      muteCheck.checked = !muteCheck.checked;
      this.game.soundManager.setMute(muteCheck.checked);
      updateAudioButtonLabel();
    });

    document.getElementById('slider-volume').addEventListener('input', (e) => {
      const percent = e.target.value;
      document.getElementById('volume-val').innerText = `${percent}%`;
      this.game.soundManager.setVolume(percent / 100);
    });

    // Weather switcher
    const weatherCheck = document.getElementById('toggle-weather');
    weatherCheck.addEventListener('change', () => {
      this.dynamicWeatherEnabled = weatherCheck.checked;
    });

    // Theme Switch
    document.getElementById('select-theme').addEventListener('change', (e) => {
      this.game.setTheme(e.target.value);
    });

    // Wipe storage
    document.getElementById('btn-reset-data').addEventListener('click', () => {
      if (confirm("Are you sure you want to completely erase all stats, skins, and high scores?")) {
        this.game.statsManager.wipeData();
        this.updateMenuHighScore();
        alert("Game data cleared successfully!");
      }
    });

    // Screen navigations
    document.getElementById('btn-settings-menu').addEventListener('click', () => this.showMenu('settings'));
    document.getElementById('btn-settings-back').addEventListener('click', () => this.showMenu('main'));

    document.getElementById('btn-stats-menu').addEventListener('click', () => {
      this.renderStatsPanel();
      this.showMenu('stats');
    });
    document.getElementById('btn-stats-back').addEventListener('click', () => this.showMenu('main'));

    document.getElementById('btn-achievements-menu').addEventListener('click', () => {
      this.renderAchievementsPanel();
      this.showMenu('achievements');
    });
    document.getElementById('btn-achievements-back').addEventListener('click', () => this.showMenu('main'));

    document.getElementById('btn-skins-menu').addEventListener('click', () => {
      this.renderSkinsPanel();
      this.showMenu('skins');
    });
    document.getElementById('btn-skins-back').addEventListener('click', () => this.showMenu('main'));

    // Select skin equipment button
    document.getElementById('btn-select-skin').addEventListener('click', () => {
      this.equipOrUnlockSkin(this.previewSkinId);
    });

    // GameOver screen controls
    document.getElementById('btn-restart').addEventListener('click', () => {
      if (this.game.isDailyChallenge) {
        this.game.initSeededRun();
      } else {
        this.game.initRandomRun();
      }
    });
    document.getElementById('btn-gameover-quit').addEventListener('click', () => this.quitToMenu());

    // Pause overlay buttons
    document.getElementById('btn-pause-restart').addEventListener('click', () => {
      this.showMenu('pause');
      this.game.state = 'RUNNING'; // force state change before trigger restart
      if (this.game.isDailyChallenge) {
        this.game.initSeededRun();
      } else {
        this.game.initRandomRun();
      }
    });
    document.getElementById('btn-pause-quit').addEventListener('click', () => {
      this.quitToMenu();
    });
  }

  quitToMenu() {
    this.game.quitToMenu();
  }

  onRunStarted() {
    this.showMenu('none'); // hides all screens
    this.hud.classList.remove('hidden');
    this.hudControls.classList.remove('hidden');
    document.getElementById('powerup-indicators').innerHTML = '';
    
    // Show mobile helper overlay for responsive devices
    if ('ontouchstart' in window) {
      const helper = document.getElementById('mobile-help');
      helper.classList.remove('hidden');
      setTimeout(() => helper.classList.add('hidden'), 3500); // Fades away
    }
  }

  onPauseState(isPaused) {
    if (isPaused) {
      this.screens.pause.classList.remove('hidden');
      this.hudControls.classList.add('hidden');
    } else {
      this.screens.pause.classList.add('hidden');
      this.hudControls.classList.remove('hidden');
    }
  }

  onGameOver(score, distance, coins, isNewHigh) {
    this.hud.classList.add('hidden');
    this.hudControls.classList.add('hidden');

    document.getElementById('summary-score').innerText = score.toLocaleString();
    document.getElementById('summary-distance').innerText = `${distance}m`;
    document.getElementById('summary-coins').innerText = coins;

    const banner = document.getElementById('new-high-score-badge');
    if (isNewHigh) {
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }

    if (this.game.isDailyChallenge) {
      document.getElementById('gameover-title').innerText = "CHALLENGE CONCLUDED";
      document.getElementById('gameover-title').className = "menu-title highlight";
      document.getElementById('gameover-reason').innerText = "Score recorded on central telemetry database.";
      
      // Mark Daily Seed completed
      const seedKey = new Date().toDateString();
      this.game.statsManager.data.completedDailySeeds.push(seedKey);
      this.game.statsManager.save();
    } else {
      document.getElementById('gameover-title').innerText = "MISSION COMPROMISED";
      document.getElementById('gameover-title').className = "menu-title text-danger";
      document.getElementById('gameover-reason').innerText = "Fatal hull impact occurred.";
    }

    this.showMenu('gameover');
  }

  updateHUD(score, distance, coins) {
    document.getElementById('hud-score').innerText = score.toString().padStart(6, '0');
    document.getElementById('hud-distance').innerText = `${distance}m`;
    document.getElementById('hud-coins').innerText = coins;

    // Tick active progress timers
    for (const key in this.game.activePowerups) {
      const val = this.game.activePowerups[key];
      const fill = document.getElementById(`pbar-fill-${key}`);
      if (fill) {
        const percent = (val / this.game.powerupDurations[key]) * 100;
        fill.style.width = `${percent}%`;
        
        // Remove timer bar from HUD once expired
        if (val <= 0) {
          const container = document.getElementById(`pbar-container-${key}`);
          if (container) container.remove();
        }
      }
    }
  }

  // --- Dynamic HUD Timer Blocks ---
  createPowerupTimer(key, maxDuration) {
    // Prevent duplicate bars
    let container = document.getElementById(`pbar-container-${key}`);
    if (container) return;

    container = document.createElement('div');
    container.id = `pbar-container-${key}`;
    container.className = 'powerup-bar-container';

    let color = '#06b6d4'; // cyan
    let name = key;

    if (key === 'speed') {
      color = '#10b981'; // green
      name = 'warp boost';
    } else if (key === 'magnet') {
      color = '#ec4899'; // pink
      name = 'gravity core';
    } else if (key === 'multiplier') {
      color = '#a855f7'; // purple
      name = 'double score';
    }

    container.innerHTML = `
      <div class="powerup-info">
        <span class="powerup-name" style="color: ${color};">${name}</span>
      </div>
      <div class="powerup-bar-bg">
        <div id="pbar-fill-${key}" class="powerup-bar-fill" style="background: ${color}; width: 100%;"></div>
      </div>
    `;

    document.getElementById('powerup-indicators').appendChild(container);
  }

  // --- Renders Meta-Overlay Panels ---

  renderStatsPanel() {
    const stats = this.game.statsManager.data;
    document.getElementById('stats-runs').innerText = stats.runs;
    document.getElementById('stats-distance').innerText = `${(stats.distance / 1000).toFixed(2)}km`;
    document.getElementById('stats-coins').innerText = stats.coins.toLocaleString();
    document.getElementById('stats-gems').innerText = stats.gems.toLocaleString();
    document.getElementById('stats-jumps').innerText = stats.jumps.toLocaleString();
    document.getElementById('stats-slides').innerText = stats.slides.toLocaleString();
  }

  renderAchievementsPanel() {
    const container = document.getElementById('achievements-list');
    container.innerHTML = '';

    const stats = this.game.statsManager.data;
    const unlockedList = this.game.achievementManager.unlockedIds;

    for (const ach of this.game.achievementManager.achievements) {
      const isUnlocked = unlockedList.includes(ach.id);
      
      let progressVal = stats[ach.type] || 0;
      if (ach.type === 'score') progressVal = stats.highScore; // default to personal high
      
      const percent = Math.min(100, Math.floor((progressVal / ach.target) * 100));

      const item = document.createElement('div');
      item.className = `achievement-item ${isUnlocked ? 'unlocked' : 'locked'}`;

      item.innerHTML = `
        <div class="achievement-icon">${isUnlocked ? ach.icon : '🔒'}</div>
        <div class="achievement-details">
          <div class="achievement-name">${ach.name}</div>
          <div class="achievement-desc">${ach.desc}</div>
          
          <!-- Progress bar inside achievements panel -->
          <div style="background: rgba(255,255,255,0.06); width: 100%; height: 4px; border-radius: 2px; margin-top: 6px; overflow: hidden;">
            <div style="background: ${isUnlocked ? 'var(--secondary)' : 'var(--text-muted)'}; width: ${percent}%; height: 100%;"></div>
          </div>
        </div>
        <div class="achievement-status">
          ${isUnlocked ? 'UNLOCKED' : `${progressVal}/${ach.target}`}
        </div>
      `;
      container.appendChild(item);
    }
  }

  renderSkinsPanel() {
    const grid = document.getElementById('skins-grid');
    grid.innerHTML = '';

    const unlocked = this.game.statsManager.data.unlockedSkins;
    const equipped = this.game.statsManager.equippedSkin;

    for (const skin of this.skinsData) {
      const isUnlocked = unlocked.includes(skin.id);
      const isEquipped = equipped === skin.id;

      const card = document.createElement('div');
      card.className = `skin-grid-item ${isEquipped ? 'selected' : ''} ${!isUnlocked ? 'locked' : ''}`;
      card.style.fontSize = '2.2rem';
      
      // Quick Procedural emoji avatar representation
      let avatar = '👨‍🚀';
      if (skin.id === 'cyber_ninja') avatar = '🥷';
      if (skin.id === 'robo') avatar = '🤖';
      if (skin.id === 'solar_raider') avatar = '🤠';
      
      card.innerHTML = `
        <div>${avatar}</div>
        ${isEquipped ? '<span class="equipped-badge">Equipped</span>' : ''}
      `;

      card.addEventListener('click', () => {
        // Selection highlights
        const items = document.querySelectorAll('.skin-grid-item');
        items.forEach(i => i.classList.remove('selected'));
        card.classList.add('selected');
        
        this.selectPreviewSkin(skin.id);
      });

      grid.appendChild(card);
    }

    this.selectPreviewSkin(equipped);
  }

  selectPreviewSkin(skinId) {
    this.previewSkinId = skinId;
    const skin = this.skinsData.find(s => s.id === skinId);
    
    document.getElementById('preview-skin-name').innerText = skin.name;
    document.getElementById('preview-skin-desc').innerText = skin.desc;

    const costBlock = document.getElementById('skin-cost-container');
    const costVal = document.getElementById('preview-skin-cost');
    const selectBtn = document.getElementById('btn-select-skin');

    const unlocked = this.game.statsManager.data.unlockedSkins;
    const equipped = this.game.statsManager.equippedSkin;

    if (equipped === skinId) {
      costBlock.classList.add('hidden');
      selectBtn.innerText = "EQUIPPED";
      selectBtn.className = "btn btn-secondary";
      selectBtn.disabled = true;
    } else if (unlocked.includes(skinId)) {
      costBlock.classList.add('hidden');
      selectBtn.innerText = "EQUIP SUIT";
      selectBtn.className = "btn btn-primary";
      selectBtn.disabled = false;
    } else {
      costBlock.classList.remove('hidden');
      costVal.innerText = `🪙 ${skin.cost}`;
      
      // Check if user has enough credits
      const userCoins = this.game.statsManager.data.coins;
      if (userCoins >= skin.cost) {
        selectBtn.innerText = "BUY SUIT";
        selectBtn.className = "btn btn-primary btn-glow";
        selectBtn.disabled = false;
      } else {
        selectBtn.innerText = "LOCKED";
        selectBtn.className = "btn btn-secondary";
        selectBtn.disabled = true;
      }
    }
  }

  equipOrUnlockSkin(skinId) {
    const skin = this.skinsData.find(s => s.id === skinId);
    const unlocked = this.game.statsManager.data.unlockedSkins;

    if (unlocked.includes(skinId)) {
      this.game.statsManager.equippedSkin = skinId;
      this.selectPreviewSkin(skinId);
      this.renderSkinsPanel(); // Re-render grid badges
    } else {
      // Try purchase
      const success = this.game.statsManager.unlockSkin(skinId, skin.cost);
      if (success) {
        this.game.statsManager.equippedSkin = skinId;
        this.selectPreviewSkin(skinId);
        this.renderSkinsPanel();
        alert(`${skin.name} unlocked successfully!`);
      } else {
        alert("Insufficient credits to acquire skin!");
      }
    }
  }

  // --- Draw loop for Skin Preview Canvas panel ---
  runSkinPreviewLoop() {
    const draw = () => {
      if (this.screens.skins.classList.contains('active')) {
        this.skinsPreviewTimer += 0.05;
        this.drawSkinPreview();
      }
      requestAnimationFrame(draw);
    };
    draw();
  }

  drawSkinPreview() {
    const ctx = this.skinsPreviewCtx;
    const w = this.skinsPreviewCanvas.width;
    const h = this.skinsPreviewCanvas.height;

    ctx.clearRect(0, 0, w, h);
    
    // Draw sci-fi scanning light background lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    ctx.save();
    // Position character preview in center Y
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'rgba(6, 182, 212, 0.4)';
    
    // Setup dummy character rendering loop frames
    const dummyPlayer = {
      x: w / 2 - 27,
      y: 40,
      width: 54,
      height: 80,
      animTime: this.skinsPreviewTimer,
      state: 'RUNNING',
      isSliding: false,
      isGrounded: true,
      groundY: 120,
      // Pass rendering callbacks
      drawAstronaut: this.game.player.drawAstronaut,
      drawCyberNinja: this.game.player.drawCyberNinja,
      drawNeonRobo: this.game.player.drawNeonRobo,
      drawSolarRaider: this.game.player.drawSolarRaider,
      drawRoundedRect: this.game.player.drawRoundedRect,
      drawRunningLegs: this.game.player.drawRunningLegs
    };

    switch (this.previewSkinId) {
      case 'cyber_ninja':
        dummyPlayer.drawCyberNinja(ctx, dummyPlayer.x, dummyPlayer.y, dummyPlayer.width, dummyPlayer.height);
        break;
      case 'robo':
        dummyPlayer.drawNeonRobo(ctx, dummyPlayer.x, dummyPlayer.y, dummyPlayer.width, dummyPlayer.height);
        break;
      case 'solar_raider':
        dummyPlayer.drawSolarRaider(ctx, dummyPlayer.x, dummyPlayer.y, dummyPlayer.width, dummyPlayer.height);
        break;
      case 'astronaut':
      default:
        dummyPlayer.drawAstronaut(ctx, dummyPlayer.x, dummyPlayer.y, dummyPlayer.width, dummyPlayer.height);
        break;
    }

    ctx.restore();
  }
}

// Instantiate and start game engine loop upon complete DOM loading
window.addEventListener('DOMContentLoaded', () => {
  window.game = new Game();
});
