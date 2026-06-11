# Nebula Run - 2D Endless Runner Game

An infinite space-themed odyssey built with HTML, CSS, and Vanilla JavaScript using the HTML5 Canvas API and Web Audio API. The game runs entirely in the browser with no external assets or package dependencies, utilizing high-quality procedural vector rendering and synth audio generation.

**Developer:** Ruchil Parkar

---

## 🚀 Features

### Core Gameplay
* Smooth physics engine (gravity, velocity, friction)
* Core movements (jumping, double jumping, sliding)
* Dynamic difficulty scaling (speed increases over time)
* Interactive environment with hazards and enemies

---

## 🎨 Advanced Parallax Backgrounds

Multiple independent scrolling layers create depth and immersion.
Layers include:
* Sky
* Distant mountains
* Midground hills
* Foreground trees
* Atmospheric effects

Each layer moves at different speeds to simulate depth.

---

# 🌦 Environment Themes

Players can experience multiple visual environments.

## 🌲 Forest
Features:
* Rain effects
* Dense vegetation
* Natural color palette
* Atmospheric fog

## 🏜 Desert
Features:
* Bright sunlight
* Sand particles
* Heat atmosphere
* Wind effects

## ❄ Snow
Features:
* Snowfall particles
* Frozen landscapes
* Winter ambience
* Ice-themed visuals

## 🌆 Cyberpunk
Features:
* Neon lighting
* Digital particle streams
* Futuristic atmosphere
* Animated visual effects

---

# ⚠ Obstacles

Players must react quickly to avoid hazards.
Obstacle types:

### Single Spike
Basic hazard requiring a jump.

### Double Spike
Larger obstacle requiring precise timing.

### Rock
Ground obstacle that blocks movement.

### Log
Wide obstacle requiring jumps.

### Terrain Gap
Procedural pit requiring accurate jumps.

Obstacle frequency increases as difficulty rises.

---

# 👾 Enemies

## Ground Robot
A rolling robotic enemy that patrols the terrain.
Features:
* Ground-based movement
* Increasing speed over time
* Dynamic spawning

## Bat Drone
Flying enemy moving in wave patterns.
Features:
* Sine-wave movement
* Airborne collision zone
* Requires jumping or sliding to avoid

---

# 💰 Collectibles

## Credits
Primary in-game currency.
Used for:
* Unlocking skins
* Purchasing upgrades
* Progression rewards

## Gems
Rare collectible resource.
Features:
* Higher score value
* Special particle effects
* Achievement tracking

---

# ⚡ Power-Ups

Power-ups provide temporary advantages.

## 🛡 Shield
Protects the player from one collision.
Benefits:
* One-time damage absorption
* Visual shield effect
* Impact animation

## 🚀 Warp Boost
Temporarily increases movement speed.
Benefits:
* Invulnerability
* Increased scoring potential
* Enhanced visual effects

## 🧲 Gravity Core
Automatically attracts nearby collectibles.
Benefits:
* Coin attraction
* Gem attraction
* Increased collection efficiency

## ✨ Double Score
Doubles earned score while active.
Benefits:
* Faster progression
* Higher leaderboard potential
* Achievement assistance

---

# 🏆 Achievement System

Players unlock achievements by reaching milestones.
Examples include:
* First Run
* Distance Runner
* Coin Collector
* Gem Hunter
* Jump Master
* High Score Champion

Achievement progress is saved automatically.

---

# 🎭 Hangar (Skin Shop)

Unlock and equip unique player skins.
Available skins:

## 👨‍🚀 Astronaut
Default explorer suit.

## 🥷 Cyber Ninja
Stealth-inspired futuristic outfit.

## 🤖 Neon Robo
Advanced robotic skin with glowing accents.

## ☀ Solar Raider
Elite cosmic adventurer design.

Features:
* Unlock system
* Preview animations
* Persistent equipment
* Saved progression

---

# 📅 Daily Challenge Mode

A special game mode generated from the current date.
Features:
* Shared challenge for all players
* Deterministic procedural generation
* Unique challenge every day
* Completion tracking
* Daily rewards

Every player receives the same challenge on a given day.

---

# 📊 Statistics Tracking

