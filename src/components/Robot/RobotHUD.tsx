import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  Bot, 
  Camera, 
  Flame, 
  ShieldAlert, 
  Battery, 
  Wifi, 
  Compass, 
  Eye, 
  Radio, 
  Layers, 
  Scan 
} from 'lucide-react';
import { CameraMode } from '../../types';

export const RobotHUD: React.FC = () => {
  const { robot, setRobotCameraMode, workers, zones } = useMineSafety();

  const getTargetWorker = () => {
    if (!robot.targetWorkerId) return null;
    return workers.find((w) => w.id === robot.targetWorkerId);
  };

  const targetWorker = getTargetWorker();

  return (
    <div className="w-full flex flex-col space-y-4 font-mono text-slate-200">
      {/* Robot Telemetry Status Bar */}
      <div className="bg-slate-900/80 border border-cyan-900/40 p-3.5 rounded-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-white font-hud tracking-wide">
                {robot.name}
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 uppercase">
                {robot.status.replace('_', ' ')}
              </span>
            </div>
            <p className="text-xs text-slate-400">{robot.model}</p>
          </div>
        </div>

        {/* Status Metrics Strip */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1.5">
            <Battery className="w-4 h-4 text-emerald-400" />
            <span>BATTERY: <b className="text-white">{Math.round(robot.battery)}%</b></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>LATENCY: <b className="text-cyan-300">18ms (UWB)</b></span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>HEADING: <b className="text-white">{robot.heading}°</b></span>
          </div>
        </div>
      </div>

      {/* Main HUD Viewport & Obstacle Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: High-Tech Video / Sensor HUD Feed */}
        <div className="lg:col-span-2 relative h-[380px] sm:h-[420px] rounded-xl overflow-hidden border border-cyan-500/40 bg-black shadow-[0_0_30px_rgba(0,240,255,0.15)] flex flex-col justify-between p-4 select-none">
          {/* Simulated Camera Feed Filter / Background */}
          {robot.cameraFeedMode === 'optical' && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0b1626_0%,_#02060d_100%)]">
              {/* Mine Tunnel Perspective Simulation Lines */}
              <svg className="w-full h-full opacity-35" viewBox="0 0 400 300">
                <polygon points="40,20 360,20 280,240 120,240" fill="#0f1f38" stroke="#00f0ff" strokeWidth="1" />
                <line x1="40" y1="20" x2="120" y2="240" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="360" y1="20" x2="280" y2="240" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="200" y1="20" x2="200" y2="240" stroke="#00f0ff" strokeWidth="0.5" strokeDasharray="2 4" />
              </svg>
            </div>
          )}

          {robot.cameraFeedMode === 'thermal' && (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#701a75_0%,_#1e1b4b_60%,_#050814_100%)]">
              <svg className="w-full h-full opacity-60" viewBox="0 0 400 300">
                <polygon points="40,20 360,20 280,240 120,240" fill="#a21caf" fillOpacity="0.3" stroke="#f43f5e" strokeWidth="1.5" />
                <circle cx="200" cy="140" r="45" fill="#facc15" fillOpacity="0.4" className="animate-pulse" />
              </svg>
            </div>
          )}

          {robot.cameraFeedMode === 'lidar' && (
            <div className="absolute inset-0 bg-[#040810] bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px]">
              <svg className="w-full h-full opacity-70" viewBox="0 0 400 300">
                <polygon points="60,40 340,40 260,220 140,220" fill="none" stroke="#00ff88" strokeWidth="1.5" strokeDasharray="4 2" />
                <circle cx="200" cy="130" r="30" fill="none" stroke="#00ff88" strokeWidth="1" strokeDasharray="6 3" />
              </svg>
            </div>
          )}

          {/* CRT Scanline Overlay */}
          <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

          {/* Top HUD Feed Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2 bg-black/80 border border-cyan-500/40 px-3 py-1 rounded backdrop-blur-md">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-bold">● REC [ROBOT-CAM-01]</span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-300">FPS: 60</span>
            </div>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center space-x-1 bg-black/80 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setRobotCameraMode('optical')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  robot.cameraFeedMode === 'optical'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/60'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                OPTICAL
              </button>
              <button
                onClick={() => setRobotCameraMode('thermal')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  robot.cameraFeedMode === 'thermal'
                    ? 'bg-purple-950 text-purple-300 border border-purple-500/60'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                THERMAL FLIR
              </button>
              <button
                onClick={() => setRobotCameraMode('lidar')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                  robot.cameraFeedMode === 'lidar'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LiDAR 3D
              </button>
            </div>
          </div>

          {/* Center Tactical Crosshair & Artificial Horizon */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto pointer-events-none">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* Outer Circular Reticle */}
              <div className="absolute inset-0 border border-cyan-500/40 rounded-full border-dashed animate-spin [animation-duration:20s]" />
              <div className="absolute inset-4 border border-cyan-400/20 rounded-full" />
              
              {/* Center Crosshair */}
              <div className="w-10 h-0.5 bg-cyan-400/80" />
              <div className="absolute h-10 w-0.5 bg-cyan-400/80" />
              <div className="absolute w-2 h-2 rounded-full border border-cyan-300" />
            </div>

            {targetWorker && (
              <div className="mt-2 bg-red-950/90 border border-red-500 px-3 py-1 rounded text-red-400 font-bold text-xs animate-bounce">
                TARGET LOCKED: {targetWorker.name} ({targetWorker.id})
              </div>
            )}
          </div>

          {/* Bottom HUD Telemetry Strip */}
          <div className="relative z-10 flex items-center justify-between text-xs bg-black/80 border border-slate-800 p-2 rounded backdrop-blur-md">
            <div>
              <span className="text-slate-400">MISSION: </span>
              <span className="text-cyan-300 font-bold">{robot.currentMission}</span>
            </div>
            <div>
              <span className="text-slate-400">SPEED: </span>
              <span className="text-white font-bold">{robot.speed.toFixed(1)} m/s</span>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Atmospheric Sniffer & LiDAR Clearance Proximity */}
        <div className="flex flex-col space-y-4">
          {/* Atmospheric Gas Sniffer Gauges */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-cyan-300 mb-3 flex items-center gap-1.5 font-hud">
              <Flame className="w-4 h-4 text-red-400" />
              ROBOT NOSE ATMOSPHERIC SNIFFER
            </h4>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">CH₄ METHANE</span>
                <span className="text-lg font-bold text-white">{robot.frontGas.ch4}%</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Safe Range</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">CO MONOXIDE</span>
                <span className="text-lg font-bold text-white">{robot.frontGas.co} ppm</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Low Level</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">O₂ OXYGEN</span>
                <span className="text-lg font-bold text-cyan-400">{robot.frontGas.o2}%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Norm: 20.9%</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">H₂S SULFIDE</span>
                <span className="text-lg font-bold text-white">{robot.frontGas.h2s} ppm</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">Zero Detected</span>
              </div>
            </div>
          </div>

          {/* 4-Quadrant LiDAR Obstacle Clearance */}
          <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl">
            <h4 className="text-xs font-bold text-cyan-300 mb-3 flex items-center gap-1.5 font-hud">
              <Scan className="w-4 h-4 text-cyan-400" />
              LiDAR OBSTACLE PROXIMITY RADAR
            </h4>

            <div className="relative w-full h-36 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center">
              {/* Radar Circles */}
              <div className="absolute inset-3 border border-cyan-900/40 rounded-full" />
              <div className="absolute inset-8 border border-cyan-900/60 rounded-full" />
              
              {/* Robot Center Marker */}
              <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-400 flex items-center justify-center text-[10px] font-bold text-cyan-300">
                UGV
              </div>

              {/* Clearance Labels in 4 Directions */}
              <span className="absolute top-1 text-[10px] text-cyan-300 font-bold">
                FRONT: {robot.lidarRadar.front}m
              </span>
              <span className="absolute bottom-1 text-[10px] text-slate-400 font-bold">
                BACK: {robot.lidarRadar.back}m
              </span>
              <span className="absolute left-2 text-[10px] text-slate-400 font-bold">
                LEFT: {robot.lidarRadar.left}m
              </span>
              <span className="absolute right-2 text-[10px] text-slate-400 font-bold">
                RIGHT: {robot.lidarRadar.right}m
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
