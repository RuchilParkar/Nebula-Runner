# 🚀 Nebula Run - 2D Endless Runner Game

An immersive space-themed endless runner built entirely with **HTML5 Canvas**, **Vanilla JavaScript**, **CSS3**, and the **Web Audio API**. Navigate an ever-changing world, collect valuable resources, unlock futuristic skins, complete daily challenges, and survive as long as possible in an infinite procedural universe.

---

## 📖 Overview

Nebula Run is a browser-based endless runner that combines fast-paced action, procedural world generation, dynamic weather systems, collectible rewards, and progression mechanics into a polished gaming experience.

The entire game is rendered procedurally without external assets or dependencies. Graphics are generated using vector drawing techniques, while all sound effects and background audio are synthesized in real-time using the Web Audio API.

---

## ✨ Features

### 🎮 Core Gameplay

* Infinite side-scrolling gameplay
* Smooth physics-based movement system
* Jump and Double Jump mechanics
* Sliding mechanic for avoiding aerial hazards
* Dynamic difficulty scaling
* Increasing game speed based on survival time
* Collision detection system
* Responsive controls for desktop and mobile devices

---

### 🌍 Procedural Environment

* Infinite terrain generation
* Randomized obstacle placement
* Procedural pits and terrain gaps
* Day and night cycle
* Dynamic lighting transitions
* Animated sky system
* Twinkling stars and atmospheric effects

---

### 🎨 Parallax Background System

Multiple scrolling layers create depth and immersion:

* Distant Mountains
* Mid-ground Hills
* Foreground Trees
* Dynamic Sky Elements
* Clouds and Stars

Each layer scrolls independently to create a rich visual experience.

---

### 🌦 Theme System

Choose from multiple unique environments:

#### 🌲 Forest

* Rain effects
* Dense vegetation
* Atmospheric fog

#### 🏜 Desert

* Bright sunlight
* Wind particles
* Sandy landscape

#### ❄ Snow

* Continuous snowfall
* Frost effects
* Ice-themed visuals

#### 🌆 Cyberpunk

* Neon lighting
* Digital particles
* Futuristic atmosphere

---

## ⚠ Obstacles

Players must avoid a variety of hazards:

* Single Spikes
* Double Spikes
* Rocks
* Fallen Logs
* Terrain Gaps
* Rolling Robots
* Flying Drone Enemies

Obstacle frequency and complexity increase as the game progresses.

---

## 👾 Enemy Types

### Ground Robots

* Roll along terrain
* Increase speed over time

### Bat Drones

* Fly in sine-wave patterns
* Require precise timing to avoid
* Can be bypassed using the slide mechanic

---

## 💎 Collectibles

### Credits

Primary currency used for unlocking skins.

### Gems

Rare high-value collectibles worth bonus points.

Collectibles feature:

* Attraction effects
* Particle bursts
* Collection animations
* Audio feedback

---

## ⚡ Power-Up System

### 🛡 Shield

Absorbs one collision without ending the run.

### 🚀 Warp Boost

Provides temporary speed boost and invulnerability.

### 🧲 Gravity Core

Automatically attracts nearby collectibles.

### ✨ Double Score

Doubles all score gains while active.

Each power-up includes:

* Duration timer
* Visual indicators
* Particle effects
* Audio cues

---

## 🏆 Achievement System

Unlock achievements by completing milestones.

Examples include:

* First Run
* Coin Collector
* Gem Hunter
* Marathon Runner
* Jump Master
* High Score Champion

Achievement progress is automatically saved.

---

## 🎭 Hangar (Skin Shop)

Unlock and equip unique character skins using collected credits.

Available skins:

* Astronaut
* Cyber Ninja
* Neon Robo
* Solar Raider

Features:

* Purchase system
* Preview animations
* Persistent unlocks
* Equipped skin saving

---

## 📊 Statistics Tracking

Nebula Run records player progress across all sessions.

Tracked statistics include:

