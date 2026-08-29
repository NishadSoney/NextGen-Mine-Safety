# 🛡️ NextGen Safety | AI-Powered Mine Monitoring & Rescue Command Center

Welcome to **NextGen Safety**—a modern, intelligent command center designed to keep miners safe and coordinate rescue efforts in real-time. 

Mining is tough, dangerous work. We built this dashboard to give safety operators a clear, centralized view of everything happening underground. By bringing together live data from smart worker jackets, environmental sensors, and autonomous rescue bots, NextGen Safety ensures that when every second counts, you have the exact information you need to make life-saving decisions.

---

## 🌟 What It Does

### 🗺️ See Everything with the Tactical Mine Map
No more guessing where your teams are. Our interactive, multi-level map gives you a live look at the entire mine—from the shaft entrance down to the deep sub-tunnels. 
- **Track Everyone:** Watch live markers for your miners, rescue bots, and fixed gas sensors.
- **Find the Safest Way Out:** If an emergency hits, the system uses dynamic A* pathfinding to instantly map out the safest evacuation route, steering clear of collapsed tunnels or toxic gas plumes.
- **Ping to Locate:** Instantly highlight a specific worker or bot on the map with a glowing ping to find them in crowded or complex sectors.

### 👷 Keep Your Crew Safe (Worker Biometrics)
Every miner wears a Smart Safety Jacket that constantly feeds data back to the dashboard.
- **Live Vitals:** Monitor heart rate, oxygen levels ($\text{SpO}_2$), and body temperature in real-time with an animated ECG waveform.
- **Hazard Tracking:** Keep an eye on the micro-climate around each worker, tracking dangerous gases like Methane ($\text{CH}_4$) and Carbon Monoxide ($\text{CO}$).
- **Fall & Motion Detection:** Instantly know if a worker has stopped moving or taken a serious fall.
- **Smart Warnings:** The system automatically flags workers in "Warning" or "Critical" states. (You can also easily acknowledge and ignore these warnings once a situation is under control).

### 🤖 Send in the Bots (NextGen Bot-1)
When it's too dangerous for a human rescue team, deploy the NextGen Bot-1. 
- **Live Telemetry:** Monitor the bot's battery, signal latency, and heading.
- **Environmental Sniffer:** The bot carries its own gas sensors to scout ahead and report back on atmospheric conditions.
- **Drag & Drop Deployment:** Quickly deploy reserve bots (or workers) directly onto the map using the bottom Staging Dock.

### 🧠 AI That Anticipates Trouble
NextGen Safety doesn't just show you data; it helps you understand it. Our risk engine calculates a real-time risk score (0-100) for every worker by looking at their vitals, surrounding gas levels, and zone hazards. It can even predict anomalies like impending methane surges or cardiac distress before they become critical.

---

## 🛠️ Built With Modern Tech

We wanted this dashboard to be fast, reliable, and look incredibly sharp (because safety software shouldn't look like it was built in 1995).
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
cd ai-mine-safety-dashboard

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Then, just open [http://localhost:5173](http://localhost:5173) (or whichever port Vite gives you) in your browser and you're good to go!

---

## 📄 License
MIT License