The game records player progress across all sessions.
Tracked metrics include:
* Total runs
* Total distance traveled
* Highest score
* Total jumps
* Total slides
* Credits collected
* Gems collected
* Daily challenge completions
* Playtime statistics

All statistics are automatically saved.

---

# 🔊 Audio System

Nebula Run uses the Web Audio API to generate all sounds procedurally. No audio files are required.
Generated sounds include:
* Background music
* Jump sounds
* Landing effects
* Coin collection
* Gem collection
* Power-up activation
* Collision sounds
* Achievement notifications
* Ambient environmental effects

---

# ✨ Particle Effects

The game includes a comprehensive particle system.
Effects include:
* Dust trails
* Landing impacts
* Coin sparkles
* Gem bursts
* Shield particles
* Weather effects
* Explosion effects
* Energy trails

---

# 📳 Screen Effects

Visual feedback systems include:
* Screen shake
* Dynamic lighting
* Glow effects
* Motion feedback
* Impact animations
* Smooth transitions

---

# 🎮 Controls

## Desktop Controls

| Key                   | Action      |
| --------------------- | ----------- |
| Spacebar              | Jump        |
| Up Arrow              | Jump        |
| Space / Up (Airborne) | Double Jump |
| Down Arrow            | Slide       |
| Esc                   | Pause       |

## Mobile Controls

| Gesture    | Action      |
| ---------- | ----------- |
| Tap        | Jump        |
| Double Tap | Double Jump |
| Swipe Down | Slide       |

---

# 💾 Save System

Game progress is stored locally using browser Local Storage.
Saved data includes:
* High scores
* Statistics
* Achievements
* Unlocked skins
* Equipped skin
* Audio settings
* Daily challenge completion
* Player preferences

No account is required.

---

# 📂 Project Structure

