import React from 'react';
import { useMineSafety } from './context/MineSafetyContext';
import { Header } from './components/Header';
import { MineRadarMap } from './components/TacticalMap/MineRadarMap';
import { WorkerList } from './components/Workers/WorkerList';
import { WorkerDetailModal } from './components/Workers/WorkerDetailModal';
import { AddWorkerModal } from './components/Workers/AddWorkerModal';
import { RobotHUD } from './components/Robot/RobotHUD';
import { RobotControls } from './components/Robot/RobotControls';
import { FixedSensorsGrid } from './components/Sensors/FixedSensorsGrid';
import { AIRiskMatrix } from './components/AIAnalytics/AIRiskMatrix';
import { HazardSimulator } from './components/AIAnalytics/HazardSimulator';
import { EmergencyPanel } from './components/Emergency/EmergencyPanel';
import { ResearchWhitepaper } from './components/Research/ResearchWhitepaper';
import { 
  Radar, 
  Users, 
  Bot, 
  Activity, 
  FileText, 
  Radio, 
  ShieldAlert, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, workers, incidents } = useMineSafety();

  const criticalWorkers = workers.filter((w) => w.status === 'critical');
  const activeIncidents = incidents.filter((i) => !i.resolved);

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-mono selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-[1700px] w-full mx-auto space-y-4">
        {/* Active Emergency Incidents Banner */}
        <EmergencyPanel />

        {/* Dynamic Tab Views */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4">
            {/* Split Screen: Tactical Map + Quick Biometrics & Robot Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Left 7 Cols: Tactical COD Radar Map */}
              <div className="lg:col-span-7 flex flex-col space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-cyan-400 font-hud flex items-center gap-1.5">
                    <Radar className="w-4 h-4" />
                    LIVE TACTICAL RADAR & SUBTERRANEAN DRIFT MAP
                  </span>
                  <button
                    onClick={() => setActiveTab('radar')}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>EXPAND RADAR</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <MineRadarMap compact={true} />
              </div>

              {/* Right 5 Cols: Active Miners Telemetry Stream */}
              <div className="lg:col-span-5 flex flex-col space-y-3">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-cyan-400 font-hud flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    PERSONNEL BIOMETRIC ROSTER ({workers.length} MINERS DEPLOYED)
                  </span>
                  <button
                    onClick={() => setActiveTab('workers')}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>VIEW ALL</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="max-h-[460px] overflow-y-auto pr-1">
                  <WorkerList />
                </div>
              </div>
            </div>

            {/* Bottom Row: Control Room Threat Simulator & AI Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-5">
                <HazardSimulator />
              </div>
              <div className="lg:col-span-7">
                <AIRiskMatrix />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Tactical Radar Map */}
        {activeTab === 'radar' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-cyan-400 font-hud flex items-center gap-2">
                <Radar className="w-5 h-5" />
                TACTICAL CALL-OF-DUTY SUBTERRANEAN RADAR OVERVIEW
              </h2>
            </div>
            <MineRadarMap compact={false} />
            <HazardSimulator />
          </div>
        )}

        {/* Tab 3: Workers & Smart Jackets Management */}
        {activeTab === 'workers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white font-hud flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                MINERS, SMART SAFETY JACKETS & BIOMETRIC TELEMETRY
              </h2>
            </div>
            <WorkerList />
          </div>
        )}

        {/* Tab 4: Autonomous Rescue Rover HUD */}
        {activeTab === 'robot' && (
          <div className="space-y-4">
            <RobotHUD />
            <RobotControls />
          </div>
        )}

        {/* Tab 5: Fixed Sensor Arrays & Gas Atmosphere */}
        {activeTab === 'sensors' && (
          <div className="space-y-4">
            <FixedSensorsGrid />
          </div>
        )}

        {/* Tab 6: AI Risk Engine & Predictions */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <AIRiskMatrix />
            <HazardSimulator />
          </div>
        )}

        {/* Tab 7: System Research & Tech Blueprint */}
        {activeTab === 'research' && (
          <div className="space-y-4">
            <ResearchWhitepaper />
          </div>
        )}
      </main>

      {/* Global Interactive Modals */}
      <WorkerDetailModal />
      <AddWorkerModal />
      <ResearchWhitepaper />
    </div>
  );
};
