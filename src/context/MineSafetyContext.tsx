import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Worker, 
  MineZone, 
  RescueRobot, 
  FixedSensorNode, 
  EmergencyIncident, 
  AIAnomalyPrediction, 
  CameraMode, 
  RobotMissionMode,
  SafetyStatus
} from '../types';
import { 
  INITIAL_WORKERS, 
  INITIAL_ZONES, 
  INITIAL_ROBOT, 
  INITIAL_FIXED_SENSORS, 
  INITIAL_INCIDENTS, 
  INITIAL_ANOMALIES 
} from '../data/mockMineData';
import { calculateWorkerRisk } from '../utils/riskEngine';
import { findSafestRescueRoute } from '../utils/pathfinding';
import { soundFX } from '../utils/soundEffects';

interface MineSafetyContextType {
  workers: Worker[];
  zones: MineZone[];
  robot: RescueRobot;
  fixedSensors: FixedSensorNode[];
  incidents: EmergencyIncident[];
  anomalies: AIAnomalyPrediction[];
  activeRescueRoute: Array<[number, number]> | null;
  selectedWorker: Worker | null;
  selectedZone: MineZone | null;
  isSimulating: boolean;
  isAudioMuted: boolean;
  isEvacuationAlarmActive: boolean;
  isAddWorkerOpen: boolean;
  isResearchOpen: boolean;
  radarSweepAngle: number;
  activeTab: 'dashboard' | 'radar' | 'workers' | 'robot' | 'sensors' | 'analytics' | 'research';
  searchFilter: string;
  statusFilter: 'all' | 'safe' | 'warning' | 'critical';
  
  // Actions
  addWorker: (newWorker: Omit<Worker, 'history' | 'status' | 'riskScore' | 'lastPing' | 'heading'>) => void;
  removeWorker: (workerId: string) => void;
  updateWorkerVitals: (workerId: string, updates: Partial<Worker>) => void;
  selectWorker: (worker: Worker | null) => void;
  selectZone: (zone: MineZone | null) => void;
  toggleSimulating: () => void;
  toggleAudioMute: () => void;
  toggleEvacuationAlarm: () => void;
  setIsAddWorkerOpen: (open: boolean) => void;
  setIsResearchOpen: (open: boolean) => void;
  setActiveTab: (tab: 'dashboard' | 'radar' | 'workers' | 'robot' | 'sensors' | 'analytics' | 'research') => void;
  setSearchFilter: (query: string) => void;
  setStatusFilter: (filter: 'all' | 'safe' | 'warning' | 'critical') => void;
  
  // Robot controls
  dispatchRobotToWorker: (workerId: string) => void;
  setRobotCameraMode: (mode: CameraMode) => void;
  setRobotStatus: (status: RobotMissionMode) => void;
  manualRobotMove: (dx: number, dy: number) => void;
  returnRobotToBase: () => void;

  // Emergency Scenarios & Pathfinding
  calculateRescuePathToWorker: (workerId: string) => void;
  clearRescueRoute: () => void;
  resolveIncident: (incidentId: string) => void;
  triggerEmergencyScenario: (type: 'gas_leak' | 'fall_detected' | 'roof_collapse' | 'worker_sos') => void;
  resetAllSimulation: () => void;
  toggleZoneBlockade: (zoneId: string) => void;
}

const MineSafetyContext = createContext<MineSafetyContextType | null>(null);

