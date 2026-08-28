import React, { useEffect, useRef } from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  X, 
  Heart, 
  Droplets, 
  Thermometer, 
  Battery, 
  Radio, 
  ShieldAlert, 
  Bot, 
  MapPin, 
  Trash2, 
  Phone, 
  AlertTriangle, 
  Send 
} from 'lucide-react';
import { getStatusColor } from '../../utils/riskEngine';

export const WorkerDetailModal: React.FC = () => {
  const {
    selectedWorker,
    zones,
    selectWorker,
    removeWorker,
    dispatchRobotToWorker,
    calculateRescuePathToWorker,
    updateWorkerVitals
  } = useMineSafety();

  const ecgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Real-Time ECG Waveform Canvas Rendering
  useEffect(() => {
    if (!selectedWorker || !ecgCanvasRef.current) return;

    const canvas = ecgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 15;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ECG Waveform Path
      const hr = selectedWorker.heartRate || 75;
      const speed = hr / 40;
      offset = (offset + speed) % 120;

      ctx.beginPath();
      const isDanger = selectedWorker.status === 'critical';
      ctx.strokeStyle = isDanger ? '#ff3366' : '#00ff88';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = isDanger ? '#ff3366' : '#00ff88';

      const midY = canvas.height / 2;

      for (let x = 0; x < canvas.width; x++) {
        const cycle = (x + offset) % 120;
        let y = midY;

        // P-Q-R-S-T cardiac wave profile
        if (cycle > 20 && cycle <= 30) {
          y = midY - Math.sin(((cycle - 20) / 10) * Math.PI) * 8; // P Wave
        } else if (cycle > 35 && cycle <= 40) {
          y = midY + 4; // Q wave dip
        } else if (cycle > 40 && cycle <= 48) {
          y = midY - ((cycle - 40) / 8) * 38; // R spike peak
        } else if (cycle > 48 && cycle <= 55) {
          y = midY + 12; // S drop
        } else if (cycle > 65 && cycle <= 85) {
          y = midY - Math.sin(((cycle - 65) / 20) * Math.PI) * 12; // T wave
        }

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [selectedWorker]);

  if (!selectedWorker) return null;

  const currentZone = zones.find((z) => z.id === selectedWorker.zoneId);
  const colors = getStatusColor(selectedWorker.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-[#090e1a] border border-cyan-500/50 shadow-[0_0_40px_rgba(0,240,255,0.25)] p-6 font-mono text-slate-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-900/50 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400 font-bold text-lg font-mono">
              {selectedWorker.id.replace('MINER-', '#')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white font-hud tracking-wide">
                  {selectedWorker.name}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-bold border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
                >
                  {selectedWorker.status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedWorker.role} | BLOOD TYPE: <b className="text-white">{selectedWorker.bloodGroup}</b>
              </p>
            </div>
          </div>

          <button
            onClick={() => selectWorker(null)}
            className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Subterranean Location & Contact Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">CURRENT ASSIGNED SECTOR</span>
                <span className="text-white font-bold">{currentZone ? currentZone.name : 'Unknown'}</span>
              </div>
            </div>
            <span className="text-cyan-400 font-mono text-[11px] bg-cyan-950/60 px-2 py-1 rounded border border-cyan-800/60">
              {currentZone ? `${currentZone.depthLevel}m Depth` : ''}
            </span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-400 block text-[10px]">EMERGENCY CONTACT</span>
                <span className="text-white font-bold">{selectedWorker.emergencyContact}</span>
              </div>
            </div>
            <span className="text-slate-400 font-mono text-[11px]">VERIFIED</span>
          </div>
        </div>

        {/* Live ECG Waveform Monitor Section */}
        <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-4 mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-300">LIVE ECG TELEMETRY WAVEFORM (LEAD-II)</span>
            </div>
            <span className="text-xs text-cyan-400 font-bold">
              SAMPLING RATE: 250 Hz (UWB MESH)
            </span>
          </div>
          <canvas
            ref={ecgCanvasRef}
            width={700}
            height={90}
            className="w-full h-[90px] rounded bg-[#050810] border border-cyan-950"
          />
        </div>

        {/* Biometrics & Micro-climate Gas Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {/* Heart Rate */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>HEART RATE</span>
              <Heart className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {selectedWorker.heartRate} <span className="text-xs font-normal text-slate-400">BPM</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Normal: 60-100 BPM</div>
          </div>

          {/* SpO2 */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>SPO₂ OXYGEN</span>
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-400">
              {selectedWorker.spO2}%
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Normal: 95-100%</div>
          </div>

          {/* Core Temperature */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>BODY TEMP</span>
              <Thermometer className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {selectedWorker.temperature.toFixed(1)}°C
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Normal: 36.5-37.5°C</div>
          </div>

          {/* Micro-Climate Methane (CH4) */}
          <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>AMBIENT CH₄</span>
              <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {selectedWorker.ch4}% <span className="text-xs font-normal text-slate-400">vol</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Threshold: &lt;1.0%</div>
          </div>
        </div>

        {/* Smart Safety Jacket Hardware Status */}
        <div className="bg-slate-950/70 border border-slate-800 p-3.5 rounded-xl mb-5 text-xs grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <span className="text-slate-500 block text-[10px]">JACKET HARDWARE ID</span>
            <span className="text-cyan-300 font-bold">{selectedWorker.jacketId}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">BATTERY CAPACITY</span>
            <span className="text-emerald-400 font-bold">{Math.round(selectedWorker.battery)}% (LiFePO4)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">RF SIGNAL STRENGTH</span>
            <span className="text-white font-bold">{selectedWorker.signalStrength}% (-68 dBm)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">MOTION STATE</span>
            <span className="text-cyan-400 font-bold uppercase">{selectedWorker.motionStatus.replace('_', ' ')}</span>
          </div>
        </div>

        {/* Action Controls & Emergency Dispatch */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => calculateRescuePathToWorker(selectedWorker.id)}
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
            >
              <Send className="w-4 h-4" />
              <span>CALCULATE RESCUE PATH</span>
            </button>

            <button
              onClick={() => dispatchRobotToWorker(selectedWorker.id)}
              className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold font-mono text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(255,183,3,0.4)] transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>DISPATCH RESCUE ROVER</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                updateWorkerVitals(selectedWorker.id, {
                  sosActive: !selectedWorker.sosActive,
                  heartRate: selectedWorker.sosActive ? 75 : 125
                });
              }}
              className={`px-3 py-2 rounded-lg border text-xs font-bold transition-all ${
                selectedWorker.sosActive
                  ? 'bg-red-600 text-white border-red-400 animate-pulse'
                  : 'bg-red-950/40 text-red-400 border-red-800/60 hover:bg-red-900/60'
              }`}
            >
              {selectedWorker.sosActive ? 'CANCEL SOS' : 'TRIGGER MANUAL SOS'}
            </button>

            <button
              onClick={() => removeWorker(selectedWorker.id)}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-950 border border-slate-700 hover:border-red-500 text-slate-300 hover:text-red-300 text-xs font-bold flex items-center space-x-1 transition-all"
            >
              <Trash2 className="w-4 h-4" />
              <span>EVACUATE & REMOVE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
