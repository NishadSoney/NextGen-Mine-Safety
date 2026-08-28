import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Square, 
  RotateCcw, 
  Navigation, 
  Bot, 
  Radio, 
  Send 
} from 'lucide-react';
import { RobotMissionMode } from '../../types';

export const RobotControls: React.FC = () => {
  const {
    robot,
    workers,
    manualRobotMove,
    setRobotStatus,
    returnRobotToBase,
    dispatchRobotToWorker
  } = useMineSafety();

  const handleModeChange = (mode: RobotMissionMode) => {
    setRobotStatus(mode);
  };

  return (
    <div className="w-full bg-slate-900/80 border border-cyan-900/40 p-4 rounded-xl backdrop-blur-md font-mono text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Mission Mode Selector */}
        <div className="flex flex-col space-y-2">
          <span className="text-xs font-bold text-slate-400 font-hud">AUTONOMOUS MISSION PROFILE</span>
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => handleModeChange('patrol')}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                robot.status === 'patrol'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/70 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              🔄 AREA PATROL
            </button>

            <button
              onClick={() => handleModeChange('standby')}
              className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
                robot.status === 'standby'
                  ? 'bg-amber-950 text-amber-300 border-amber-500/70'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              ⏸️ HOLD / STANDBY
            </button>

            <button
              onClick={returnRobotToBase}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold transition-all"
            >
              🏠 RETURN TO BASE (SEC-00)
            </button>
          </div>
        </div>

        {/* Center: Quick Target Dispatch Dropdown */}
        <div className="flex flex-col space-y-2 min-w-[240px]">
          <span className="text-xs font-bold text-slate-400 font-hud">DISPATCH TO MINER IN DISTRESS</span>
          <div className="flex items-center space-x-1.5">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  dispatchRobotToWorker(e.target.value);
                }
              }}
              defaultValue=""
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="" disabled>Select miner target...</option>
              {workers.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.id}: {w.name} ({w.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Manual Teleoperation D-PAD */}
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[11px] font-bold text-slate-400 font-hud">MANUAL OVERRIDE D-PAD</span>
          <div className="grid grid-cols-3 gap-1">
            <div />
            <button
              onClick={() => manualRobotMove(0, -15)}
              className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-cyan-400 hover:bg-cyan-950 hover:border-cyan-400 flex items-center justify-center transition-all"
              title="Drive Forward"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <div />

            <button
              onClick={() => manualRobotMove(-15, 0)}
              className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-cyan-400 hover:bg-cyan-950 hover:border-cyan-400 flex items-center justify-center transition-all"
              title="Turn Left"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setRobotStatus('standby')}
              className="w-9 h-9 rounded bg-red-950/60 border border-red-800 text-red-400 hover:bg-red-900 flex items-center justify-center transition-all"
              title="Emergency Stop"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={() => manualRobotMove(15, 0)}
              className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-cyan-400 hover:bg-cyan-950 hover:border-cyan-400 flex items-center justify-center transition-all"
              title="Turn Right"
            >
              <ArrowRight className="w-4 h-4" />
            </button>

            <div />
            <button
              onClick={() => manualRobotMove(0, 15)}
              className="w-9 h-9 rounded bg-slate-950 border border-slate-700 text-cyan-400 hover:bg-cyan-950 hover:border-cyan-400 flex items-center justify-center transition-all"
              title="Drive Reverse"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <div />
          </div>
        </div>
      </div>
    </div>
  );
};
