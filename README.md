# 🛡️ AEGIS-MINE | AI Subterranean Monitoring & Rescue Command Center

> A tactical, centralized AI-powered control room dashboard for subterranean mine safety, integrating real-time telemetry from **Smart Safety IoT Jackets**, **Fixed Mine Environmental Sensors**, and **Autonomous Rescue Robots (UGVs)**.

---

## 🌟 Key Features

- **🗺️ Call of Duty (COD) Tactical Mine Radar & Map**:
  - High-contrast tactical HUD with rotating 360° radar sweep beam, scanline overlay, and depth elevation tracks.
  - Interactive multi-level subterranean map (Shaft Entrance, Main Haulage, Active Longwall Face, Deep Sub-Tunnel 4B, Ventilation Exhaust Adit, Blast-Proof Refuge Chamber).
  - Dynamic entity markers for miners, rescue robots (with FOV camera cone), fixed gas sensors, and toxic gas plume heatmaps.
  - **A\* Dynamic Hazard Rescue Pathfinding**: Calculates and renders the safest evacuation corridor in glowing cyan/green, avoiding toxic gas plumes and collapsed corridors.

- **👷 Miner Biometrics & Smart Safety Jacket Telemetry**:
  - **Live Animated ECG Waveform Monitor**: Real-time Lead-II cardiac graph with dynamic P-Q-R-S-T profile.
  - **Live Biometrics**: Heart Rate (BPM), $\text{SpO}_2$ (%), Body Temperature (°C), micro-climate gas exposure ($\text{CH}_4$, $\text{CO}$, $\text{O}_2$), 6-axis fall/motion detection.
  - **Worker Management**: Add new miners with jacket pairing, blood type, emergency contact, and role; or safely evacuate/remove miners from active shifts.

- **🤖 Autonomous Rescue Robot (Titan MK-IV UGV) HUD**:
  - Simulated video feed with toggleable **Optical**, **Thermal FLIR**, and **LiDAR 3D Wireframe** modes.
  - Front atmospheric gas sniffer ($\text{CH}_4$, $\text{CO}$, $\text{O}_2$, $\text{H}_2\text{S}$) and 4-quadrant LiDAR obstacle clearance radar.
  - Manual D-pad teleoperation and autonomous patrol/dispatch modes.

- **🧠 Neural AI Risk Matrix & Hazard Prediction Engine**:
  - Multi-parametric composite risk scoring ($0-100$ index) combining vitals, gas toxicity, inactivity, and zone hazards.
  - LSTM predictive anomaly forecasts (early methane surge prediction, cardiac distress detection).
  - Control room emergency threat injector (*Methane Outbreak*, *Man Down / Fall Detected*, *Roof Collapse*, *Manual SOS Beacon*).

- **🔊 Tactical Web Audio Synthesizer**:
  - Synthesized tactical sound effects (radar ping, critical evacuation alarm klaxon, radio chatter bursts, click blips) with toggleable mute control.

- **📄 Integrated Technical Research & Architecture Hub**:
  - Complete whitepaper detailing MQTT topic trees, WebSocket pipelines, TimescaleDB time-series schemas, UWB indoor positioning, and zero-trust offline edge resilience.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Custom Tactical HUD & CRT Scanline Themes
- **Icons**: Lucide React
- **Audio**: Web Audio API (zero external assets required)
- **Pathfinding**: Hazard-weighted A* Graph Algorithm

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/<YOUR_USERNAME>/ai-mine-safety-dashboard.git

# 2. Navigate to project directory
cd ai-mine-safety-dashboard

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License
MIT License
