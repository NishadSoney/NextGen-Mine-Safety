import React from 'react';
import { useMineSafety } from './context/MineSafetyContext';
import { Header } from './components/Header';
import { MineRadarMap } from './components/TacticalMap/MineRadarMap';
import { WorkerList } from './components/Workers/WorkerList';
import { ActiveEntityPanel } from './components/ActiveEntityPanel';
import { WorkerDetailModal } from './components/Workers/WorkerDetailModal';
import { AddWorkerModal } from './components/Workers/AddWorkerModal';
import { EmergencyPanel } from './components/Emergency/EmergencyPanel';
import { ResearchWhitepaper } from './components/Research/ResearchWhitepaper';
import { StagingDock } from './components/StagingDock';

export const App: React.FC = () => {
  const { activeTab, setActiveTab, workers, incidents } = useMineSafety();

  const criticalWorkers = workers.filter((w) => w.status === 'critical');
  const activeIncidents = incidents.filter((i) => !i.resolved);

  return (
    <div className="min-h-screen overflow-auto bg-[#070b14] text-slate-100 flex flex-col font-mono selection:bg-cyan-500 selection:text-black pb-12">
      {/* Top Header */}
      <Header />

      {/* Main Content Area */}
      <main className="flex-1 p-4 max-w-[1920px] w-full mx-auto flex flex-col gap-4 relative">
        {/* Active Emergency Incidents Banner */}
        <div className="flex-none">
          <EmergencyPanel />
        </div>

        {/* 3-Column Tactical Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[700px]">
          {/* Left Column: Active Entity Stats */}
          <div className="lg:col-span-3 h-full">
            <ActiveEntityPanel />
          </div>

          {/* Center Column: Tactical Radar Map */}
          <div className="lg:col-span-6 h-full flex flex-col">
            <MineRadarMap compact={false} />
          </div>

          {/* Right Column: Roster & Roster Actions */}
          <div className="lg:col-span-3 h-full">
            <WorkerList />
          </div>
        </div>

        {/* Bottom Staging Dock */}
        <div className="flex-none pb-4">
          <StagingDock />
        </div>
      </main>

      {/* Global Interactive Modals */}
      <AddWorkerModal />
      <ResearchWhitepaper />
    </div>
  );
};
