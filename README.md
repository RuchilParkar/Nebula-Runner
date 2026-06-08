# Nebula Run - 2D Endless Runner Game

An infinite space-themed odyssey built with HTML, CSS, and Vanilla JavaScript using the HTML5 Canvas API and Web Audio API. The game runs entirely in the browser with no external assets or package dependencies, utilizing high-quality procedural vector rendering and synth audio generation.

## 🚀 Features

### Core Gameplay
- **Physics Engine**: Smooth gravity, acceleration, and friction.
- **Movements**: Jumping, Double Jumping, and Sliding.
- **Dynamic Difficulty**: Scroll speed increases gradually the longer you survive.

### Environment & Themes
- **Procedural Hills**: Infinite terrain generation including pits (gaps).
- **Day/Night Cycle**: The sky dynamically changes through dawn, daytime, sunset, and twilight, affecting lighting and showing stars.
- **Parallax Scrolling**: Three independent layers for backgrounds (distant mountains, hills, trees, and sky features).
- **Multiple Theme Profiles**: Forest (rain), Desert (sunny wind), Snow (snowfall), and Cyberpunk (neon digital streams).

### Entities & Collisions
- **Obstacles**: Triangular spikes, double spikes, rocks, and logs.
- **Enemies**: Ground rolling robots and flying bat-drones moving in sine-waves.
- **Collectibles**: Credits (Coins) and high-value Gems.
- **Power-Ups**:
  - **Shield**: Protects from a single collision.
  - **Warp Boost**: Makes you run ultra-fast and invulnerable.
  - **Gravity Core (Magnet)**: Automatically attracts nearby coins/gems.
  - **Double Score**: Multiplies score points multiplier by 2.

### Metagame & Persistence
- **Hangar (Skins shop)**: Unlock and equip custom skins (Astronaut, Cyber-Ninja, Neon-Robo, Solar Raider) using credits. Includes a running animation preview!
- **Awards (Achievement system)**: Unlock 6 different awards tracking coins, score, jumps, and distance.
- **Telemetry (Statistics)**: Persistent tracking of runs, total distance, jumps, slides, and gems collected.
- **Daily Challenge Mode**: Generates a layout using a seed derived from today's date. The layout will be identical for everyone playing on the same day.
- **Local Storage**: Saves high scores, skins unlocked, active equipped skin, completed daily challenges, and achievements.

### Sound & Effects
- **Procedural Sound Effects**: Synthesized audio for jumps, coins, gems, power-ups, hits, and ambient soundtrack generated using Web Audio API oscillator nodes.
- **Mute & Volume Control**: Integrated sliders and buttons inside the settings HUD.
- **Particles**: Dust trails on jumps, landing impact sparks, coin collection sparkles, hit explosions, and weather effects.
- **Screen Shake**: Applied dynamically on player collision impact.

---

## 🕹️ Controls

### Keyboard Controls
- **Spacebar / Up Arrow**: Jump / Double Jump (if mid-air)
- **Down Arrow**: Slide (reduces collider height to glide under flying drones)

### Mobile Touch Controls
- **Tap**: Jump
- **Double Tap**: Double Jump
- **Swipe Down**: Slide

---

## 📂 Project Structure

```
EndLess Runner/
├── index.html       # Viewport structure, HUD displays, overlay panel models
├── style.css        # Responsive viewport layout, glassmorphism templates, animations
├── script.js        # Core game controllers, physics loops, audio synthesizers
└── README.md        # Setup, controls, and architecture documentation
```

### Script Architecture: Class Hierarchy

- **`PRNG`**: Seedable mulberry32 pseudo-random number generator.
- **`SoundManager`**: Synthesizes and schedules game music and sound effects on-the-fly using browser oscillator, gain, and filter nodes.
- **`InputHandler`**: Attaches listeners for keypresses and swipes, firing jumps and slides.
- **`ParticleSystem` & `Particle`**: Manages dust, impact rings, sparkles, explosion bursts, and weather particles.
- **`Player`**: Tracks character geometry, vertical physics, active power-up halos, and renders visual skins (Astronaut, Cyber Ninja, Neon Robo, Solar Raider).
- **`Background` & `Layer`**: Handles sky gradient blends, cloud arrays, stars, and scrolling parallax layers.
- **`Terrain`**: Procedural segment controller generating blocks and gaps (pits).
- **`Entity`**: Base parent class for `Obstacle`, `Enemy`, `Collectible`, and `PowerUp`.
- **`StatsManager`**: Handles read/write actions from browser LocalStorage.
- **`AchievementManager`**: Monitors stats and triggers achievement announcements.
- **`UIManager`**: Translates user menus, clicks, volume inputs, skin shops, and updates HUD progress meters.
- **`Game`**: The central controller managing state, game ticking loop, collision filters, and difficulty ramps.

---

## 🔧 Installation & Running

Since the game is completely self-contained:
1. Simply double-click `index.html` to open the game in any modern browser (Chrome, Firefox, Safari, Edge).
2. Alternatively, run a local web server (e.g., using VS Code's Live Server extension or running `npx serve .` in the terminal) to host it locally.
3. Enjoy!
