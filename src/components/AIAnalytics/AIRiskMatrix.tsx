import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  Activity, 
  BrainCircuit, 
  Flame, 
  ShieldAlert, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Zap, 
  AlertTriangle 
} from 'lucide-react';
import { getStatusColor } from '../../utils/riskEngine';

export const AIRiskMatrix: React.FC = () => {
  const { workers, anomalies, zones, calculateRescuePathToWorker, dispatchRobotToWorker } = useMineSafety();

  return (
    <div className="w-full flex flex-col space-y-6 font-mono text-slate-200">
      {/* Top Section: AI Predictive Anomaly Forecasts */}
      <div className="bg-slate-900/80 border border-cyan-900/40 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400">
              <BrainCircuit className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-hud tracking-wide">
                NEURAL RISK PREDICTOR & ATMOSPHERIC ANOMALY FORECAST (LSTM-ENGINE)
              </h3>
              <p className="text-xs text-slate-400">Early Danger Detection • Real-Time Confidence Scoring</p>
            </div>
          </div>
          <span className="text-xs bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-2.5 py-1 rounded">
            MODELS ONLINE: 4/4
          </span>
        </div>

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {anomalies.map((anom) => {
            const isCrit = anom.severity === 'critical';
            return (
              <div
                key={anom.id}
                className={`p-3.5 rounded-xl border flex flex-col justify-between ${
                  isCrit
                    ? 'bg-red-950/20 border-red-500/60 shadow-[0_0_15px_rgba(255,51,102,0.15)]'
                    : 'bg-slate-950/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> {anom.timestamp}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isCrit ? 'bg-red-950 text-red-400 border border-red-500' : 'bg-amber-950 text-amber-400 border border-amber-500'
                      }`}
                    >
                      {anom.confidence}% CONFIDENCE
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-white font-hud mb-1.5 flex items-center gap-1.5">
                    {isCrit ? <Flame className="w-3.5 h-3.5 text-red-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                    {anom.type.replace(/_/g, ' ').toUpperCase()}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                    {anom.message}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80">
                  <span className="text-slate-400">
                    EST. IMPACT: <b className="text-cyan-300">{anom.timeToCritical}</b>
                  </span>
                  {anom.targetWorkerId && (
                    <button
                      onClick={() => dispatchRobotToWorker(anom.targetWorkerId!)}
                      className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-500 text-black font-bold text-[10px]"
                    >
                      DISPATCH RESCUE
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Worker Composite Risk Score Ranking Matrix */}
      <div className="bg-slate-900/80 border border-cyan-900/40 p-4 rounded-xl backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white font-hud tracking-wide">
              MULTI-PARAMETRIC WORKER RISK MATRIX (0-100 INDEX)
            </h3>
          </div>
          <span className="text-xs text-slate-400">Real-Time Risk Ranking</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">WORKER / ROLE</th>
                <th className="py-2.5 px-3">SECTOR</th>
                <th className="py-2.5 px-3">HEART RATE</th>
                <th className="py-2.5 px-3">SpO₂</th>
                <th className="py-2.5 px-3">CH₄ EXPOSURE</th>
                <th className="py-2.5 px-3">MOTION</th>
                <th className="py-2.5 px-3">RISK SCORE</th>
                <th className="py-2.5 px-3">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {workers
                .slice()
                .sort((a, b) => b.riskScore - a.riskScore)
                .map((worker) => {
                  const colors = getStatusColor(worker.status);
                  const zone = zones.find((z) => z.id === worker.zoneId);

                  return (
                    <tr
                      key={worker.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        worker.status === 'critical' ? 'bg-red-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-3">
                        <div className="font-bold text-white font-hud">{worker.name}</div>
                        <div className="text-[10px] text-slate-400">{worker.id} • {worker.role}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-cyan-300 font-bold">{zone?.code}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={worker.heartRate > 105 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                          {worker.heartRate} BPM
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={worker.spO2 < 93 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                          {worker.spO2}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={worker.ch4 > 0.8 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                          {worker.ch4}%
                        </span>
                      </td>
                      <td className="py-3 px-3 uppercase text-[10px]">
                        <span className={worker.fallDetected ? 'text-red-400 font-bold' : 'text-slate-300'}>
                          {worker.motionStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full ${
                                worker.riskScore >= 70
                                  ? 'bg-red-500'
                                  : worker.riskScore >= 35
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${worker.riskScore}%` }}
                            />
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
                          >
                            {worker.riskScore}/100
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => calculateRescuePathToWorker(worker.id)}
                            className="px-2 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900 text-[10px] font-bold"
                          >
                            ROUTE
                          </button>
                          <button
                            onClick={() => dispatchRobotToWorker(worker.id)}
                            className="px-2 py-1 rounded bg-amber-950 border border-amber-500/40 text-amber-300 hover:bg-amber-900 text-[10px] font-bold"
                          >
                            ROBOT
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
