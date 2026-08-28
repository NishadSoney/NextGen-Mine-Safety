import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  User, 
  Heart, 
  Droplets, 
  Thermometer, 
  Battery, 
  Radio, 
  Trash2, 
  Search, 
  UserPlus, 
  Bot, 
  ShieldAlert, 
  Activity 
} from 'lucide-react';
import { getStatusColor } from '../../utils/riskEngine';
import { Worker } from '../../types';

export const WorkerList: React.FC = () => {
  const {
    workers,
    zones,
    searchFilter,
    statusFilter,
    setSearchFilter,
    setStatusFilter,
    selectWorker,
    removeWorker,
    dispatchRobotToWorker,
    calculateRescuePathToWorker,
    setIsAddWorkerOpen
  } = useMineSafety();

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.role.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.jacketId.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getZoneName = (zoneId: string) => {
    const z = zones.find((item) => item.id === zoneId);
    return z ? `${z.code} - ${z.name}` : zoneId;
  };

  return (
    <div className="w-full flex flex-col space-y-4">
      {/* Top Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 border border-cyan-900/40 p-3 rounded-xl backdrop-blur-md">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search miner ID, name, role, jacket #..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1 rounded transition-all ${
              statusFilter === 'all'
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ALL ({workers.length})
          </button>
          <button
            onClick={() => setStatusFilter('critical')}
            className={`px-3 py-1 rounded transition-all ${
              statusFilter === 'critical'
                ? 'bg-red-950 text-red-400 border border-red-500/50'
                : 'text-slate-400 hover:text-red-400'
            }`}
          >
            🔴 CRITICAL ({workers.filter((w) => w.status === 'critical').length})
          </button>
          <button
            onClick={() => setStatusFilter('warning')}
            className={`px-3 py-1 rounded transition-all ${
              statusFilter === 'warning'
                ? 'bg-amber-950 text-amber-400 border border-amber-500/50'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            🟡 WARNING ({workers.filter((w) => w.status === 'warning').length})
          </button>
          <button
            onClick={() => setStatusFilter('safe')}
            className={`px-3 py-1 rounded transition-all ${
              statusFilter === 'safe'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            🟢 SAFE ({workers.filter((w) => w.status === 'safe').length})
          </button>
        </div>

        {/* Add Miner Button */}
        <button
          onClick={() => setIsAddWorkerOpen(true)}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-bold font-mono text-xs shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>REGISTER NEW MINER</span>
        </button>
      </div>

      {/* Miners Grid Card View */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredWorkers.map((worker) => {
          const colors = getStatusColor(worker.status);
          const isDanger = worker.status === 'critical';

          return (
            <div
              key={worker.id}
              className={`relative rounded-xl border p-4 transition-all duration-200 backdrop-blur-md flex flex-col justify-between ${
                isDanger
                  ? 'bg-red-950/20 border-red-500/60 shadow-[0_0_20px_rgba(255,51,102,0.15)]'
                  : 'bg-slate-900/60 border-slate-800/90 hover:border-cyan-500/50 hover:bg-slate-900/90'
              }`}
            >
              {/* Top Header Row */}
              <div>
                <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5 mb-3">
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center border font-bold text-sm font-mono ${
                        isDanger
                          ? 'bg-red-950/80 border-red-500 text-red-400 animate-pulse'
                          : 'bg-slate-800 border-slate-700 text-cyan-400'
                      }`}
                    >
                      {worker.id.split('-')[1] || worker.id}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white font-hud flex items-center gap-1.5">
                        {worker.name}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {worker.bloodGroup}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono">{worker.role}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
                    >
                      {worker.status.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Risk: <b className={isDanger ? 'text-red-400' : 'text-slate-200'}>{worker.riskScore}/100</b>
                    </span>
                  </div>
                </div>

                {/* Subterranean Zone Location */}
                <div className="text-[11px] font-mono text-slate-300 mb-3 bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800/60 flex items-center justify-between">
                  <span className="text-slate-400">SECTOR:</span>
                  <span className="text-cyan-300 font-bold truncate max-w-[180px]">
                    {getZoneName(worker.zoneId)}
                  </span>
                </div>

                {/* Live Biometrics & Gas Metrics Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 font-mono text-xs">
                  {/* Heart Rate */}
                  <div className="bg-slate-950/50 p-2 rounded border border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Heart className="w-3 h-3 text-red-400 animate-pulse" /> HR
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        worker.heartRate > 110 ? 'text-red-400 animate-pulse' : 'text-slate-100'
                      }`}
                    >
                      {worker.heartRate} <span className="text-[9px] font-normal text-slate-400">BPM</span>
                    </span>
                  </div>

                  {/* SpO2 */}
                  <div className="bg-slate-950/50 p-2 rounded border border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Droplets className="w-3 h-3 text-cyan-400" /> SpO₂
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        worker.spO2 < 93 ? 'text-red-400 animate-pulse' : 'text-slate-100'
                      }`}
                    >
                      {worker.spO2}%
                    </span>
                  </div>

                  {/* Body Temp */}
                  <div className="bg-slate-950/50 p-2 rounded border border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-amber-400" /> TEMP
                    </span>
                    <span className="font-bold text-sm text-slate-100">
                      {worker.temperature.toFixed(1)}°
                    </span>
                  </div>

                  {/* CH4 Gas Inhalation */}
                  <div className="bg-slate-950/50 p-2 rounded border border-slate-800 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      CH₄
                    </span>
                    <span
                      className={`font-bold text-sm ${
                        worker.ch4 > 0.8 ? 'text-red-400' : 'text-slate-100'
                      }`}
                    >
                      {worker.ch4}%
                    </span>
                  </div>
                </div>

                {/* Smart Jacket Status Banner */}
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/30 px-2 py-1 rounded border border-slate-800/40 mb-3">
                  <span className="flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-400" /> {worker.jacketId}
                  </span>
                  <span className="flex items-center gap-1">
                    <Battery className="w-3 h-3 text-emerald-400" /> {Math.round(worker.battery)}%
                  </span>
                  <span className="text-slate-400">
                    MOTION: <b className="text-cyan-300 uppercase">{worker.motionStatus.replace('_', ' ')}</b>
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center space-x-1.5 pt-2 border-t border-slate-800">
                <button
                  onClick={() => selectWorker(worker)}
                  className="flex-1 py-1.5 px-2.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-1 transition-all"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>INSPECT VITALS</span>
                </button>

                {isDanger && (
                  <button
                    onClick={() => dispatchRobotToWorker(worker.id)}
                    className="py-1.5 px-2 rounded bg-amber-950/80 border border-amber-500/50 text-amber-300 hover:bg-amber-900 text-xs font-mono font-bold flex items-center gap-1 transition-all"
                    title="Dispatch Rescue Robot to Miner"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>DISPATCH</span>
                  </button>
                )}

                <button
                  onClick={() => removeWorker(worker.id)}
                  className="p-1.5 rounded bg-slate-800/70 border border-slate-700 text-slate-400 hover:bg-red-950 hover:border-red-500 hover:text-red-400 transition-all"
                  title="Remove / Evacuate Miner from Shift"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="p-8 text-center bg-slate-900/40 border border-slate-800 rounded-xl">
          <p className="text-slate-400 font-mono text-sm">No miners found matching your search/filter criteria.</p>
        </div>
      )}
    </div>
  );
};
