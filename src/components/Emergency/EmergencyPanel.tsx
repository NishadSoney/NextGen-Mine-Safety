import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  ShieldAlert, 
  Flame, 
  Bot, 
  Navigation, 
  CheckCircle, 
  Volume2, 
  AlertTriangle, 
  Clock, 
  User, 
  Send 
} from 'lucide-react';
import { soundFX } from '../../utils/soundEffects';

export const EmergencyPanel: React.FC = () => {
  const {
    incidents,
    workers,
    zones,
    robot,
    resolveIncident,
    dispatchRobotToWorker,
    calculateRescuePathToWorker,
    toggleEvacuationAlarm,
    isEvacuationAlarmActive
  } = useMineSafety();

  const activeIncidents = incidents.filter((i) => !i.resolved);

  if (activeIncidents.length === 0) return null;

  return (
    <div className="w-full flex flex-col space-y-3 font-mono text-slate-200">
      {activeIncidents.map((incident) => {
        const affectedWorkers = workers.filter((w) =>
          incident.affectedWorkerIds.includes(w.id)
        );
        const incidentZone = zones.find((z) => z.id === incident.zoneId);

        return (
          <div
            key={incident.id}
            className="relative rounded-2xl bg-gradient-to-r from-red-950/80 via-[#180b14]/90 to-red-950/80 border-2 border-red-500/80 p-4 shadow-[0_0_30px_rgba(255,51,102,0.3)] backdrop-blur-md overflow-hidden animate-pulse"
          >
            {/* Top Incident Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-red-500/40 pb-3 mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-400 flex items-center justify-center text-red-400">
                  <ShieldAlert className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-red-600 text-white font-bold">
                      EMERGENCY DISPATCH ACTIVE
                    </span>
                    <span className="text-xs text-red-300 font-bold">{incident.id}</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-hud tracking-wide mt-0.5">
                    {incident.title}
                  </h3>
                </div>
              </div>

              {/* Time & Sector Indicator */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1 text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>TRIGGERED: <b>{incident.timestamp}</b></span>
                </div>
                <div className="bg-red-950 border border-red-500 px-2.5 py-1 rounded text-red-300 font-bold">
                  SECTOR: {incidentZone ? incidentZone.code : incident.zoneId}
                </div>
              </div>
            </div>

            {/* Middle Grid: Affected Personnel & Hazard Telemetry */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs">
              {/* Affected Miners */}
              <div className="bg-black/60 border border-red-500/40 p-3 rounded-xl">
                <span className="text-[10px] text-red-400 block font-bold mb-1">
                  AFFECTED MINER IN SECTOR
                </span>
                {affectedWorkers.map((miner) => (
                  <div key={miner.id} className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold font-hud">{miner.name}</span>
                      <span className="text-[10px] text-slate-400 block">{miner.id} • {miner.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-red-400 font-bold block">{miner.heartRate} BPM</span>
                      <span className="text-cyan-400 block">{miner.spO2}% SpO₂</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hazard Atmosphere Snapshot */}
              <div className="bg-black/60 border border-red-500/40 p-3 rounded-xl">
                <span className="text-[10px] text-amber-400 block font-bold mb-1">
                  ATMOSPHERIC HAZARD LEVEL
                </span>
                <p className="text-white font-bold mb-1">{incident.hazardMetrics}</p>
                <p className="text-[11px] text-slate-300 leading-snug">{incident.description}</p>
              </div>

              {/* Rescue Status & Robot ETA */}
              <div className="bg-black/60 border border-red-500/40 p-3 rounded-xl">
                <span className="text-[10px] text-cyan-400 block font-bold mb-1">
                  AUTONOMOUS RESCUE CORRIDOR
                </span>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-300">Robot Status:</span>
                  <span className="text-cyan-300 font-bold uppercase">{robot.status.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Safest Route:</span>
                  <span className="text-emerald-400 font-bold">A* COMPUTED (CLEAR)</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-red-500/30">
              <div className="flex flex-wrap items-center gap-2">
                {affectedWorkers.length > 0 && (
                  <>
                    <button
                      onClick={() => calculateRescuePathToWorker(affectedWorkers[0].id)}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>HIGHLIGHT SAFEST CORRIDOR</span>
                    </button>

                    <button
                      onClick={() => dispatchRobotToWorker(affectedWorkers[0].id)}
                      className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(255,183,3,0.4)]"
                    >
                      <Bot className="w-3.5 h-3.5" />
                      <span>DISPATCH RESCUE ROVER</span>
                    </button>
                  </>
                )}

                <button
                  onClick={toggleEvacuationAlarm}
                  className={`px-3 py-1.5 rounded-lg border font-bold text-xs flex items-center space-x-1.5 transition-all ${
                    isEvacuationAlarmActive
                      ? 'bg-red-600 text-white border-red-400'
                      : 'bg-red-950/80 text-red-300 border-red-700'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isEvacuationAlarmActive ? 'MINE SIREN SOUNDING' : 'TRIGGER MINE SIREN'}</span>
                </button>
              </div>

              <button
                onClick={() => resolveIncident(incident.id)}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-bold text-xs flex items-center space-x-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>MARK RESOLVED</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
