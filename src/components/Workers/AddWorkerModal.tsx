import React, { useState } from 'react';
import { useMineSafety } from '../../context/MineSafetyContext';
import { X, UserPlus, Shield, User, Phone, MapPin, Radio } from 'lucide-react';

export const AddWorkerModal: React.FC = () => {
  const { isAddWorkerOpen, setIsAddWorkerOpen, zones, addWorker } = useMineSafety();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Continuous Miner Operator');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('+91 98401 00000');
  const [zoneId, setZoneId] = useState(zones[1]?.id || 'ZONE-1');
  const [jacketId, setJacketId] = useState(`JKT-AL-${Math.floor(10 + Math.random() * 90)}`);
  const [workerId, setWorkerId] = useState(`MINER-${Math.floor(120 + Math.random() * 80)}`);

  if (!isAddWorkerOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Pick sector center coordinate with slight random offset
    const assignedZone = zones.find((z) => z.id === zoneId) || zones[0];
    const x = assignedZone.center[0] + (Math.random() - 0.5) * 40;
    const y = assignedZone.center[1] + (Math.random() - 0.5) * 40;

    addWorker({
      id: workerId,
      name,
      role,
      bloodGroup,
      emergencyContact,
      jacketId,
      zoneId,
      x: Math.round(x),
      y: Math.round(y),
      heartRate: 74 + Math.floor(Math.random() * 10),
      spO2: 98 + Math.floor(Math.random() * 2),
      temperature: 36.8 + (Math.random() * 0.4),
      ch4: assignedZone.ch4Level,
      co: assignedZone.coLevel,
      co2: 0.05,
      o2: assignedZone.o2Level,
      battery: 98,
      motionStatus: 'active',
      sosActive: false,
      fallDetected: false,
      signalStrength: 95
    });

    setIsAddWorkerOpen(false);
    // Reset form fields
    setName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#090e1a] border border-cyan-500/50 shadow-[0_0_35px_rgba(0,240,255,0.25)] p-6 font-mono text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-900/50 pb-3.5 mb-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center text-cyan-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-hud tracking-wide">
                REGISTER NEW MINER & SMART JACKET
              </h3>
              <p className="text-xs text-slate-400">Subterranean Shift Entry & IoT Provisioning</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddWorkerOpen(false)}
            className="p-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Worker ID */}
            <div>
              <label className="block text-slate-400 mb-1">WORKER ID / BADGE</label>
              <input
                type="text"
                value={workerId}
                onChange={(e) => setWorkerId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Smart Jacket Hardware ID */}
            <div>
              <label className="block text-slate-400 mb-1">SMART JACKET IoT ID</label>
              <input
                type="text"
                value={jacketId}
                onChange={(e) => setJacketId(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-cyan-400 font-bold focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-slate-400 mb-1">FULL NAME</label>
            <input
              type="text"
              placeholder="e.g. Ramesh Chandra Mahato"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none text-sm font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Operational Role */}
            <div>
              <label className="block text-slate-400 mb-1">OPERATIONAL ROLE</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="Continuous Miner Operator">Continuous Miner Operator</option>
                <option value="Blasting & Roof Bolting Tech">Blasting & Roof Bolting Tech</option>
                <option value="Subterranean Electrician">Subterranean Electrician</option>
                <option value="Shaft Ventilation Inspector">Shaft Ventilation Inspector</option>
                <option value="Chief Safety Engineer">Chief Safety Engineer</option>
                <option value="Drill & Haulage Specialist">Drill & Haulage Specialist</option>
                <option value="Rescue Response Medic">Rescue Response Medic</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-slate-400 mb-1">BLOOD GROUP</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              >
                <option value="O+">O Positive (O+)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="O-">O Negative (O-)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB-">AB Negative (AB-)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Assigned Mine Sector */}
            <div>
              <label className="block text-slate-400 mb-1">DEPLOYMENT SECTOR</label>
              <select
                value={zoneId}
                onChange={(e) => setZoneId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-cyan-300 focus:border-cyan-400 focus:outline-none"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.code}: {zone.name} ({zone.depthLevel}m)
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Phone */}
            <div>
              <label className="block text-slate-400 mb-1">EMERGENCY PHONE</label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddWorkerOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span>DEPLOY MINER TO MINE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
