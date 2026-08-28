import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  Flame, 
  UserX, 
  Construction, 
  Radio, 
  RotateCcw, 
  Zap 
} from 'lucide-react';

export const HazardSimulator: React.FC = () => {
  const { triggerEmergencyScenario, resetAllSimulation } = useMineSafety();

  return (
    <div className="bg-slate-900/80 border border-cyan-900/40 p-4 rounded-xl backdrop-blur-md font-mono text-slate-200">
      <div className="flex items-center justify-between border-b border-cyan-900/50 pb-2.5 mb-3.5">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white font-hud tracking-wide">
            CONTROL ROOM EMERGENCY SCENARIO SIMULATOR
          </h3>
        </div>
        <span className="text-xs text-slate-400">Inject Threat & Test AI Rescue Protocols</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Methane Spike */}
        <button
          onClick={() => triggerEmergencyScenario('gas_leak')}
          className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 hover:bg-red-900/60 hover:border-red-500 text-left transition-all group shadow-[0_0_15px_rgba(255,51,102,0.1)]"
        >
          <div className="flex items-center justify-between mb-1.5">
            <Flame className="w-5 h-5 text-red-400 group-hover:animate-bounce" />
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 font-bold border border-red-700">
              CODE RED
            </span>
          </div>
          <h4 className="text-xs font-bold text-white font-hud">METHANE OUTBREAK</h4>
          <p className="text-[10px] text-slate-400 mt-1">Spike CH₄ &gt;2.1% vol in Sector 3</p>
        </button>

        {/* Fall Detected */}
        <button
          onClick={() => triggerEmergencyScenario('fall_detected')}
          className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/60 hover:border-amber-500 text-left transition-all group shadow-[0_0_15px_rgba(255,183,3,0.1)]"
        >
          <div className="flex items-center justify-between mb-1.5">
            <UserX className="w-5 h-5 text-amber-400 group-hover:animate-pulse" />
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-700">
              CODE AMBER
            </span>
          </div>
          <h4 className="text-xs font-bold text-white font-hud">MAN DOWN / FALL</h4>
          <p className="text-[10px] text-slate-400 mt-1">Simulate 7.2G Impact on Worker 108</p>
        </button>

        {/* Roof Collapse */}
        <button
          onClick={() => triggerEmergencyScenario('roof_collapse')}
          className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 hover:bg-purple-900/60 hover:border-purple-500 text-left transition-all group shadow-[0_0_15px_rgba(168,85,247,0.1)]"
        >
          <div className="flex items-center justify-between mb-1.5">
            <Construction className="w-5 h-5 text-purple-400 group-hover:animate-spin" />
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-700">
              COLLAPSE
            </span>
          </div>
          <h4 className="text-xs font-bold text-white font-hud">ROOF COLLAPSE</h4>
          <p className="text-[10px] text-slate-400 mt-1">Block Main Haulage & Reroute</p>
        </button>

        {/* Manual SOS */}
        <button
          onClick={() => triggerEmergencyScenario('worker_sos')}
          className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 hover:bg-cyan-900/60 hover:border-cyan-500 text-left transition-all group shadow-[0_0_15px_rgba(0,240,255,0.1)]"
        >
          <div className="flex items-center justify-between mb-1.5">
            <Radio className="w-5 h-5 text-cyan-400 group-hover:animate-ping" />
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-700">
              DISTRESS
            </span>
          </div>
          <h4 className="text-xs font-bold text-white font-hud">MANUAL SOS BEACON</h4>
          <p className="text-[10px] text-slate-400 mt-1">Trigger Smart Jacket Distress</p>
        </button>
      </div>
    </div>
  );
};