* Total Runs
* Total Distance
* Total Coins Collected
* Total Gems Collected
* Total Jumps
* Total Slides
* Highest Score
* Longest Survival Time

All data is stored locally.

---

## 📅 Daily Challenge Mode

A special game mode generated from the current date.

Features:

* Shared daily seed
* Identical challenge for all players
* Separate leaderboard tracking
* Daily completion rewards

Each day presents a new challenge configuration.

---

## 🔊 Audio System

All sounds are generated procedurally using the Web Audio API.

Includes:

* Background soundtrack
* Jump effects
* Coin collection sounds
* Gem collection sounds
* Power-up sounds
* Collision effects
* Achievement notifications

No audio files are required.

---

## ✨ Visual Effects

Nebula Run includes a rich visual effects system:

* Dust trails
* Landing impacts
* Coin sparkles
* Gem bursts
* Shield effects
* Weather particles
* Explosions
* Screen shake
* Dynamic lighting

---

## 📱 Controls

### Desktop

| Key                  | Action      |
| -------------------- | ----------- |
| Space                | Jump        |
| Up Arrow             | Jump        |
| Space / Up (Mid-Air) | Double Jump |
| Down Arrow           | Slide       |
| Esc                  | Pause       |

---

### Mobile

| Gesture    | Action      |
| ---------- | ----------- |
| Tap        | Jump        |
| Double Tap | Double Jump |
| Swipe Down | Slide       |

---

## 💾 Data Persistence

Game data is automatically stored using Local Storage.

Saved data includes:

* High Scores
* Statistics
* Achievements
* Unlocked Skins
* Equipped Skin
* Daily Challenge Progress
* Audio Settings

No account or internet connection is required.

---

## 🏗 Project Structure

```text
Nebula Run/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

### index.html

Responsible for:

* Game canvas
* HUD elements
* Menus
* Overlay screens
* Settings interface

### style.css

Responsible for:

* Responsive layouts
* Animations
* Glassmorphism UI
* Theme styling
* Mobile optimization

### script.js

Contains:

* Physics engine
* Rendering pipeline
* Entity systems
* Audio engine
* Game state management
* Save system
* User interface logic

---

## 🧩 Architecture

### Core Classes

#### PRNG

Seedable pseudo-random number generator used for deterministic world generation and daily challenges.

#### SoundManager

Handles procedural music and sound effect generation.

#### InputHandler

Processes keyboard, mouse, and touch controls.

#### ParticleSystem

Creates and manages visual effects.

#### Player

Handles movement, collisions, animations, and power-up interactions.

#### Background

Manages environmental visuals and day/night transitions.

#### Terrain

Generates procedural platforms and pits.

#### Entity

Base class for all interactive objects.

#### Obstacle

Manages environmental hazards.

#### Enemy

Controls enemy behavior and movement.

#### Collectible

Handles coins and gems.

#### PowerUp

Controls temporary gameplay enhancements.

#### StatsManager

Stores player statistics and progression.

#### AchievementManager

Tracks achievement completion.

#### UIManager

Controls menus, HUD, and settings.

#### Game

Primary game controller responsible for the game loop and overall state management.

---

## 🚀 Getting Started

### Requirements

* Modern Web Browser
* JavaScript Enabled

Supported Browsers:

* Chrome
* Edge
* Firefox
* Safari

### Run Locally

1. Clone the repository

```bash
git clone <repository-url>
```

2. Open the project folder

```bash
cd nebula-run
```

3. Open `index.html`

Or launch using a local development server:

```bash
npx serve
```

---

## 🎯 Future Enhancements

Planned features:

* Online Leaderboards
* Multiplayer Challenges
* Additional Themes
* Boss Encounters
* Seasonal Events
* New Power-Ups
* Character Progression System
* Cloud Save Support



---

## 👨‍💻 Author

Developed as a modern browser-based endless runner showcasing procedural generation, HTML5 Canvas rendering, game architecture design, and advanced JavaScript programming techniques.
