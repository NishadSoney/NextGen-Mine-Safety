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
    beamSensors,
    isSimulating,
    isAudioMuted,
    isEvacuationAlarmActive,
    isRobotDeployed,
    toggleSimulating,
    toggleAudioMute,
    toggleEvacuationAlarm,
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
  const onlineBeamSensors = beamSensors.filter((bs) => bs.isOnline).length;

  let systemStatus = 'SAFE';
  let statusClasses = 'text-emerald-400';
  let dotClasses = 'bg-emerald-500 animate-pulse';

  if (isEvacuationAlarmActive || criticalWorkers > 0 || unresolvedIncidents > 0) {
    systemStatus = 'EMERGENCY';
    statusClasses = 'text-red-500';
    dotClasses = 'bg-red-500 animate-ping';
  } else if (warningWorkers > 1) {
    systemStatus = 'WARNING';
    statusClasses = 'text-orange-500';
    dotClasses = 'bg-orange-500 animate-pulse';
  } else if (warningWorkers > 0 || onlineBeamSensors < beamSensors.length) {
    systemStatus = 'CAUTION';
    statusClasses = 'text-amber-400';
    dotClasses = 'bg-amber-400';
  }

  return (
    <header className="w-full bg-[#0a0f1c]/95 border-b border-cyan-900/40 backdrop-blur-md sticky top-0 z-40 px-6 py-5 md:py-6 shadow-[0_4_20px_rgba(0,240,255,0.05)]">
      {/* Top Banner & Telemetry Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-3 xl:gap-4 w-full">
        {/* Left: Branding & Mine System Identifier */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-950/80 to-emerald-950/60 border border-cyan-500/40 text-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] shrink-0">
            <Radio className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center">
              <h1 className="font-bold tracking-wider text-white font-hud flex items-center gap-2">
                <span className="jiva-accent-gradient text-3xl sm:text-4xl">JIVA</span>
                <span className="text-[10px] sm:text-xs font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/30 text-cyan-300 whitespace-nowrap">
                  v4.0-COMMAND
                </span>
              </h1>
            </div>
            <p className="text-[9px] sm:text-[11px] text-slate-400 font-mono flex items-center gap-1.5 whitespace-nowrap hidden lg:flex">
              <span>AI MINE SAFETY & RESCUE COMMAND CENTER</span>
              <span className="text-slate-600">|</span>
              <span className="text-cyan-400/80 font-bold">{timeStr}</span>
            </p>
          </div>
        </div>

        {/* Center: Live Status Badges & Threat Level */}
        <div className="flex items-center space-x-2 sm:space-x-4 bg-slate-900/80 border border-slate-700/60 rounded-xl px-3 sm:px-4 py-2 text-[10px] sm:text-sm font-mono shadow-inner shadow-slate-950 shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 text-cyan-400 whitespace-nowrap">
            <Cpu className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>SENSORS: <b>{onlineBeamSensors}</b></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 sm:gap-1.5 text-blue-400 whitespace-nowrap">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>WORKERS: <b>{workers.length}</b></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-1 sm:gap-1.5 text-indigo-400 whitespace-nowrap">
            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>BOTS: <b>{isRobotDeployed ? 1 : 0}</b></span>
          </div>
          <span className="text-slate-700">|</span>
          <div className={`flex items-center gap-1 sm:gap-1.5 ${statusClasses} whitespace-nowrap`}>
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${dotClasses}`} />
            <span>STATUS: <b>{systemStatus}</b></span>
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
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
