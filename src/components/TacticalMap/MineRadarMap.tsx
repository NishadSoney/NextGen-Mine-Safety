import React, { useState, useRef, useEffect } from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { soundFX } from '../../utils/soundEffects';
import { Bot, User, Radio, Flame, TriangleAlert, Compass, Crosshair } from 'lucide-react';
import { Worker } from '../../types';

interface MineRadarMapProps {
  showControls?: boolean;
  compact?: boolean;
}

export const MineRadarMap: React.FC<MineRadarMapProps> = ({ compact = false }) => {
  const {
    workers,
    zones,
    robot,
    fixedSensors,
    activeRescueRoute,
    radarSweepAngle,
    selectWorker,
    selectRobot,
    selectedWorker,
    selectedRobot,
    isRobotDeployed,
    pingedEntityId,
    dispatchRobotToWorker,
    botSpeedMultiplier,
    setBotSpeedMultiplier
  } = useMineSafety();

  const [hoveredWorker, setHoveredWorker] = useState<Worker | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showGasPlumes, setShowGasPlumes] = useState<boolean>(true);
  const [showSensors, setShowSensors] = useState<boolean>(true);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showRadarSweep, setShowRadarSweep] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger sound when hovering worker
  const handleWorkerHover = (worker: Worker | null) => {
    setHoveredWorker(worker);
    if (worker) {
      soundFX.playBlip();
    }
  };

  const handleWorkerClick = (worker: Worker) => {
    soundFX.playRadioBurst();
    selectWorker(worker);
  };

  const handleRobotClick = () => {
    soundFX.playRadioBurst();
    selectRobot(robot);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full rounded-xl overflow-hidden border border-cyan-900/60 bg-[#070b14] select-none shadow-[0_0_50px_rgba(0,0,0,0.5)] ${
        compact ? 'h-[440px]' : 'h-full min-h-[500px]'
      }`}
    >
      {/* Background Tactical Grid & Scanline FX */}
      <div className="absolute inset-0 bg-[radial-gradient(#16243b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

      {/* Top Left HUD Corner Widget: Tactical Coordinate & Elevation Tracker */}
      <div className="absolute top-3 left-3 z-20 flex flex-col space-y-1 text-[11px] font-mono pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-950/80 border border-cyan-500/40 px-2.5 py-1 rounded backdrop-blur-md text-cyan-300">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400 animate-spin [animation-duration:12s]" />
          <span>GRID: <b className="text-white">32U-NV-9042</b></span>
          <span className="text-slate-600">|</span>
          <span>DEPTH: <b className="text-cyan-400">-50m to -480m</b></span>
        </div>
        <div className="flex items-center space-x-2 bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded text-slate-400">
          <span>OPERATIONAL MESH: <b>LORA-UWB v4.2</b></span>
        </div>
      </div>

      {/* Top Right HUD Corner: Compass / Radar Orientation */}
      <div className="absolute top-3 right-3 z-20 flex items-center space-x-2">
        <div className="bg-slate-950/85 border border-cyan-500/40 px-3 py-1.5 rounded-lg flex items-center space-x-2 text-xs font-mono backdrop-blur-md">
          <Compass className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-slate-300">NORTH: <b className="text-cyan-300">000° TACTICAL</b></span>
        </div>
      </div>

      {/* Bottom Floating Map Layers Toolbar */}
      <div className="absolute bottom-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-slate-950/85 border border-slate-800/80 px-2.5 py-1.5 rounded-lg backdrop-blur-md text-[11px] font-mono">
        <button
          onClick={() => setShowGasPlumes(!showGasPlumes)}
          className={`px-2 py-1 rounded border transition-all ${
            showGasPlumes
              ? 'bg-amber-950/70 border-amber-500/60 text-amber-300'
              : 'bg-slate-900/50 border-slate-700 text-slate-400'
          }`}
        >
          GAS HEATMAP: {showGasPlumes ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => setShowSensors(!showSensors)}
          className={`px-2 py-1 rounded border transition-all ${
            showSensors
              ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300'
              : 'bg-slate-900/50 border-slate-700 text-slate-400'
          }`}
        >
          SENSORS: {showSensors ? 'ON' : 'OFF'}
        </button>

        <button
          onClick={() => setShowRadarSweep(!showRadarSweep)}
          className={`px-2 py-1 rounded border transition-all ${
            showRadarSweep
              ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
              : 'bg-slate-900/50 border-slate-700 text-slate-400'
          }`}
        >
          RADAR SWEEP: {showRadarSweep ? 'ON' : 'OFF'}
        </button>

        <div className="flex items-center space-x-1 pl-2 border-l border-slate-800">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="w-6 h-6 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:text-cyan-400 font-bold flex items-center justify-center"
            title="Zoom In"
          >
            +
          </button>
          <span className="text-slate-400 px-1">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="w-6 h-6 rounded bg-slate-900 border border-slate-700 text-slate-200 hover:text-cyan-400 font-bold flex items-center justify-center"
            title="Zoom Out"
          >
            -
          </button>
        </div>

        {/* Bot Speed Controls */}
        <div className="flex items-center space-x-1 pl-2 ml-1 border-l border-slate-800">
          <span className="text-slate-400 font-bold pr-1 text-[10px]">BOT SPEED:</span>
          {[1, 2, 4, 6].map((speed) => (
            <button
              key={speed}
              onClick={() => setBotSpeedMultiplier(speed)}
              className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[10px] transition-all ${
                botSpeedMultiplier === speed
                  ? 'bg-cyan-500 text-black shadow-[0_0_10px_rgba(0,240,255,0.4)] border border-cyan-400'
                  : 'bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-700'
              }`}
              title={`Set Bot Speed to ${speed}x`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Tactical SVG Map Canvas */}
      <div 
        className="w-full h-full flex items-center justify-center transition-transform duration-300 origin-center"
        style={{ transform: `scale(${zoomLevel})` }}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full max-w-[1000px] max-h-[700px] overflow-visible"
        >
          <defs>
            {/* Tactical Linear and Radial Gradients */}
            <radialGradient id="radarSweepGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.3" />
              <stop offset="60%" stopColor="#00f0ff" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="corridorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.8" />
            </linearGradient>

            <linearGradient id="rescueRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00ff88" />
              <stop offset="50%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <radialGradient id="methaneGasPlume" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff3366" stopOpacity="0.55" />
              <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
            </radialGradient>

            <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 1. Radar Circular Range Rings (COD Tactical Radar) */}
          <circle cx="500" cy="350" r="320" fill="none" stroke="#1e2d4a" strokeWidth="1.5" strokeDasharray="6 6" />
          <circle cx="500" cy="350" r="220" fill="none" stroke="#1e2d4a" strokeWidth="1.5" />
          <circle cx="500" cy="350" r="110" fill="none" stroke="#1e2d4a" strokeWidth="1" strokeDasharray="4 4" />
          <line x1="500" y1="30" x2="500" y2="670" stroke="#16233b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="180" y1="350" x2="820" y2="350" stroke="#16233b" strokeWidth="1" strokeDasharray="3 3" />

          {/* 2. Rotating COD-Style Radar Sweep Line */}
          {showRadarSweep && (
            <g transform={`rotate(${radarSweepAngle}, 500, 350)`}>
              <line x1="500" y1="350" x2="500" y2="30" stroke="#00f0ff" strokeWidth="2.5" opacity="0.8" filter="url(#neonGlow)" />
              <path
                d="M 500 350 L 500 30 A 320 320 0 0 1 660 72 Z"
                fill="url(#radarSweepGrad)"
              />
            </g>
          )}

          {/* 3. Mine Sector Polygons & Underground Drift Tunnels */}
          {zones.map((zone) => {
            const isCritical = zone.status === 'critical';
            const isWarning = zone.status === 'warning';
            const points = zone.polygon.map(([x, y]) => `${x},${y}`).join(' ');

            return (
              <g key={zone.id} className="cursor-pointer group">
                {/* Sector Floor Outline */}
                <polygon
                  points={points}
                  fill={isCritical ? '#3b0d18' : isWarning ? '#261b0a' : '#0d1628'}
                  fillOpacity={isCritical ? 0.75 : 0.55}
                  stroke={isCritical ? '#ff3366' : isWarning ? '#f59e0b' : '#1e3a5f'}
                  strokeWidth={isCritical ? 2.5 : 1.5}
                  strokeDasharray={zone.isBlocked ? '6 4' : undefined}
                  className="transition-colors duration-300"
                />

                {/* Blocked Passage Hazard Stripes */}
                {zone.isBlocked && (
                  <g>
                    <line x1={zone.polygon[0][0]} y1={zone.polygon[0][1]} x2={zone.polygon[2][0]} y2={zone.polygon[2][1]} stroke="#ff3366" strokeWidth="2" strokeDasharray="8 6" />
                    <line x1={zone.polygon[1][0]} y1={zone.polygon[1][1]} x2={zone.polygon[3][0]} y2={zone.polygon[3][1]} stroke="#ff3366" strokeWidth="2" strokeDasharray="8 6" />
                    <text
                      x={zone.center[0]}
                      y={zone.center[1] + 15}
                      fill="#ff3366"
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                      className="animate-pulse"
                    >
                      ⚠️ PASSAGE BLOCKED
                    </text>
                  </g>
                )}

                {/* Sector Label & Depth Level */}
                <text
                  x={zone.center[0]}
                  y={zone.center[1] - 22}
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="'Chakra Petch', sans-serif"
                  fontWeight="bold"
                  letterSpacing="1"
                  textAnchor="middle"
                  className="pointer-events-none uppercase"
                >
                  {zone.code}: {zone.name}
                </text>
                <text
                  x={zone.center[0]}
                  y={zone.center[1] - 8}
                  fill="#64748b"
                  fontSize="9"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="pointer-events-none"
                >
                  DEPTH {zone.depthLevel}m | CH4: {zone.ch4Level}%
                </text>
              </g>
            );
          })}

          {/* 4. Subterranean Haulage Drift & Escape Corridors */}
          {showCorridors && (
            <g opacity="0.75">
              {/* Primary Shaft Connection lines */}
              <line x1="170" y1="115" x2="430" y2="165" stroke="#00f0ff" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
              <line x1="430" y1="165" x2="750" y2="175" stroke="#00f0ff" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
              <line x1="430" y1="165" x2="450" y2="280" stroke="#00f0ff" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
              <line x1="450" y1="280" x2="600" y2="440" stroke="#00f0ff" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
              <line x1="600" y1="440" x2="745" y2="485" stroke="#00f0ff" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
              <line x1="450" y1="280" x2="370" y2="420" stroke="#00f0ff" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
              <line x1="370" y1="420" x2="190" y2="485" stroke="#00f0ff" strokeWidth="6" strokeOpacity="0.25" strokeLinecap="round" />
              <line x1="190" y1="485" x2="135" y2="485" stroke="#00f0ff" strokeWidth="8" strokeOpacity="0.35" strokeLinecap="round" />
            </g>
          )}

          {/* 5. Animated Toxic Methane & CO Plume Overlay */}
          {showGasPlumes && (
            <g>
              {/* Sector 3 High Methane Cluster */}
              <circle
                cx="770"
                cy="510"
                r="95"
                fill="url(#methaneGasPlume)"
                className="animate-pulse"
              />
              <text x="770" y="550" fill="#f87171" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                ⚠️ CH4 PLUME CONCENTRATION: 1.15% - 2.1%
              </text>

              {/* Sector 2 Moderate Outgassing */}
              <circle
                cx="740"
                cy="190"
                r="65"
                fill="#f59e0b"
                fillOpacity="0.15"
              />
            </g>
          )}

          {/* 6. AI-Calculated Safest Rescue Route (Glowing Cyan / Green Trail) */}
          {activeRescueRoute && activeRescueRoute.length > 1 && (
            <g>
              {/* Route Outer Glow */}
              <polyline
                points={activeRescueRoute.map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none"
                stroke="#00ff88"
                strokeWidth="10"
                strokeOpacity="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#neonGlow)"
              />
              {/* Route Main Animated Dashed Line */}
              <polyline
                points={activeRescueRoute.map(([x, y]) => `${x},${y}`).join(' ')}
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="8 6"
                className="animate-[dash_1s_linear_infinite]"
              />
              {/* Target Arrival Marker */}
              {activeRescueRoute.length > 0 && (
                <g transform={`translate(${activeRescueRoute[activeRescueRoute.length - 1][0]}, ${activeRescueRoute[activeRescueRoute.length - 1][1]})`}>
                  <circle r="14" fill="none" stroke="#00ff88" strokeWidth="2" className="animate-ping" />
                  <circle r="6" fill="#00ff88" />
                </g>
              )}
            </g>
          )}

          {/* 7. Fixed Environmental / Gas Sensor Nodes */}
          {showSensors && fixedSensors.map((sensor) => {
            const isWarn = sensor.status === 'warning';
            return (
              <g key={sensor.id} transform={`translate(${sensor.x}, ${sensor.y})`} className="cursor-pointer">
                <rect
                  x="-8"
                  y="-8"
                  width="16"
                  height="16"
                  fill="#0b1329"
                  stroke={isWarn ? '#f59e0b' : '#38bdf8'}
                  strokeWidth="1.5"
                  transform="rotate(45)"
                />
                <circle r="3" fill={isWarn ? '#f59e0b' : '#00f0ff'} />
                <text
                  x="0"
                  y="18"
                  fill="#94a3b8"
                  fontSize="8"
                  fontFamily="monospace"
                  textAnchor="middle"
                  className="bg-black/80"
                >
                  {sensor.id} ({sensor.ch4}%)
                </text>
              </g>
            );
          })}

          {/* 8. Rescue Robot Marker & Dynamic FOV Sensor Cone (COD Style UGV) */}
          {isRobotDeployed && (
            <g 
              transform={`translate(${robot.x}, ${robot.y})`}
              onClick={handleRobotClick}
              className="cursor-pointer group"
            >
              {/* Robot FOV Camera Cone */}
              <path
                d="M 0 0 L -35 -80 A 90 90 0 0 1 35 -80 Z"
                fill="#00f0ff"
                fillOpacity="0.12"
                stroke="#00f0ff"
                strokeWidth="1"
                strokeDasharray="3 3"
                transform={`rotate(${robot.heading + 90})`}
              />

              {/* Selection Marker */}
              {selectedRobot?.id === robot.id && (
                <circle
                  r="24"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2.5"
                  strokeDasharray="5 4"
                  className="animate-spin"
                  filter="url(#neonGlow)"
                />
              )}

              {/* Ping Marker */}
              {pingedEntityId === robot.id && (
                <circle
                  r="45"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="4"
                  className="animate-ping"
                  filter="url(#neonGlow)"
                />
              )}

              {/* Robot Outer Tactical Ring */}
              <circle
                r="18"
                fill="#07152b"
                stroke="#00f0ff"
                strokeWidth="2"
                filter="url(#neonGlow)"
              />

              {/* Robot Heading Pointer */}
              <polygon
                points="0,-12 6,4 0,1 -6,4"
                fill="#00f0ff"
                transform={`rotate(${robot.heading + 90})`}
              />

              <text
                x="0"
                y="-22"
                fill="#00f0ff"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
                className="bg-black/90 px-1"
              >
                🤖 {robot.id}
              </text>
            </g>
          )}

          {/* 9. Miner / Worker Dynamic Markers with Pulsing Health Rings */}
          {workers.map((worker) => {
            const isCritical = worker.status === 'critical';
            const isWarning = worker.status === 'warning';
            const isSelected = selectedWorker?.id === worker.id;

            const ringColor = isCritical ? '#ff3366' : isWarning ? '#ffb703' : '#00ff88';

            return (
              <g
                key={worker.id}
                transform={`translate(${worker.x}, ${worker.y})`}
                onClick={() => handleWorkerClick(worker)}
                onMouseEnter={() => handleWorkerHover(worker)}
                onMouseLeave={() => handleWorkerHover(null)}
                className="cursor-pointer group"
              >
                {/* Critical / SOS Pulsing Halo */}
                {(isCritical || worker.sosActive || worker.fallDetected) && (
                  <circle
                    r="22"
                    fill="none"
                    stroke="#ff3366"
                    strokeWidth="2.5"
                    className="animate-ping"
                  />
                )}

                {/* Selection Marker */}
                {isSelected && (
                  <circle
                    r="22"
                    fill="none"
                    stroke="#00f0ff"
                    strokeWidth="2.5"
                    strokeDasharray="5 4"
                    className="animate-spin"
                    filter="url(#neonGlow)"
                  />
                )}

                {/* Ping Marker */}
                {pingedEntityId === worker.id && (
                  <circle
                    r="45"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="4"
                    className="animate-ping"
                    filter="url(#neonGlow)"
                  />
                )}

                {/* Worker Body Pin */}
                <circle
                  r="11"
                  fill="#09101f"
                  stroke={ringColor}
                  strokeWidth="2.5"
                />

                {/* Inner Icon / Status Indicator */}
                <circle
                  r="5"
                  fill={ringColor}
                  className={isCritical ? 'animate-pulse' : ''}
                />

                {/* Worker Tag Badge */}
                <g transform="translate(0, 18)">
                  <rect
                    x="-32"
                    y="-2"
                    width="64"
                    height="14"
                    rx="3"
                    fill="#050914"
                    fillOpacity="0.9"
                    stroke={ringColor}
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="8"
                    fill={ringColor}
                    fontSize="8.5"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {worker.id}
                  </text>
                </g>

                {/* Fall / SOS Indicator Banner */}
                {worker.fallDetected && (
                  <text
                    x="0"
                    y="-16"
                    fill="#ff3366"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="animate-bounce"
                  >
                    🚨 MAN DOWN!
                  </text>
                )}
                {worker.sosActive && !worker.fallDetected && (
                  <text
                    x="0"
                    y="-16"
                    fill="#ff3366"
                    fontSize="9"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="animate-bounce"
                  >
                    🚨 SOS BEACON
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Hover Worker Tactical Mini-Card HUD */}
      {hoveredWorker && (
        <div
          className="absolute z-30 pointer-events-none bg-slate-950/95 border border-cyan-500/80 p-3 rounded-lg shadow-[0_0_25px_rgba(0,240,255,0.3)] backdrop-blur-md text-xs font-mono w-60"
          style={{
            left: `${Math.min(70, Math.max(5, (hoveredWorker.x / 1000) * 100))}%`,
            top: `${Math.min(65, Math.max(10, (hoveredWorker.y / 700) * 100))}%`
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
            <span className="font-bold text-white flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              {hoveredWorker.name}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                hoveredWorker.status === 'critical'
                  ? 'bg-red-950 text-red-400 border border-red-500'
                  : hoveredWorker.status === 'warning'
                  ? 'bg-amber-950 text-amber-400 border border-amber-500'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-500'
              }`}
            >
              {hoveredWorker.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-y-1 text-[11px] text-slate-300">
            <div>HR: <b className={hoveredWorker.heartRate > 105 ? 'text-red-400' : 'text-emerald-400'}>{hoveredWorker.heartRate} BPM</b></div>
            <div>SpO₂: <b className={hoveredWorker.spO2 < 93 ? 'text-red-400' : 'text-cyan-400'}>{hoveredWorker.spO2}%</b></div>
            <div>CH₄: <b className={hoveredWorker.ch4 > 0.8 ? 'text-red-400' : 'text-slate-200'}>{hoveredWorker.ch4}%</b></div>
            <div>Temp: <b>{hoveredWorker.temperature.toFixed(1)}°C</b></div>
            <div className="col-span-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
              Motion: <span className="text-cyan-300 uppercase">{hoveredWorker.motionStatus.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