export const MineSafetyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [workers, setWorkers] = useState<Worker[]>(INITIAL_WORKERS);
  const [zones, setZones] = useState<MineZone[]>(INITIAL_ZONES);
  const [robot, setRobot] = useState<RescueRobot>(INITIAL_ROBOT);
  const [fixedSensors, setFixedSensors] = useState<FixedSensorNode[]>(INITIAL_FIXED_SENSORS);
  const [incidents, setIncidents] = useState<EmergencyIncident[]>(INITIAL_INCIDENTS);
  const [anomalies, setAnomalies] = useState<AIAnomalyPrediction[]>(INITIAL_ANOMALIES);
  
  const [activeRescueRoute, setActiveRescueRoute] = useState<Array<[number, number]> | null>(
    INITIAL_INCIDENTS[0]?.safestRescueRoute || null
  );
  
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [selectedZone, setSelectedZone] = useState<MineZone | null>(null);
  
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isEvacuationAlarmActive, setIsEvacuationAlarmActive] = useState<boolean>(false);
  const [isAddWorkerOpen, setIsAddWorkerOpen] = useState<boolean>(false);
  const [isResearchOpen, setIsResearchOpen] = useState<boolean>(false);
  const [radarSweepAngle, setRadarSweepAngle] = useState<number>(0);
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'radar' | 'workers' | 'robot' | 'sensors' | 'analytics' | 'research'>('dashboard');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'safe' | 'warning' | 'critical'>('all');

  // Toggle Audio Mute
  const toggleAudioMute = () => {
    const nextState = !isAudioMuted;
    setIsAudioMuted(nextState);
    soundFX.setMuted(nextState);
  };

  const toggleSimulating = () => {
    soundFX.playBlip();
    setIsSimulating((prev) => !prev);
  };

  const toggleEvacuationAlarm = () => {
    const next = !isEvacuationAlarmActive;
    setIsEvacuationAlarmActive(next);
    if (next) {
      soundFX.playAlarm();
    }
  };

  // Add Worker Functionality
  const addWorker = (newWorkerData: Omit<Worker, 'history' | 'status' | 'riskScore' | 'lastPing' | 'heading'>) => {
    soundFX.playBlip();
    const zone = zones.find((z) => z.id === newWorkerData.zoneId) || zones[0];
    const { riskScore, status } = calculateWorkerRisk(newWorkerData, zone);

    const newWorker: Worker = {
      ...newWorkerData,
      heading: Math.floor(Math.random() * 360),
      status,
      riskScore,
      lastPing: 'Just now',
      history: [
        {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          heartRate: newWorkerData.heartRate,
          spO2: newWorkerData.spO2,
          ch4: newWorkerData.ch4
        }
      ]
    };

    setWorkers((prev) => [newWorker, ...prev]);
  };

  // Remove / Evacuate Worker Functionality
  const removeWorker = (workerId: string) => {
    soundFX.playBlip();
    setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    if (selectedWorker?.id === workerId) {
      setSelectedWorker(null);
    }
  };

  // Update specific worker vitals
  const updateWorkerVitals = (workerId: string, updates: Partial<Worker>) => {
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.id !== workerId) return w;
        const merged = { ...w, ...updates };
        const zone = zones.find((z) => z.id === merged.zoneId);
        const { riskScore, status } = calculateWorkerRisk(merged, zone);
        return { ...merged, riskScore, status };
      })
    );
  };

  // Calculate Safest Rescue Route using A*
  const calculateRescuePathToWorker = useCallback((workerId: string) => {
    const targetWorker = workers.find((w) => w.id === workerId);
    if (!targetWorker) return;

    // Rescue starts from Surface Portal or Robot current location
    const startCoord: [number, number] = [robot.x, robot.y];
    const targetCoord: [number, number] = [targetWorker.x, targetWorker.y];

    const route = findSafestRescueRoute(startCoord, targetCoord, zones);
    setActiveRescueRoute(route);
    soundFX.playRouteFound();
  }, [workers, robot.x, robot.y, zones]);

  // Dispatch Robot to Worker
  const dispatchRobotToWorker = (workerId: string) => {
    const target = workers.find((w) => w.id === workerId);
    if (!target) return;

    soundFX.playRadioBurst();
    setRobot((prev) => ({
      ...prev,
      status: 'emergency_dispatch',
      targetWorkerId: workerId,
      targetCoords: [target.x, target.y],
      currentMission: `Emergency Rescue Intercept -> ${target.name} (${target.id})`
    }));

    calculateRescuePathToWorker(workerId);
  };

  const setRobotCameraMode = (mode: CameraMode) => {
    soundFX.playBlip();
    setRobot((prev) => ({ ...prev, cameraFeedMode: mode }));
  };

  const setRobotStatus = (status: RobotMissionMode) => {
    soundFX.playBlip();
    setRobot((prev) => ({ ...prev, status }));
  };

  const manualRobotMove = (dx: number, dy: number) => {
    setRobot((prev) => {
      const nextX = Math.max(50, Math.min(950, prev.x + dx));
      const nextY = Math.max(50, Math.min(650, prev.y + dy));
      const heading = Math.round((Math.atan2(dy, dx) * 180) / Math.PI);
      return {
        ...prev,
        x: nextX,
        y: nextY,
        heading: (heading + 360) % 360,
        status: 'manual'
      };
    });
  };

  const returnRobotToBase = () => {
    soundFX.playRadioBurst();
    setRobot((prev) => ({
      ...prev,
      status: 'navigating',
      targetCoords: [170, 115],
      targetWorkerId: null,
      currentMission: 'Return to Surface Recharging Cradle (SEC-00)'
    }));
  };

  const clearRescueRoute = () => {
    setActiveRescueRoute(null);
  };

  const resolveIncident = (incidentId: string) => {
    soundFX.playBlip();
    setIncidents((prev) =>
      prev.map((inc) => (inc.id === incidentId ? { ...inc, resolved: true } : inc))
    );
  };

  const toggleZoneBlockade = (zoneId: string) => {
    soundFX.playBlip();
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, isBlocked: !z.isBlocked } : z))
    );
  };

  // Emergency Scenario Injections
  const triggerEmergencyScenario = (type: 'gas_leak' | 'fall_detected' | 'roof_collapse' | 'worker_sos') => {
    soundFX.playAlarm();
    const timestamp = new Date().toLocaleTimeString();

    if (type === 'gas_leak') {
      // Spike Methane in Sector 3 (Sub-Tunnel 4B)
      setZones((prev) =>
        prev.map((z) =>
          z.id === 'ZONE-3' ? { ...z, ch4Level: 2.1, coLevel: 68, status: 'critical' } : z
        )
      );
      setWorkers((prev) =>
        prev.map((w) =>
          w.zoneId === 'ZONE-3'
            ? { ...w, ch4: 2.1, co: 68, spO2: 89, heartRate: 132, status: 'critical', riskScore: 94 }
            : w
        )
      );
      const newInc: EmergencyIncident = {
        id: `INC-${Date.now().toString().slice(-4)}`,
        title: 'CRITICAL: Severe Methane Spike (>2.1%) in Sub-Tunnel 4B',
        type: 'gas_leak',
        severity: 'critical',
        timestamp,
        affectedWorkerIds: ['MINER-104'],
        zoneId: 'ZONE-3',
        description: 'Atmospheric methane level exceeds safety limit (2.1% vol). Immediate evacuation corridor generated.',
        hazardMetrics: 'CH4: 2.1% | CO: 68ppm | O2: 17.5% | LEL 42%',
        safestRescueRoute: findSafestRescueRoute([230, 130], [780, 520], zones),
        resolved: false
      };
      setIncidents((prev) => [newInc, ...prev]);
      calculateRescuePathToWorker('MINER-104');
    } else if (type === 'fall_detected') {
      // Worker 108 fall detected in Longwall
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === 'MINER-108'
            ? { ...w, fallDetected: true, motionStatus: 'fall_detected', heartRate: 128, status: 'critical', riskScore: 92 }
            : w
        )
      );
      const newInc: EmergencyIncident = {
        id: `INC-${Date.now().toString().slice(-4)}`,
        title: 'MAN DOWN: Fall Detected - Arjun Bedi (MINER-108)',
        type: 'fall_detected',
        severity: 'critical',
        timestamp,
        affectedWorkerIds: ['MINER-108'],
        zoneId: 'ZONE-2',
        description: 'Smart safety jacket 3-axis accelerometer registered sudden impact (7.2G) followed by complete cessation of movement.',
        hazardMetrics: 'Zero Motion | HR: 128 BPM | SpO2: 96%',
        safestRescueRoute: findSafestRescueRoute([230, 130], [710, 190], zones),
        resolved: false
      };
      setIncidents((prev) => [newInc, ...prev]);
      calculateRescuePathToWorker('MINER-108');
    } else if (type === 'roof_collapse') {
      // Block Sector 1 Haulage and create collapse incident
      setZones((prev) =>
        prev.map((z) =>
          z.id === 'ZONE-1' ? { ...z, isBlocked: true, status: 'critical' } : z
        )
      );
      const newInc: EmergencyIncident = {
        id: `INC-${Date.now().toString().slice(-4)}`,
        title: 'ROOF COLLAPSE & OBSTRUCTION: Main Haulage Drift Level 1',
        type: 'roof_collapse',
        severity: 'critical',
        timestamp,
        affectedWorkerIds: ['MINER-112'],
        zoneId: 'ZONE-1',
        description: 'Seismic acoustic sensors registered 5.4 mm/s vibration spike and rockfall obstruction. Primary corridor severed. Rerouting via Ventilation Bypass.',
        hazardMetrics: 'Obstruction: 85% Tunnel Area | Seismic: 5.4mm/s',
        safestRescueRoute: findSafestRescueRoute([170, 115], [780, 520], zones),
        resolved: false
      };
      setIncidents((prev) => [newInc, ...prev]);
    } else if (type === 'worker_sos') {
      // Manual SOS pressed by Worker 115
      setWorkers((prev) =>
        prev.map((w) =>
          w.id === 'MINER-115'
            ? { ...w, sosActive: true, status: 'critical', riskScore: 90, heartRate: 122 }
            : w
        )
      );
      const newInc: EmergencyIncident = {
        id: `INC-${Date.now().toString().slice(-4)}`,
        title: 'EMERGENCY SOS: Sunil Marandi (MINER-115)',
        type: 'worker_sos',
        severity: 'critical',
        timestamp,
        affectedWorkerIds: ['MINER-115'],
        zoneId: 'ZONE-4',
        description: 'Manual distress beacon triggered from Smart Safety Jacket JKT-AL-15 in Sector 4 Exhaust Adit.',
        hazardMetrics: 'SOS Distress Signal Latched | Signal: 92%',
        safestRescueRoute: findSafestRescueRoute([230, 130], [350, 440], zones),
        resolved: false
      };
      setIncidents((prev) => [newInc, ...prev]);
      calculateRescuePathToWorker('MINER-115');
    }
  };

  const resetAllSimulation = () => {
    soundFX.playBlip();
    setWorkers(INITIAL_WORKERS);
    setZones(INITIAL_ZONES);
    setRobot(INITIAL_ROBOT);
    setFixedSensors(INITIAL_FIXED_SENSORS);
    setIncidents(INITIAL_INCIDENTS);
    setAnomalies(INITIAL_ANOMALIES);
    setActiveRescueRoute(INITIAL_INCIDENTS[0]?.safestRescueRoute || null);
    setSelectedWorker(null);
    setIsEvacuationAlarmActive(false);
  };

  // Continuous Tactical Radar & Simulation Loop (Heartbeats, subtle movements, gas fluctuation)
  useEffect(() => {
    const radarInterval = setInterval(() => {
      setRadarSweepAngle((prev) => (prev + 2.5) % 360);
    }, 30);

    return () => clearInterval(radarInterval);
  }, []);

  // Periodic Telemetry Simulation Loop
  useEffect(() => {
    if (!isSimulating) return;

    const simInterval = setInterval(() => {
      // 1. Worker Micro-telemetry & Biometrics drift
      setWorkers((prevWorkers) =>
        prevWorkers.map((w) => {
          // If in critical mode / SOS, maintain elevated vitals
          const hrDelta = (Math.random() - 0.48) * 3;
          let nextHR = Math.round(Math.max(45, Math.min(180, w.heartRate + hrDelta)));
          let nextSpO2 = Math.round(Math.max(80, Math.min(100, w.spO2 + (Math.random() - 0.5) * 0.4)));
          
          if (w.sosActive || w.fallDetected) {
            nextHR = Math.max(115, nextHR);
            nextSpO2 = Math.min(92, nextSpO2);
          }

          // Micro-movement on map (slight pacing)
          let nextX = w.x;
          let nextY = w.y;
          let nextMotion = w.motionStatus;

          if (!w.fallDetected && w.motionStatus !== 'stationary') {
            const moveAngle = (w.heading * Math.PI) / 180;
            const step = (Math.random() - 0.2) * 1.5;
            nextX = Math.max(70, Math.min(920, w.x + Math.cos(moveAngle) * step));
            nextY = Math.max(60, Math.min(620, w.y + Math.sin(moveAngle) * step));
            if (Math.random() > 0.92) {
              w.heading = (w.heading + (Math.random() - 0.5) * 60 + 360) % 360;
            }
          }

          const currentZone = zones.find((z) => z.id === w.zoneId);
          const { riskScore, status } = calculateWorkerRisk(
            { ...w, heartRate: nextHR, spO2: nextSpO2, motionStatus: nextMotion },
            currentZone
          );

          // Update vitals history occasionally
          const history = [...w.history];
          if (Math.random() > 0.6) {
            history.push({
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              heartRate: nextHR,
              spO2: nextSpO2,
              ch4: w.ch4
            });
            if (history.length > 8) history.shift();
          }

          return {
            ...w,
            x: nextX,
            y: nextY,
            heartRate: nextHR,
            spO2: nextSpO2,
            battery: Math.max(5, w.battery - 0.01),
            riskScore,
            status,
            history
          };
        })
      );

      // 2. Robot autonomous patrol / navigation step
      setRobot((prev) => {
        if (prev.status === 'patrol') {
          // Autonomous wander around safe sectors
          const targetPoints = [
            [230, 130], [380, 160], [540, 150], [420, 260], [280, 220]
          ];
          const currentTgt = targetPoints[Math.floor(Date.now() / 6000) % targetPoints.length];
          const angle = Math.atan2(currentTgt[1] - prev.y, currentTgt[0] - prev.x);
          const nextX = prev.x + Math.cos(angle) * 1.2;
          const nextY = prev.y + Math.sin(angle) * 1.2;
          return {
            ...prev,
            x: nextX,
            y: nextY,
            heading: (Math.round((angle * 180) / Math.PI) + 360) % 360,
            battery: Math.max(10, prev.battery - 0.02)
          };
        } else if (prev.status === 'emergency_dispatch' && prev.targetCoords) {
          // Navigate towards target
          const angle = Math.atan2(prev.targetCoords[1] - prev.y, prev.targetCoords[0] - prev.x);
          const dist = Math.hypot(prev.targetCoords[0] - prev.x, prev.targetCoords[1] - prev.y);
          if (dist > 15) {
            return {
              ...prev,
              x: prev.x + Math.cos(angle) * 2.4,
              y: prev.y + Math.sin(angle) * 2.4,
              heading: (Math.round((angle * 180) / Math.PI) + 360) % 360,
              battery: Math.max(10, prev.battery - 0.04)
            };
          } else {
            return {
              ...prev,
              status: 'standby',
              currentMission: 'Target Intercept Reached — On-site Medical / Hazard Support Active'
            };
          }
        }
        return prev;
      });

      // 3. Fixed Sensors slight micro-fluctuations
      setFixedSensors((prevSensors) =>
        prevSensors.map((s) => ({
          ...s,
          ch4: Number(Math.max(0.01, s.ch4 + (Math.random() - 0.49) * 0.02).toFixed(2)),
          temperature: Number(Math.max(18, s.temperature + (Math.random() - 0.5) * 0.1).toFixed(1)),
          vibration: Number(Math.max(0.1, s.vibration + (Math.random() - 0.5) * 0.08).toFixed(1))
        }))
      );
    }, 1200);

    return () => clearInterval(simInterval);
  }, [isSimulating, zones]);

  // Keep selected worker updated with live changes
  useEffect(() => {
    if (selectedWorker) {
      const updated = workers.find((w) => w.id === selectedWorker.id);
      if (updated) {
        setSelectedWorker(updated);
      }
    }
  }, [workers]);

  return (
    <MineSafetyContext.Provider
      value={{
        workers,
        zones,
        robot,
        fixedSensors,
        incidents,
        anomalies,
        activeRescueRoute,
        selectedWorker,
        selectedZone,
        isSimulating,
        isAudioMuted,
        isEvacuationAlarmActive,
        isAddWorkerOpen,
        isResearchOpen,
        radarSweepAngle,
        activeTab,
        searchFilter,
        statusFilter,
        addWorker,
        removeWorker,
        updateWorkerVitals,
        selectWorker: setSelectedWorker,
        selectZone: setSelectedZone,
        toggleSimulating,
        toggleAudioMute,
        toggleEvacuationAlarm,
        setIsAddWorkerOpen,
        setIsResearchOpen,
        setActiveTab,
        setSearchFilter,
        setStatusFilter,
        dispatchRobotToWorker,
        setRobotCameraMode,
        setRobotStatus,
        manualRobotMove,
        returnRobotToBase,
        calculateRescuePathToWorker,
        clearRescueRoute,
        resolveIncident,
        triggerEmergencyScenario,
        resetAllSimulation,
        toggleZoneBlockade
      }}
    >
      {children}
    </MineSafetyContext.Provider>
  );
};

export const useMineSafety = () => {
  const context = useContext(MineSafetyContext);
  if (!context) {
    throw new Error('useMineSafety must be used within a MineSafetyProvider');
  }
  return context;
};
