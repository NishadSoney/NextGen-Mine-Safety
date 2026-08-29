import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  UserPlus, 
  FileText, 
  RotateCcw, 
  Radio, 
  Users, 
  Bot, 
  Cpu, 
  Radar,
  Flame,
  LayoutDashboard,
  UserMinus
} from 'lucide-react';
import { useMineSafety } from '../context/MineSafetyContext';

export const Header: React.FC = () => {
  const {
    workers,
    incidents,
    isSimulating,
    isAudioMuted,
    isEvacuationAlarmActive,
    isRobotDeployed,
    toggleSimulating,
    toggleAudioMute,
    toggleEvacuationAlarm,
    setIsAddWorkerOpen,
    setIsResearchOpen,
    toggleRobotDeployment,
    resetAllSimulation
  } = useMineSafety();

  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        `${now.toLocaleDateString('en-GB')} | ${now.toLocaleTimeString('en-GB', { hour12: false })} UTC+5:30`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalWorkers = workers.filter((w) => w.status === 'critical').length;
  const warningWorkers = workers.filter((w) => w.status === 'warning').length;
  const safeWorkers = workers.filter((w) => w.status === 'safe').length;
  const unresolvedIncidents = incidents.filter((i) => !i.resolved).length;

  return (
    <header className="w-full bg-[#0a0f1c]/95 border-b border-cyan-900/40 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
      {/* Top Banner & Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Branding & Mine System Identifier */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Radio className="w-5 h-5 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-wider text-white font-hud flex items-center gap-1.5">
                NextGen<span className="text-cyan-400">Safety</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
                  v3.4-COMMAND
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>DEEP EXTRACTION COMPLEX - SECTOR ALPHA</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400/80 font-bold">{timeStr}</span>
            </p>
          </div>
        </div>

        {/* Center: Live Status Badges & Threat Level */}
        <div className="flex items-center space-x-2 sm:space-x-3 bg-slate-900/70 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>SAFE: <b>{safeWorkers}</b></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>WARN: <b>{warningWorkers}</b></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1.5 text-red-400">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>CRITICAL: <b>{criticalWorkers}</b></span>
          </div>
          {unresolvedIncidents > 0 && (
            <>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1 text-red-500 font-bold animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                <span>{unresolvedIncidents} ACTIVE INCIDENT{unresolvedIncidents > 1 ? 'S' : ''}</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Evacuation Siren Toggle */}
          <button
            onClick={toggleEvacuationAlarm}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold font-mono rounded border transition-all ${
              isEvacuationAlarmActive
                ? 'bg-red-600 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.8)] animate-bounce'
                : 'bg-red-950/40 text-red-400 border-red-800/60 hover:bg-red-900/50'
            }`}
            title="Toggle Mine-wide Evacuation Alarm"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isEvacuationAlarmActive ? 'SIREN ACTIVE' : 'EVAC SIREN'}
            </span>
          </button>

          {/* Add Worker Button */}
          <button
            onClick={() => setIsAddWorkerOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 hover:text-white transition-all shadow-[0_0_10px_rgba(0,240,255,0.15)]"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">+ ADD MINER</span>
          </button>

          {/* Toggle Robot Button */}
          <button
            onClick={toggleRobotDeployment}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono font-bold rounded border transition-all ${
              isRobotDeployed
                ? 'bg-amber-950/70 border-amber-500/50 text-amber-300 hover:bg-amber-900/60'
                : 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden md:inline">{isRobotDeployed ? 'RECALL BOT' : 'DEPLOY BOT'}</span>
          </button>

          {/* Research & Architecture Hub */}
          <button
            onClick={() => setIsResearchOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-mono rounded bg-slate-800/70 border border-slate-700 text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-all"
            title="System Research, Protocols & Hardware Architecture"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">TECH SPECS</span>
          </button>

          {/* Audio Mute */}
          <button
            onClick={toggleAudioMute}
            className="p-1.5 rounded bg-slate-800/70 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-all"
            title={isAudioMuted ? 'Unmute Tactical Audio' : 'Mute Tactical Audio'}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Sim Play/Pause */}
          <button
            onClick={toggleSimulating}
            className="p-1.5 rounded bg-slate-800/70 border border-slate-700 text-slate-300 hover:text-cyan-400 transition-all"
            title={isSimulating ? 'Pause Telemetry Simulation' : 'Resume Telemetry Simulation'}
          >
            {isSimulating ? <Pause className="w-4 h-4 text-emerald-400" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Reset Simulation */}
          <button
            onClick={resetAllSimulation}
            className="p-1.5 rounded bg-slate-800/70 border border-slate-700 text-slate-300 hover:text-amber-400 transition-all"
            title="Reset Simulation State"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
