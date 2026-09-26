import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  Cpu, 
  Activity, 
  Thermometer, 
  Droplets, 
  Battery, 
  Wifi, 
  AlertTriangle,
  ArrowUpRight,
  Flame,
  Signal
} from 'lucide-react';

export const BeamSensorGrid: React.FC = () => {
  const { beamSensors, zones, selectBeamSensor, selectedBeamSensor } = useMineSafety();

  const onlineSensors = beamSensors.filter(bs => bs.isOnline);
  const avgStrain = onlineSensors.length > 0 ? Math.round(onlineSensors.reduce((sum, bs) => sum + bs.strain, 0) / onlineSensors.length) : 0;

  return (
    <div className="w-full bg-[#090e1a]/90 backdrop-blur-md rounded-xl border border-indigo-900/40 p-4 font-mono text-slate-200 shadow-[0_0_30px_rgba(0,0,0,0.4)]">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-950/80 to-cyan-950/50 border border-indigo-500/40 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.2)]">
            <Cpu className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-hud tracking-wide flex items-center gap-2">
              SUPPORT BEAM SENSOR ARRAY
              <span className="text-[9px] bg-indigo-950/60 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-800/50 font-bold">
                LIVE TELEMETRY
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {onlineSensors.length}/{beamSensors.length} Sensors Online • Avg Strain: {avgStrain} µε
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NORMAL</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>ELEVATED</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            <span>CRITICAL</span>
          </div>
        </div>
      </div>

      {/* Sensor Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {beamSensors.map((bs, index) => {
          const zone = zones.find(z => z.id === bs.zoneId);
          const isSelected = selectedBeamSensor?.id === bs.id;
          const strainStatus = bs.strain > 400 ? 'critical' : bs.strain > 200 ? 'warning' : 'safe';
          const tiltStatus = bs.tilt > 3 ? 'critical' : bs.tilt > 1 ? 'warning' : 'safe';

          return (
            <div
              key={bs.id}
              onClick={() => selectBeamSensor(bs)}
              className={`sensor-box-card rounded-xl p-3 cursor-pointer animate-card-in ${
                isSelected
                  ? 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.25)]'
                  : ''
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center border text-[10px] font-bold ${
                    bs.isOnline
                      ? 'bg-indigo-950/60 border-indigo-500/40 text-indigo-400'
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                  }`}>
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white">{bs.id}</div>
                    <div className="text-[9px] text-slate-500">{bs.beamId}</div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${bs.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
              </div>

              {/* Zone */}
              <div className="text-[9px] text-slate-500 mb-2 flex items-center gap-1">
                <span>{zone ? `${zone.code} • ${zone.depthLevel}m` : bs.zoneId}</span>
              </div>

              {/* Key Readings */}
              <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                {/* Strain */}
                <div className="bg-slate-950/80 rounded p-1.5 border border-slate-800/60">
                  <div className="text-[8px] text-slate-500 flex items-center gap-0.5">
                    <Activity className="w-2.5 h-2.5" />
                    STRAIN
                  </div>
                  <div className={`text-[11px] font-bold ${
                    strainStatus === 'critical' ? 'text-red-400' : strainStatus === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {bs.strain} µε
                  </div>
                </div>

                {/* Vibration */}
                <div className="bg-slate-950/80 rounded p-1.5 border border-slate-800/60">
                  <div className="text-[8px] text-slate-500 flex items-center gap-0.5">
                    <Signal className="w-2.5 h-2.5" />
                    VIBR
                  </div>
                  <div className={`text-[11px] font-bold ${bs.vibration > 3 ? 'text-amber-400' : 'text-white'}`}>
                    {bs.vibration} mm/s
                  </div>
                </div>

                {/* Tilt */}
                <div className="bg-slate-950/80 rounded p-1.5 border border-slate-800/60">
                  <div className="text-[8px] text-slate-500 flex items-center gap-0.5">
                    <ArrowUpRight className="w-2.5 h-2.5" />
                    TILT
                  </div>
                  <div className={`text-[11px] font-bold ${
                    tiltStatus === 'critical' ? 'text-red-400' : tiltStatus === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {bs.tilt}°
                  </div>
                </div>
              </div>

              {/* Environmental Row */}
              <div className="grid grid-cols-2 gap-1.5 mb-2">
                <div className="flex items-center justify-between text-[9px] bg-slate-950/60 rounded px-1.5 py-1 border border-slate-800/40">
                  <span className="text-slate-500 flex items-center gap-0.5"><Flame className="w-2.5 h-2.5 text-amber-500" /> CH₄</span>
                  <span className={`font-bold ${bs.ch4 > 0.8 ? 'text-red-400' : 'text-white'}`}>{bs.ch4}%</span>
                </div>
                <div className="flex items-center justify-between text-[9px] bg-slate-950/60 rounded px-1.5 py-1 border border-slate-800/40">
                  <span className="text-slate-500 flex items-center gap-0.5"><Thermometer className="w-2.5 h-2.5 text-cyan-500" /> TEMP</span>
                  <span className="font-bold text-white">{bs.temperature}°C</span>
                </div>
              </div>

              {/* Footer: Battery & Signal */}
              <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1.5 border-t border-slate-800/40">
                <div className="flex items-center gap-1">
                  <Battery className="w-3 h-3 text-emerald-400" />
                  <span>{bs.battery}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>{bs.signalStrength}%</span>
                </div>
                <span className="text-slate-600">{bs.lastTransmission}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
