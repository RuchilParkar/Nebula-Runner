# 🚀 Nebula Run

### A Procedural Space-Themed Endless Runner Built with HTML5 Canvas & Vanilla JavaScript

Nebula Run is a feature-rich 2D endless runner that takes players on an infinite journey through dynamically generated worlds filled with hazards, collectibles, power-ups, achievements, and unlockable content.

Built entirely with HTML5 Canvas, CSS3, Vanilla JavaScript, and the Web Audio API, the game requires no external libraries, frameworks, image assets, or audio files. Every visual element, animation, particle effect, and sound is generated programmatically in real time.

---

# 🎮 Gameplay

Run as far as possible while avoiding obstacles, enemies, and dangerous terrain.

Collect credits and gems to unlock new character skins, activate powerful abilities, complete achievements, and challenge yourself with daily missions.

The game becomes progressively faster and more challenging the longer you survive.

---

# ✨ Features

## Core Gameplay

* Infinite procedural world generation
* Smooth physics-based movement
* Responsive controls
* Jump mechanic
* Double jump mechanic
* Slide mechanic
* Dynamic difficulty progression
* Increasing game speed over time
* Precise collision detection
* Endless replayability

---

## 🌍 Procedural World Generation

The game world is generated dynamically during runtime.

Features include:

* Infinite terrain generation
* Randomized obstacle placement
* Terrain gaps and pits
* Dynamic environmental decoration
* Balanced procedural spawning
* Endless scrolling world

No two runs are exactly the same.

---

## 🌅 Dynamic Day & Night Cycle

Experience a living world that changes over time.

Transitions include:

* Dawn
* Day
* Sunset
* Twilight
* Night

Environmental lighting adjusts automatically and stars become visible during nighttime gameplay.

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

---

## 🏜 Desert

Features:

* Bright sunlight
* Sand particles
* Heat atmosphere
* Wind effects

---

## ❄ Snow

Features:

* Snowfall particles
* Frozen landscapes
* Winter ambience
* Ice-themed visuals

---

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

---

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

---

## Gems

Rare collectible resource.

Features:

* Higher score value
* Special particle effects
* Achievement tracking

---

# ⚡ Power-Ups

Power-ups provide temporary advantages.

---

## 🛡 Shield

Protects the player from one collision.

Benefits:

* One-time damage absorption
* Visual shield effect
* Impact animation

---

## 🚀 Warp Boost

Temporarily increases movement speed.

Benefits:

* Invulnerability
* Increased scoring potential
* Enhanced visual effects

---

## 🧲 Gravity Core

Automatically attracts nearby collectibles.

Benefits:

* Coin attraction
* Gem attraction
* Increased collection efficiency

---

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

Nebula Run uses the Web Audio API to generate all sounds procedurally.

No audio files are required.

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

---

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

# 🏗 Architecture

## PRNG

Seedable pseudo-random number generator used for procedural generation and daily challenges.

---

## SoundManager

Responsible for:

* Music synthesis
* Sound effect generation
* Volume controls
* Audio scheduling

---

## InputHandler

Handles:

* Keyboard input
* Touch gestures
* Mobile interactions

---

## ParticleSystem

Responsible for:

* Weather effects
* Dust particles
* Sparkles
* Explosions

---

## Player

Handles:

* Physics
* Movement
* Animation
* Collision logic
* Power-up states

---

## Background

Handles:

* Day/night cycle
* Environmental rendering
* Parallax layers

---

## Terrain

Handles:

* Ground generation
* Pit generation
* Terrain segments

---

## Entity

Base class for all interactive game objects.

Extended by:

* Obstacles
* Enemies
* Collectibles
* Power-ups

---

## StatsManager

Responsible for:

* Data storage
* Statistics tracking
* Save management

---

## AchievementManager

Handles:

* Achievement tracking
* Unlock conditions
* Notifications

---

## UIManager

Responsible for:

* Menus
* HUD
* Shop interface
* Settings panels

---

## Game

Central controller responsible for:

* Main game loop
* State management
* Difficulty progression
* Entity updates
* Rendering pipeline

---

# 🚀 Installation

## Requirements

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

Any modern browser supporting HTML5 Canvas and ES6 JavaScript.

---

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

Developed by Ruchil as a showcase of modern browser-based game development using procedural generation, advanced JavaScript architecture, HTML5 Canvas rendering, and Web Audio synthesis technologies.
