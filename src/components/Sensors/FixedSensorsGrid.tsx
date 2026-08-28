import React from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { 
  Cpu, 
  Wind, 
  Activity, 
  Flame, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Sliders 
} from 'lucide-react';
import { getStatusColor } from '../../utils/riskEngine';

export const FixedSensorsGrid: React.FC = () => {
  const { fixedSensors, zones, toggleZoneBlockade } = useMineSafety();

  return (
    <div className="w-full flex flex-col space-y-5 font-mono text-slate-200">
      {/* Subterranean Zone Atmospheric Status */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white font-hud tracking-wide flex items-center gap-2">
            <Wind className="w-4 h-4 text-cyan-400" />
            SUBTERRANEAN SECTOR ATMOSPHERE & VENTILATION SUMMARY
          </h3>
          <span className="text-xs text-slate-400">Fixed Scrutinizers: 4 Station Arrays</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {zones.map((zone) => {
            const colors = getStatusColor(zone.status);
            return (
              <div
                key={zone.id}
                className={`p-3.5 rounded-xl border backdrop-blur-md flex flex-col justify-between ${
                  zone.isBlocked
                    ? 'bg-red-950/20 border-red-500/60'
                    : 'bg-slate-900/70 border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2.5">
                    <div>
                      <h4 className="text-xs font-bold text-white font-hud">
                        {zone.code}: {zone.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">DEPTH: {zone.depthLevel}m</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors.badgeBg} ${colors.badgeText} ${colors.badgeBorder}`}
                    >
                      {zone.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">CH₄ METHANE</span>
                      <span className={`font-bold ${zone.ch4Level > 0.8 ? 'text-red-400' : 'text-slate-100'}`}>
                        {zone.ch4Level}% vol
                      </span>
                    </div>

                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">CO MONOXIDE</span>
                      <span className="font-bold text-slate-100">{zone.coLevel} ppm</span>
                    </div>

                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">O₂ OXYGEN</span>
                      <span className="font-bold text-cyan-400">{zone.o2Level}%</span>
                    </div>

                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <span className="text-slate-400 block text-[9px]">AIRFLOW</span>
                      <span className="font-bold text-emerald-400">{zone.airflow} m³/s</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-400">
                    STATUS: <b className={zone.isBlocked ? 'text-red-400' : 'text-emerald-400'}>{zone.isBlocked ? 'CORRIDOR BLOCKED' : 'CLEAR PASS'}</b>
                  </span>
                  <button
                    onClick={() => toggleZoneBlockade(zone.id)}
                    className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold"
                  >
                    {zone.isBlocked ? 'UNBLOCK' : 'SIMULATE BLOCK'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Telemetry Sensor Nodes Grid */}
      <div>
        <h3 className="text-sm font-bold text-white font-hud tracking-wide flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-cyan-400" />
          HARDWARE FIXED TELEMETRY NODES (ATEX ZONE-0 CERTIFIED)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {fixedSensors.map((sensor) => {
            return (
              <div
                key={sensor.id}
                className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                    <span className="text-xs font-bold text-cyan-300 font-hud">{sensor.name}</span>
                    <span className="text-[10px] text-slate-400">{sensor.id}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-300 mb-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sensor Type:</span>
                      <span className="text-white font-bold uppercase">{sensor.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Methane (CH4):</span>
                      <span className={sensor.ch4 > 0.8 ? 'text-red-400 font-bold' : 'text-white'}>{sensor.ch4}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Carbon Monoxide:</span>
                      <span className="text-white">{sensor.co} ppm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Seismic Vibration:</span>
                      <span className={sensor.vibration > 3 ? 'text-amber-400 font-bold' : 'text-white'}>
                        {sensor.vibration} mm/s
                      </span>
                    </div>
                    {sensor.fanRpm > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Vent Fan Speed:</span>
                        <span className="text-emerald-400 font-bold">{sensor.fanRpm} RPM</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                  <span>Mesh Link: 100% (LoRa)</span>
                  <span>Battery: {sensor.battery}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
