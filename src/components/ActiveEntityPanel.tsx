import React, { useEffect, useRef } from 'react';
import { useMineSafety } from '../context/MineSafetyContext';
import { 
  Heart, 
  Droplets, 
  Thermometer, 
  Battery, 
  Bot, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Radio,
  Compass,
  Flame,
  Camera
} from 'lucide-react';
import { getStatusColor } from '../utils/riskEngine';

export const ActiveEntityPanel: React.FC = () => {
  const { selectedWorker, selectedRobot, zones, pingEntity, updateWorkerVitals, dispatchRobotToWorker } = useMineSafety();
  const ecgCanvasRef = useRef<HTMLCanvasElement>(null);

  // Animated Real-Time ECG Waveform for Worker
  useEffect(() => {
    if (!selectedWorker || !ecgCanvasRef.current) return;

    const canvas = ecgCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let offset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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

        if (cycle > 20 && cycle <= 30) {
          y = midY - Math.sin(((cycle - 20) / 10) * Math.PI) * 8; 
        } else if (cycle > 35 && cycle <= 40) {
          y = midY + 4; 
        } else if (cycle > 40 && cycle <= 48) {
          y = midY - ((cycle - 40) / 8) * 38; 
        } else if (cycle > 48 && cycle <= 55) {
          y = midY + 12; 
        } else if (cycle > 65 && cycle <= 85) {
          y = midY - Math.sin(((cycle - 65) / 20) * Math.PI) * 12; 
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

  if (!selectedWorker && !selectedRobot) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[#070b14]/50 rounded-xl border border-slate-800/50 p-6 backdrop-blur-sm">
        <div className="text-center text-slate-500 font-mono">
          <Bot className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm">SELECT A WORKER OR BOT<br/>TO VIEW STATS</p>
        </div>
      </div>
    );
  }

  if (selectedWorker) {
    const currentZone = zones.find((z) => z.id === selectedWorker.zoneId);
    const colors = getStatusColor(selectedWorker.status);
    const isCritical = selectedWorker.status === 'critical' && !selectedWorker.ignoredStatus;
    const isWarning = selectedWorker.status === 'warning' && !selectedWorker.ignoredStatus;

    const panelBgClass = isCritical
      ? 'bg-red-950/40 border-red-900/50 shadow-[0_0_30px_rgba(255,0,0,0.1)]'
      : isWarning
      ? 'bg-orange-950/40 border-orange-900/50 shadow-[0_0_30px_rgba(255,165,0,0.1)]'
      : 'bg-[#090e1a]/90 border-cyan-900/50 shadow-[0_0_30px_rgba(0,240,255,0.05)]';

    return (
      <div className={`w-full h-full min-h-[500px] backdrop-blur-md rounded-xl border p-4 font-mono text-slate-200 overflow-y-auto ${panelBgClass}`}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-900/50 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex flex-shrink-0 items-center justify-center text-cyan-400 font-bold text-lg">
              {selectedWorker.id.replace('MINER-', '#')}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {selectedWorker.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}>
                  {selectedWorker.status.toUpperCase()}
                </span>
                <p className="text-[10px] text-slate-400">
                  {selectedWorker.role}
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => pingEntity(selectedWorker.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded text-[10px] font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          >
            <Radio className="w-3 h-3" />
            PING
          </button>
        </div>

        {/* Location & Contact */}
        <div className="grid grid-cols-1 gap-2 mb-4 text-xs">
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <MapPin className={`w-3.5 h-3.5 ${isCritical ? 'text-red-400' : isWarning ? 'text-orange-400' : 'text-cyan-400'}`} />
              <span>{currentZone ? currentZone.name : 'Unknown'}</span>
            </div>
            <span className={`${isCritical ? 'text-red-400 bg-red-950/60' : isWarning ? 'text-orange-400 bg-orange-950/60' : 'text-cyan-400 bg-cyan-950/60'} px-1.5 py-0.5 rounded text-[10px]`}>
              {currentZone ? `${currentZone.depthLevel}m` : ''}
            </span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>{selectedWorker.emergencyContact}</span>
            </div>
          </div>
        </div>

        {/* ECG */}
        <div className="bg-slate-950 border border-cyan-900/60 rounded-xl p-3 mb-4 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <Heart className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300">LIVE ECG</span>
            </div>
          </div>
          <canvas ref={ecgCanvasRef} width={300} height={60} className="w-full h-[60px] rounded bg-[#050810] border border-cyan-950" />
        </div>

        {/* Biometrics Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl transition-all hover:border-red-900/50">
            <div className="flex justify-between text-slate-400 text-[10px] mb-1">
              <span>HEART RATE</span><Heart className="w-3 h-3 text-red-400" />
            </div>
            <div className="text-lg font-bold text-white">{selectedWorker.heartRate} <span className="text-[10px] font-normal text-slate-500">BPM</span></div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl transition-all hover:border-cyan-900/50">
            <div className="flex justify-between text-slate-400 text-[10px] mb-1">
              <span>SPO₂</span><Droplets className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-cyan-400">{selectedWorker.spO2}%</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl transition-all hover:border-amber-900/50">
            <div className="flex justify-between text-slate-400 text-[10px] mb-1">
              <span>TEMP</span><Thermometer className="w-3 h-3 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white">{selectedWorker.temperature.toFixed(1)}°C</div>
          </div>
          <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl transition-all hover:border-red-900/50">
            <div className="flex justify-between text-slate-400 text-[10px] mb-1">
              <span>CH₄</span><AlertTriangle className="w-3 h-3 text-red-400" />
            </div>
            <div className="text-lg font-bold text-white">{selectedWorker.ch4}% <span className="text-[10px] font-normal text-slate-500">vol</span></div>
          </div>
        </div>

        {/* Hardware Status */}
        <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-[10px] grid grid-cols-2 gap-2 mb-4">
          <div><span className="text-slate-500 block">BATT</span><span className="text-emerald-400 font-bold">{Math.round(selectedWorker.battery)}%</span></div>
          <div><span className="text-slate-500 block">SIGNAL</span><span className="text-white font-bold">{selectedWorker.signalStrength}%</span></div>
          <div className="col-span-2"><span className="text-slate-500 block">MOTION</span><span className="text-cyan-400 font-bold uppercase">{selectedWorker.motionStatus.replace('_', ' ')}</span></div>
        </div>

        {/* Action Bottom Row */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => dispatchRobotToWorker(selectedWorker.id)}
            className="flex-1 py-2 rounded border border-amber-700 bg-amber-950/60 hover:bg-amber-900/80 text-amber-400 hover:text-white text-[10px] font-bold font-mono transition-colors flex items-center justify-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            DEPLOY BOT
          </button>
          
          {(selectedWorker.status === 'warning' || selectedWorker.status === 'critical') && !selectedWorker.ignoredStatus && (
            <button
              onClick={() => updateWorkerVitals(selectedWorker.id, { ignoredStatus: true })}
              className="flex-1 py-2 rounded border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white text-[10px] font-bold font-mono transition-colors flex items-center justify-center gap-1.5"
            >
              IGNORE WARNING
            </button>
          )}
        </div>
      </div>
    );
  }

  if (selectedRobot) {
    return (
      <div className="w-full h-full min-h-[500px] bg-[#090e1a]/90 backdrop-blur-md rounded-xl border border-cyan-900/50 p-4 font-mono text-slate-200 overflow-y-auto shadow-[0_0_30px_rgba(0,240,255,0.05)]">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-900/50 pb-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white tracking-wide">{selectedRobot.name}</h3>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 uppercase">
                  {selectedRobot.status.replace('_', ' ')}
                </span>
                <p className="text-[10px] text-slate-400">{selectedRobot.model}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => pingEntity(selectedRobot.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950/50 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 rounded text-[10px] font-bold transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          >
            <Radio className="w-3 h-3" />
            PING
          </button>
        </div>

        {/* Camera Feed Placeholder */}
        <div className="relative h-40 rounded-xl overflow-hidden border border-slate-700 bg-[#050810] mb-4 flex flex-col items-center justify-center">
          <Camera className="w-8 h-8 text-slate-600 mb-2" />
          <span className="text-[10px] font-bold text-slate-500 tracking-wider">CAMERA FEED NOT CONNECTED</span>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-20 pointer-events-none" />
        </div>

        {/* Telemetry */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-[10px]">
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg flex justify-between items-center">
            <span className="text-slate-500">BATT:</span>
            <div className="flex items-center gap-1"><Battery className="w-3 h-3 text-emerald-400" /><span className="text-emerald-400 font-bold">{Math.round(selectedRobot.battery)}%</span></div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg flex justify-between items-center">
            <span className="text-slate-500">LATENCY:</span>
            <div className="flex items-center gap-1"><Radio className="w-3 h-3 text-cyan-400" /><span className="text-cyan-400 font-bold">18ms</span></div>
          </div>
          <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg flex justify-between items-center col-span-2">
            <span className="text-slate-500">HEADING:</span>
            <div className="flex items-center gap-1"><Compass className="w-3 h-3 text-amber-400" /><span className="text-white font-bold">{selectedRobot.heading}°</span></div>
          </div>
        </div>

        {/* Gas Sniffer */}
        <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl mb-4">
          <h4 className="text-[10px] font-bold text-cyan-300 mb-2 flex items-center gap-1.5">
            <Flame className="w-3 h-3 text-red-400" />
            ATMOSPHERIC SNIFFER
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">CH₄</span>
              <span className="font-bold text-white">{selectedRobot.frontGas.ch4}%</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">CO</span>
              <span className="font-bold text-white">{selectedRobot.frontGas.co} ppm</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">O₂</span>
              <span className="font-bold text-cyan-400">{selectedRobot.frontGas.o2}%</span>
            </div>
            <div className="bg-slate-950 p-2 rounded border border-slate-800">
              <span className="text-slate-500 block text-[9px]">H₂S</span>
              <span className="font-bold text-white">{selectedRobot.frontGas.h2s} ppm</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
