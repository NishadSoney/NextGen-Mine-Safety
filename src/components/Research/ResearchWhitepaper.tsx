import React, { useState } from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  FileText, 
  X, 
  Layers, 
  Cpu, 
  Database, 
  Radio, 
  Network, 
  Bot, 
  Activity, 
  Lock
} from 'lucide-react';

export const ResearchWhitepaper: React.FC = () => {
  const { isResearchOpen, setIsResearchOpen } = useMineSafety();
  const [activeSection, setActiveSection] = useState<string>('architecture');

  if (!isResearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto font-mono text-slate-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-2xl bg-[#080d1a] border border-cyan-500/50 shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-900/50 px-6 py-4 bg-[#0c1426]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white font-hud tracking-wide">
                AI SUBTERRANEAN MINE MONITORING & RESCUE SYSTEM: ARCHITECTURE WHITEPAPER
              </h2>
              <p className="text-xs text-slate-400">
                End-to-End Enterprise Systems Research • Protocols • IoT Telemetry • AI Engines
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsResearchOpen(false)}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Body with Sidebar Tabs */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-[#0a0f20] border-r border-slate-800 p-3 space-y-1 overflow-y-auto text-xs">
            <button
              onClick={() => setActiveSection('architecture')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'architecture'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>1. System Architecture</span>
            </button>

            <button
              onClick={() => setActiveSection('jackets')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'jackets'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>2. Smart Safety Jackets</span>
            </button>

            <button
              onClick={() => setActiveSection('robotics')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'robotics'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>3. Rescue Robot & UGV</span>
            </button>

            <button
              onClick={() => setActiveSection('protocols')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'protocols'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Network className="w-4 h-4 text-cyan-400" />
              <span>4. Protocols (MQTT/WS)</span>
            </button>

            <button
              onClick={() => setActiveSection('ai_engine')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'ai_engine'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Activity className="w-4 h-4 text-purple-400" />
              <span>5. AI Risk & Anomaly Engine</span>
            </button>

            <button
              onClick={() => setActiveSection('positioning')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'positioning'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Radio className="w-4 h-4 text-red-400" />
              <span>6. UWB Mapping & A* Path</span>
            </button>

            <button
              onClick={() => setActiveSection('database')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'database'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Database className="w-4 h-4 text-blue-400" />
              <span>7. Time-Series & Database</span>
            </button>

            <button
              onClick={() => setActiveSection('cybersecurity')}
              className={`w-full text-left px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeSection === 'cybersecurity'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>8. Cybersecurity & Offline</span>
            </button>
          </div>

          {/* Content Pane */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm leading-relaxed">
            {activeSection === 'architecture' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-cyan-300 font-hud border-b border-slate-800 pb-2">
                  1. Multi-Tier Subterranean System Architecture
                </h3>
                <p className="text-slate-300">
                  The AI Mine Safety System operates on a four-tier architecture designed specifically for harsh, explosion-prone subterranean environments (ATEX Zone-0 / Zone-1 compliant):
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">1</span>
                    <div>
                      <b className="text-white">Edge Sensor Tier:</b> Smart Safety Jackets (wearable PPG/ECG, NDIR CH4 sensors, 6-DoF IMU), stationary explosion-proof gas hubs, and autonomous UGV rovers.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">2</span>
                    <div>
                      <b className="text-white">Subterranean Mesh Network:</b> LoRaWAN 868/915 MHz long-range repeaters + UWB (Ultra-Wideband) anchors for sub-meter worker indoor positioning.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-amber-950 text-amber-400 flex items-center justify-center font-bold">3</span>
                    <div>
                      <b className="text-white">Edge Compute & Broker Tier:</b> Subterranean blast-hardened server running EMQX MQTT Broker, TimescaleDB, and on-premise AI Inference Engine.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded bg-purple-950 text-purple-400 flex items-center justify-center font-bold">4</span>
                    <div>
                      <b className="text-white">Surface Command Room HUD:</b> Real-time WebSockets dispatch dashboard with COD tactical radar map, live biometric stream, and A* evacuation pathfinder.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'jackets' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-emerald-300 font-hud border-b border-slate-800 pb-2">
                  2. Smart Safety Jacket Hardware & Sensor Integration
                </h3>
                <p className="text-slate-300">
                  Every miner wears an intrinsically safe (IS) smart jacket equipped with multi-sensor arrays powered by a 72-hour intrinsically safe LiFePO4 battery pack:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <b className="text-cyan-300 block mb-1">Cardiovascular & Oxygenation:</b>
                    Optical PPG + dry-electrode 2-lead ECG sensor measures Heart Rate (BPM), Heart Rate Variability (HRV), and Blood Oxygen Saturation (SpO2).
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <b className="text-red-400 block mb-1">Micro-Climate Gas Sniffing:</b>
                    Low-power NDIR sensor for Methane (CH4), electrochemical cells for Carbon Monoxide (CO), and solid-state O2 sensors.
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <b className="text-amber-300 block mb-1">Man-Down & Fall Detection:</b>
                    6-axis IMU (Accelerometer + Gyroscope) detects high-G impacts (&gt;5.0G) followed by inactivity, auto-triggering emergency beacon after 15 seconds.
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <b className="text-purple-300 block mb-1">Haptic & Audio Intercom:</b>
                    High-decibel bone-conduction audio receiver and directional vibration motors guide miners toward safe escape routes even in zero visibility.
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'robotics' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-amber-300 font-hud border-b border-slate-800 pb-2">
                  3. Autonomous Rescue Robot (UGV & Drone) Specifications
                </h3>
                <p className="text-slate-300">
                  The <b>AEGIS Titan MK-IV</b> is an explosion-proof (Ex d I Mb) tracked unmanned ground vehicle designed to enter hazardous or collapsed galleries:
                </p>

                <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300 bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <li><b>Thermal FLIR & Low-Light Night Vision:</b> Scans through thick coal dust and smoke to locate trapped miners via thermal heat signatures.</li>
                  <li><b>3D LiDAR SLAM:</b> Generates real-time 3D spatial point-cloud maps of unmapped or newly collapsed tunnels.</li>
                  <li><b>Sniffer Arm:</b> High-precision spectrometer detecting CH4, CO, CO2, H2S, and toxic gas pockets.</li>
                  <li><b>Emergency Payload:</b> Carries emergency oxygen self-rescuer packs (SCSR), trauma kit, and two-way mesh communication repeater.</li>
                </ul>
              </div>
            )}

            {activeSection === 'protocols' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-cyan-300 font-hud border-b border-slate-800 pb-2">
                  4. Real-Time Communication Protocols: MQTT & WebSockets
                </h3>
                <div className="space-y-3 text-xs">
                  <p className="text-slate-300">
                    Sub-second latency and zero packet loss are achieved using a hybrid publish-subscribe and full-duplex WebSocket architecture:
                  </p>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 font-mono">
                    <b className="text-cyan-400 block mb-1">MQTT Topic Architecture:</b>
                    <div className="text-slate-400 space-y-1">
                      <div><code>mine/telemetry/jacket/&#123;worker_id&#125;/vitals</code> (QoS 1, Every 1.0s)</div>
                      <div><code>mine/telemetry/robot/&#123;robot_id&#125;/telemetry</code> (QoS 0, 10 Hz)</div>
                      <div><code>mine/alerts/emergency/broadcast</code> (QoS 2, Exact Once Delivery)</div>
                    </div>
                  </div>

                  <p className="text-slate-300">
                    The control room dashboard connects to FastAPI/Node.js edge servers via <b>WebSockets (WSS)</b> with binary Protocol Buffers (Protobuf) serialization, maintaining sub-40ms update latencies.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'ai_engine' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-purple-300 font-hud border-b border-slate-800 pb-2">
                  5. AI Risk-Analysis & Hazard Prediction Pipeline
                </h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    The AI engine computes a dynamic composite risk index for each miner and mine sector using Multi-Criteria Decision Analysis (MCDA) and Long Short-Term Memory (LSTM) time-series forecasting:
                  </p>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                    <b className="text-purple-300 block mb-1">Mathematical Risk Scoring Model:</b>
                    <code className="text-cyan-300">
                      Risk = w1·HR_Anomaly + w2·SpO2_Deficit + w3·(CH4/LEL) + w4·CO_Toxicity + w5·Motionlessness + w6·ZoneInstability
                    </code>
                  </div>

                  <p>
                    <b>Predictive Gas Surge Anomaly Detection:</b> A lightweight edge LSTM neural network processes rolling 15-minute gas gradients and ventilation fan RPM to predict methane concentration spikes 3-5 minutes before they reach explosive thresholds.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'positioning' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-red-300 font-hud border-b border-slate-800 pb-2">
                  6. Subterranean Positioning (UWB) & A* Dynamic Pathfinding
                </h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    Since GPS cannot penetrate underground rock strata, the system employs <b>Ultra-Wideband (UWB) Time Difference of Arrival (TDoA)</b> combined with Dead Reckoning on smart jackets to achieve <b>±0.3m accuracy</b> throughout all shafts.
                  </p>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800">
                    <b className="text-red-400 block mb-1">Hazard-Weighted A* Pathfinding Algorithm:</b>
                    <p className="text-slate-300">
                      Standard shortest-path algorithms are insufficient during a mine crisis because the shortest path may traverse toxic methane plumes or collapsed tunnels. Our modified A* assigns massive weight penalties to gas concentrations, heat, and physical blockades:
                    </p>
                    <code className="text-emerald-400 block mt-1">
                      Cost(u, v) = Distance(u, v) × [ 1 + 5·(CH4_ppm/LEL) + 20·BlockedFlag + 3·HeatStrain ]
                    </code>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'database' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-blue-300 font-hud border-b border-slate-800 pb-2">
                  7. Database & Time-Series Data Infrastructure
                </h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    The storage tier is divided into two distinct high-performance databases:
                  </p>
                  <ul className="list-disc list-inside space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <li><b>TimescaleDB / InfluxDB:</b> Hypertables optimized for storing millions of biometric and gas telemetry datapoints per minute with automated 30-day compression and downsampling.</li>
                    <li><b>PostgreSQL + PostGIS:</b> Stores worker records, medical blood types, shift rosters, 3D mine tunnel topology graphs, and incident audit logs.</li>
                    <li><b>Redis In-Memory Cache:</b> Caches active worker positions and live alert states for instant sub-millisecond retrieval.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeSection === 'cybersecurity' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-rose-300 font-hud border-b border-slate-800 pb-2">
                  8. Cybersecurity, Offline Resilience & Local Edge Deployment
                </h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <p>
                    Mining infrastructure is classified as critical industrial infrastructure and requires zero-trust military-grade protection:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <b className="text-white block mb-1">100% Offline Edge Failover:</b>
                      If surface fiber-optic cables or satellite links are severed during an explosion, the underground Edge Server continues autonomous monitoring, local siren triggers, and robot rescue dispatch without interruption.
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                      <b className="text-white block mb-1">AES-256 Mesh Encryption:</b>
                      All LoRaWAN and UWB wireless communication packets are encrypted with rotating AES-GCM-256 keys to prevent eavesdropping or spoofing.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3 bg-[#0a0f20] text-xs">
          <span className="text-slate-400">AEGIS-MINE SYSTEM RESEARCH SPECIFICATION v3.4</span>
          <button
            onClick={() => setIsResearchOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono"
          >
            CLOSE WHITEPAPER
          </button>
        </div>
      </div>
    </div>
  );
};