```text
Nebula-Run/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 🛠️ Complete Technical API & Code Documentation

Below is a detailed breakdown of all classes, constructors, methods, and functions implemented inside [script.js](file:///c:/Users/ruchi/OneDrive/Desktop/EndLess%20Runner/script.js):

### 1. `PRNG` (Seedable Random Number Generator)
* **`constructor(seed)`**: Seeds a Mulberry32 algorithm sequence.
* **`next()`**: Returns the next pseudo-random float value between `0` (inclusive) and `1` (exclusive).
* **`range(min, max)`**: Generates a random floating-point number within a specified range `[min, max]`.
* **`choice(array)`**: Picks a random element from a given array.

### 2. `SoundManager` (Procedural Web Audio Synthesizer)
* **`constructor()`**: Initializes default volumes, mute toggles, tempo settings, and progression arrays.
* **`init()`**: Checks and spins up the browser `AudioContext` on first click/tap to resolve autoplay restrictions.
* **`setVolume(vol)`**: Sets the master audio gain volume cleanly using linear parameters.
* **`setMute(isMuted)`**: Toggles muting status by setting target gain node parameters.
* **`playJump()`**: Synthesizes a jump sound using a rising exponential frequency sweep (150Hz to 550Hz).
* **`playDoubleJump()`**: Synthesizes a double jump using a higher-frequency sine sweep (350Hz to 800Hz).
* **`playSlide()`**: Synthesizes a low slide sound using a descending sawtooth frequency sweep (100Hz to 60Hz) filtered by a lowpass node.
* **`playLand()`**: Synthesizes a low thud sound using a short triangle sweep (120Hz down to 40Hz) when the character lands.
* **`playCoin()`**: Synthesizes a gold coin chime by chaining two consecutive high-pitch sine frequencies.
* **`playGem()`**: Synthesizes a glowing gem arpeggio sound using quick ascending pitch waves.
* **`playPowerUp()`**: Synthesizes a power-up sequence by layering rising dual oscillator signals.
* **`playHit()`**: Synthesizes a crash sound utilizing a low-pass sweep filter and exponential gain decay.
* **`startMusic()`**: Starts background musical progression clock intervals using Web Audio nodes.
* **`stopMusic()`**: Stops background progression loops and drops active music notes immediately.
* **`playMusicStep()`**: Schedules procedural notes (bassline and lead melody chords) for the current step in the measure.

### 3. `InputHandler` (Keyboard & Touch Controls Interpreter)
* **`constructor(game)`**: Links the central game engine instance.
* **`initListeners()`**: Registers event listeners for browser key presses and canvas touch start/end swipe directions.
* **`handlePress(key)`**: Executes appropriate triggers (jump/slide) when keys are pressed down.
* **`handleRelease(key)`**: Terminates active behaviors (like stopping a slide) when control keys are released.

### 4. `Particle` (Visual Effect Particle)
* **`constructor(x, y, vx, vy, size, color, life, type)`**: Configures velocity vectors, colors, lifespan durations, and rendering types (dust, spark, snow, rain, neon).
* **`update(dt, speedMultiplier)`**: Moves the particle according to its coordinates, applies friction/gravity, and fades lifespan alpha values.
* **`draw(ctx)`**: Renders vectors on canvas context representing sparks, rain streaks, snow circles, or neon trail segments.

### 5. `ParticleSystem` (Manager for Environmental and Gameplay Effects)
* **`constructor(game)`**: Instantiates empty lists for tracking active particles.
* **`update(dt)`**: Ticks coordinate physics on all active particles, filters out expired ones, and caps total active count to `800` to prevent memory lag.
* **`draw(ctx)`**: Iterates over and draws each active particle on screen.
* **`clear()`**: Flushes all active particles.
* **`spawnJumpDust(x, y)`**: Generates friction dust clouds when player performs jump actions.
* **`spawnLandingSparks(x, y)`**: Spawns upward velocity sparks when player lands.
* **`spawnCoinCollect(x, y, isGem)`**: Spawns yellow/purple sparkles on collecting items.
* **`spawnHitExplosion(x, y)`**: Emits massive explosion particle clusters on crash impacts.
* **`spawnWeather(width, height, type)`**: Periodically spawns rainfall, snow layers, or cyber streaming lines depending on the theme.

### 6. `Player` (Runner Physics, Upgrades, & Costumes)
* **`constructor(game)`**: Binds constants, dimensions, base jump forces, state coordinates, and equipment skin properties.
* **`reset()`**: Restores baseline coordinates (`Y = 480`) and parameters to launch a new run.
* **`jump(forceDouble)`**: Elevates vertical velocity (`vy`) for jumps, double jumps, and fires corresponding particles and chimes.
* **`slide()`**: Activates slide postures, decreases hitbox height, and plays slide sound effects.
* **`stopSlide()`**: Terminates slide statuses and returns hitbox dimensions to default.
* **`getCollider()`**: Calculates player bounding box dimensions adjusted for standing/sliding states to check collisions.
* **`update(dt)`**: Handles gravity pulls, boundary landing thresholds, slide timeouts, and active speed wind rotations.
* **`draw(ctx)`**: Invokes assigned skin drawing handlers and overlays active upgrades (Shield bubbles, speed gusts).
* **`drawAstronaut(ctx, x, y, w, h)`**: Renders the default space suit skin.
* **`drawCyberNinja(ctx, x, y, w, h)`**: Renders the carbon-fiber ninja suit.
* **`drawNeonRobo(ctx, x, y, w, h)`**: Renders the glowing robo skin.
* **`drawSolarRaider(ctx, x, y, w, h)`**: Renders the warm-gradient scavenger armor skin.
* **`drawRunningLegs(ctx, x, y, w, h, color)`**: Synthesizes leg cycles using sine waves based on animation frame ticks.

### 7. `Layer` (Horizontal Parallax Background Layer)
* **`constructor(game, y, height, speedFactor, drawCallback)`**: Setup horizontal coordinate repeat structures and speed ratios.
* **`update(dt, scrollSpeed)`**: Moves parallax coordinates to the left to loop backgrounds infinitely.
* **`draw(ctx)`**: Invokes the drawing callback to render infinite repeats of background segments.

### 8. `Background` (Dynamic Weather, Celestial Cycles & Scenery)
* **`constructor(game)`**: Seeds stars, clouds, and instantiates Layer queues for mountains.
* **`generateStars()`**: Randomizes and stores stars coordinates.
* **`generateClouds()`**: Seeds coordinates and dimensions of scrolling clouds.
* **`initLayers()`**: Registers procedural ridge callbacks for parallax mountain layers.
* **`drawTreeSilhouette(ctx, x, y)`**: Draws forest pine tree structures.
* **`drawCactusSilhouette(ctx, x, y)`**: Draws desert cactus structures.
* **`blendColors(c1, c2, f)`**: Blends hex colors representing day cycles.
* **`update(dt, scrollSpeed)`**: Shifts cloud arrays, twinkles stars, and ticks background mountain layers.
* **`drawSky(ctx, width, height)`**: Generates and draws time-of-day sky gradients.
* **`draw(ctx)`**: Combines sky backgrounds, stars, clouds, sun/moon positioning, and parallax mountain layers.

### 9. `Terrain` (Procedural Segment Generator)
* **`constructor(game)`**: Seeds the terrain segment dimensions.
* **`init()`**: Fills screen blocks dynamically with initial flat solid ground structures.
* **`update(dt, scrollSpeed)`**: Shifts segments left, deletes offscreen ground blocks, and procedurally determines terrain gaps (pits) using seed rules.
* **`isPlayerOnGround(player)`**: Validates if the horizontal footprint of the player sits on solid ground segments (non-gaps).
* **`draw(ctx)`**: Draws solid ground fills, glowing neon top borders, and Cyberpunk grid lines.

### 10. `Entity` (Parent Sprite)
* **`constructor(game, x, y, width, height, type)`**: Configures base coordinates and type descriptors.
* **`update(dt, scrollSpeed)`**: Slides coordinates to the left relative to scene speed.
* **`checkCollision(rect)`**: Resolves basic rectangular overlaps between player hitboxes and sprites.
* **`isOffscreen()`**: Returns `true` if the entity is fully past the left side of the screen.

### 11. `Obstacle` (Ground Hazards)
* **`constructor(game, x, subType)`**: Establishes dimensions for spikes, rock piles, or logs.
* **`draw(ctx)`**: Renders vector paths for spikes, rock polygons, or circular cap barrel logs.

### 12. `Enemy` (Interactive Threats)
* **`constructor(game, x, subType)`**: Sets patrol speeds and flying flags.
* **`update(dt, scrollSpeed)`**: Scrolls positions and applies sine-wave hover paths to flying drones.
* **`draw(ctx)`**: Renders robotic wheels, glowing eye lines, drone wings, and camera lenses.

### 13. `Collectible` (Items)
* **`constructor(game, x, y, isGem)`**: Configures size scales and values (5 points per standard coin, 25 points per gem).
* **`update(dt, scrollSpeed)`**: Adjusts coordinates using scroll speed, or calculates acceleration vectors toward the player if the Magnet PowerUp is active.
* **`draw(ctx)`**: Draws gold spinning coin polygons with embossed letter "N" or faceted amethyst gemstones.

### 14. `PowerUp` (Temporary Upgrades)
* **`constructor(game, x, y, subType)`**: Configures active type states (Shield, speed core, magnet pull, multiplier).
* **`update(dt, scrollSpeed)`**: Adds soft vertical bobbing vectors and scrolls left.
* **`draw(ctx)`**: Renders glowing circular containment field halos and upgrades icons.

### 15. `StatsManager` (Local Storage Database)
* **`constructor()`**: Setup schemas and triggers persistent file loads.
* **`load()`**: Safely checks and parses stats from `localStorage` under keys `nebulas_run_data` (handles private browser errors).
* **`save()`**: Saves current statistics data to `localStorage`.
* **`equippedSkin` (Getter/Setter)**: Reads or updates currently equipped skin tags in the database.
* **`addStat(key, amount)`**: Increments numerical statistics columns (runs, distances, coins, jumps, slides).
* **`updateHighScore(score)`**: Compares and saves high score milestones.
* **`unlockSkin(skinId, cost)`**: Purchases character costumes by verifying balance limits.
* **`wipeData()`**: Wipes stats, credits, achievements, and active skin selections from database storage.

### 16. `AchievementManager` (Achievement Evaluator)
* **`constructor(game)`**: Details achievement requirements, counts, and unlocks.
* **`loadUnlocked()`**: Safely checks and loads unlocked achievements lists from `localStorage`.
* **`saveUnlocked()`**: Saves active achievements lists to `localStorage`.
* **`checkAchievements()`**: Loops through achievements to unlock them when metrics are met.

### 17. `UIManager` (State Navigation Panels & HUD)
* **`constructor(game)`**: Links DOM overlay nodes.
* **`initListeners()`**: Configures click/input listeners for menus, toggle buttons, and upgrade grids.
* **`showMenu(screenId)`**: Controls overlays (main, pause, game-over, settings, stats, achievements, skins).
* **`onRunStarted()`**: Shows the HUD panel and clears active power-up progress bars.
* **`onPauseState(isPaused)`**: Toggles overlays and visual indicator bars.
* **`onGameOver(score, distance, coins, wasNewHigh)`**: Renders stats summaries and high score badges.
* **`updateHUD(score, distance, coins)`**: Formats HUD values.
* **`createPowerupTimer(type, duration)`**: Inserves and controls HUD timer countdown bars.
* **`renderSkinsPanel()`**: Refreshes skin store grids (purchase cost, locked flags, select states).
* **`selectPreviewSkin(skinId)`**: Activates skin previews in the hangar page.
* **`renderAchievementsPanel()`**: Refreshes rewards lists.
* **`renderStatsPanel()`**: Refreshes metrics tables.
* **`runSkinPreviewLoop()`**: Runs preview panel frames.
* **`drawSkinPreview()`**: Draws preview assets in the hangar canvas.

### 18. `Game` (Central Engine Loop Controller)
* **`constructor()`**: Initializes managers, registers resize listeners, and mounts loop tasks.
* **`setTheme(themeId)`**: Changes ground colors and active weather streams.
* **`resizeCanvas()`**: Adjusts the canvas sizing to fit container boundaries while maintaining a 16:9 ratio.
* **`triggerScreenShake(duration)`**: Sets container CSS animation parameters to shake on crashes.
* **`initSeededRun()`**: Computes unique seed parameters based on date values for daily runs.
* **`startRun()`**: Sets default parameters and fills the track layout to launch a run.
* **`crash()`**: Triggers game over overlays, halts loop updates, and auto-saves run stats.
* **`pause()`**: Stops loop ticks.
* **`resume()`**: Re-engages loop ticks.
* **`quitToMenu()`**: Returns the player to the menu.
* **`loop(time)`**: Central game frame loop tracking frame rate steps.
* **`update(dt)`**: Runs active tick sequences for difficulty scaling, weather, particles, and character actions.
* **`updateEntities(dt, finalSpeed)`**: Updates coordinate offsets for hazards and checks overlap collisions.
* **`handleEntityCollision(ent)`**: Processes item collections and checks obstacle hits.
* **`spawnNextEntities()`**: Determines spawning of obstacles, enemies, coins, or power-ups based on difficulty levels.

---

# 🚀 Installation

## Requirements
* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

Any modern browser supporting HTML5 Canvas and ES6 JavaScript.

## Run Locally
Clone the repository:
```bash
git clone <repository-url>
```
Navigate to the project:
```bash
cd Nebula-Run
```
Launch a local server:
```bash
npx serve
```
Or simply open:
```text
index.html
```
in your browser.

---

# 📈 Future Improvements

Potential future additions:
* Online leaderboards
* Multiplayer challenges
* Seasonal events
* Boss encounters
* New environments
* Additional skins
* More achievements
* Cloud save functionality
* Custom game modes

---

# 📜 Copyright & Usage

© 2026 Ruchil Parkar. All Rights Reserved.

This project and its source code are proprietary and protected by copyright law.
Permission is granted to view and play the game for personal and educational purposes only.

You may not:
* Copy or redistribute the source code
* Modify or create derivative works
* Reuse game systems or mechanics in other projects
* Reproduce any part of this project without permission
* Commercially exploit this project

Unauthorized use, reproduction, or distribution of any portion of this project is strictly prohibited.

---

# 👨‍💻 Developer

Developed by Ruchil Parkar as a showcase of modern browser-based game development using procedural generation, advanced JavaScript architecture, HTML5 Canvas rendering, and Web Audio synthesis technologies.
