import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  Heart, 
  Droplets, 
  Thermometer, 
  Battery, 
  Radio, 
  Bot, 
  Search,
  User
} from 'lucide-react';
import { getStatusColor } from '../../utils/riskEngine';

export const WorkerList: React.FC = () => {
  const {
    workers,
    robot,
    isRobotDeployed,
    searchFilter,
    statusFilter,
    setSearchFilter,
    setStatusFilter,
    selectWorker,
    selectRobot,
    selectedWorker,
    selectedRobot
  } = useMineSafety();

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.id.toLowerCase().includes(searchFilter.toLowerCase()) ||
      w.role.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full h-full flex flex-col bg-[#090e1a]/90 backdrop-blur-md rounded-xl border border-slate-800/80 p-3 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      {/* Search & Filter */}
      <div className="flex flex-col space-y-2 mb-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search roster..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-[10px] font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div className="flex bg-slate-950 p-0.5 rounded border border-slate-800 text-[9px] font-mono w-full">
          {['all', 'safe', 'warning', 'critical'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`flex-1 py-1 rounded transition-all uppercase ${
                statusFilter === status
                  ? status === 'critical' ? 'bg-red-950/80 text-red-400' 
                  : status === 'warning' ? 'bg-amber-950/80 text-amber-400'
                  : status === 'safe' ? 'bg-emerald-950/80 text-emerald-400'
                  : 'bg-cyan-950/80 text-cyan-300'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Roster List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-2">
        {/* Robot Section */}
        {isRobotDeployed && (
          <div 
            onClick={() => selectRobot(robot)}
            className={`cursor-pointer rounded-lg border p-2 transition-all flex items-center justify-between ${
              selectedRobot?.id === robot.id
                ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <div className={`w-8 h-8 rounded flex flex-shrink-0 items-center justify-center border font-mono ${
                selectedRobot?.id === robot.id ? 'bg-cyan-950 border-cyan-400 text-cyan-400' : 'bg-slate-800 border-slate-700 text-cyan-500'
              }`}>
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white font-hud truncate">{robot.name}</h4>
                <p className="text-[9px] text-slate-400 font-mono truncate">{robot.status.replace('_', ' ').toUpperCase()}</p>
              </div>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <Battery className="w-3 h-3" />
              {Math.round(robot.battery)}%
            </div>
          </div>
        )}

        {/* Workers Section */}
        {filteredWorkers.map((worker) => {
          const colors = getStatusColor(worker.status);
          const isSelected = selectedWorker?.id === worker.id;

          return (
            <div
              key={worker.id}
              onClick={() => selectWorker(worker)}
              className={`cursor-pointer rounded-lg border p-2 transition-all flex items-center justify-between ${
                isSelected
                  ? `bg-cyan-950/40 border-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]`
                  : worker.status === 'critical' && !worker.ignoredStatus
                  ? 'bg-red-950/20 border-red-500/40 hover:bg-red-950/30'
                  : worker.status === 'warning' && !worker.ignoredStatus
                  ? 'bg-orange-950/20 border-orange-500/40 hover:bg-orange-950/30'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <div
                  className={`w-8 h-8 rounded flex flex-shrink-0 items-center justify-center border text-[10px] font-bold font-mono ${
                    worker.status === 'critical'
                      ? 'bg-red-950 border-red-500 text-red-400'
                      : isSelected
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-400'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  {worker.id.split('-')[1]}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-white font-hud truncate">{worker.name}</h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${colors.badgeBg.replace('bg-', 'bg-').replace('/20', '')}`} />
                    <span className="text-[9px] text-slate-400 font-mono truncate">{worker.role}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredWorkers.length === 0 && !isRobotDeployed && (
          <div className="text-center p-4">
            <p className="text-slate-500 font-mono text-[10px]">No entities found.</p>
          </div>
        )}
      </div>
    </div>
  );
};
