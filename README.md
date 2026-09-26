# 🛡️ JIVA | AI-Powered Mine Safety Monitoring & Rescue Command Center

Welcome to **JIVA**—a modern, intelligent command center designed to keep miners safe and coordinate rescue efforts in real-time.

Mining is tough, dangerous work. We built this dashboard to give safety operators a clear, centralized view of everything happening underground. By bringing together live data from worker tracking devices, beam-mounted sensor boxes, environmental monitoring stations, and autonomous rescue bots, JIVA ensures that when every second counts, you have the exact information you need to make life-saving decisions.

---

## 🌟 What It Does

### 🗺️ See Everything with the Tactical Mine Map
No more guessing where your teams are. Our interactive, multi-level map gives you a live look at the entire mine—from the shaft entrance down to the deep sub-tunnels. 
- **Track Everyone:** Watch live markers for your miners, rescue bots, beam sensors, and fixed gas sensors.
- **Find the Safest Way Out:** If an emergency hits, the system uses dynamic A* pathfinding to instantly map out the safest evacuation route, steering clear of collapsed tunnels or toxic gas plumes.
- **Ping to Locate:** Instantly highlight a specific worker, bot, or sensor on the map with a glowing ping.

### 👷 Keep Your Crew Safe (Worker Monitoring)
Each miner is tracked with essential data fed back to the dashboard:
- **Live Pulse Monitoring:** Monitor heart rate with an animated ECG waveform, plus SpO₂ and body temperature.
- **Location Tracking:** Real-time location within mine sectors with depth level information.
- **Mic & Camera Status:** See which workers have active audio and video channels for communication.
- **Smart Warnings:** The system automatically flags workers in "Warning" or "Critical" states based on vital signs and environmental conditions.

### 📡 Beam Sensor Boxes (Support Beam Monitoring)
Sensor boxes mounted on mine support beams constantly stream data to the control panel:
- **Structural Integrity:** Monitor strain (micro-strain), vibration, and tilt on every instrumented beam.
- **Environmental Sensing:** Each beam sensor tracks CH₄, CO, O₂, temperature, and humidity around it.
- **Real-time Alerts:** Any structural anomaly (excessive strain, tilt, or vibration) is instantly flagged.
- **Live Map Visualization:** Beam sensors appear as indigo markers on the tactical map.

### 🤖 Send in the Bots (JIVA-Bot1)
When it's too dangerous for a human rescue team, deploy the JIVA-Bot1. 
- **Live Telemetry:** Monitor the bot's battery, signal latency, and heading.
- **Environmental Sniffer:** The bot carries its own gas sensors to scout ahead and report back on atmospheric conditions.
- **Drag & Drop Deployment:** Quickly deploy reserve bots (or workers) directly onto the map using the bottom Staging Dock.

### 🧠 AI That Anticipates Trouble
JIVA doesn't just show you data; it helps you understand it. Our risk engine calculates a real-time risk score (0-100) for every worker by looking at their vitals, surrounding gas levels, and zone hazards. It can even predict anomalies like impending methane surges or cardiac distress before they become critical.

---

## 🛠️ Built With Modern Tech

We wanted this dashboard to be fast, reliable, and look incredibly sharp.
- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS (customized for that sleek, dark-mode tactical feel)
- **Icons**: Lucide React
- **Logic**: Custom hazard-weighted algorithms for pathfinding and risk assessment.

---

## 🚀 Get It Running

Want to spin it up yourself? It's easy.

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/NishadSoney/NextGen-Mine-Safety.git

# 2. Navigate to project directory
cd JIVA-dashboard

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Then, just open [http://localhost:5173](http://localhost:5173) (or whichever port Vite gives you) in your browser and you're good to go!

---

## 📄 License
MIT License
