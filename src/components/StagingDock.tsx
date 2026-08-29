import React from 'react';
import { HardHat, GripVertical, Bot, UserPlus, Plus } from 'lucide-react';
import { useMineSafety } from '../context/MineSafetyContext';

export const StagingDock: React.FC = () => {
  const { setIsAddWorkerOpen } = useMineSafety();

  const mockReserves = [
    { id: 'MINER-126', name: 'Vikram Joshi', role: 'Mine Rescue HazMat', type: 'worker' },
    { id: 'BOT-HOUND-02', name: 'CyberHound Recon', role: 'Autonomous Quadruped', type: 'bot' },
    { id: 'MINER-133', name: 'Sarah Chen', role: 'Geotechnical Specialist', type: 'worker' },
  ];

  return (
    <div className="w-full bg-[#0a1120] border border-slate-800/80 rounded-xl p-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 shadow-[0_0_20px_rgba(0,0,0,0.6)] font-mono">
      {/* Left Title Area */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-950/30 border border-emerald-900/50 flex flex-shrink-0 items-center justify-center">
          <HardHat className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide">Deployment & Staging Dock</h3>
            <span className="text-[9px] bg-emerald-950/60 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-800/50 font-bold uppercase tracking-wider">Drag & Drop</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Drag reserve personnel or bots directly onto the map to deploy at subterranean coordinates.
          </p>
        </div>
      </div>

      {/* Right Area - Reserve Units & Actions */}
      <div className="flex items-center space-x-2 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 custom-scrollbar">
        {mockReserves.map((unit) => (
          <div 
            key={unit.id}
            className="flex flex-shrink-0 items-center space-x-2 bg-slate-900/50 hover:bg-slate-800/60 border border-slate-700/80 rounded-lg p-1.5 pr-2 cursor-grab active:cursor-grabbing transition-colors min-w-[200px]"
          >
            <div className="text-slate-600 pl-1">
              <GripVertical className="w-3 h-3" />
            </div>
            <div className={`w-6 h-6 rounded flex flex-shrink-0 items-center justify-center border text-[10px] font-bold ${
              unit.type === 'bot' 
                ? 'bg-blue-950/50 border-blue-800 text-blue-400' 
                : 'bg-emerald-950/50 border-emerald-800 text-emerald-400'
            }`}>
              {unit.type === 'bot' ? <Bot className="w-3.5 h-3.5" /> : 'N'}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="text-[11px] font-bold text-white truncate flex items-center gap-1">
                {unit.name} <span className="text-slate-500 font-normal">({unit.id})</span>
              </div>
              <div className="text-[9px] text-slate-400 truncate">{unit.role}</div>
            </div>
            <button className="w-5 h-5 rounded flex-shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-600 flex items-center justify-center text-slate-300">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        ))}

        <div className="h-8 w-px bg-slate-800 mx-2 flex-shrink-0" />

        <button 
          onClick={() => setIsAddWorkerOpen(true)}
          className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-bold text-slate-200 transition-colors"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_#34d399]" />
          <span>+ ADD WORKER</span>
        </button>

        <button className="flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[10px] font-bold text-slate-200 transition-colors">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_5px_#60a5fa]" />
          <span>+ ADD BOT</span>
        </button>
      </div>
    </div>
  );
};
