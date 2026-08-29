export type SafetyStatus = 'safe' | 'warning' | 'critical';
export type MotionStatus = 'active' | 'walking' | 'stationary' | 'fall_detected';
export type RobotMissionMode = 'patrol' | 'navigating' | 'standby' | 'emergency_dispatch' | 'manual';
export type CameraMode = 'optical' | 'thermal' | 'lidar';

export interface VitalsHistoryPoint {
  time: string;
  heartRate: number;
  spO2: number;
  ch4: number;
}

export interface Worker {
  id: string;             // e.g. "MINER-101"
  name: string;           // e.g. "Vikram Rao"
  role: string;           // e.g. "Drill Specialist", "Safety Engineer", "Blasting Crew"
  bloodGroup: string;     // e.g. "O+", "A+", "B+"
  emergencyContact: string;
  jacketId: string;       // e.g. "JKT-ALPHA-09"
  zoneId: string;         // e.g. "ZONE-2"
  x: number;              // Map coordinate 0..1000
  y: number;              // Map coordinate 0..700
  heading: number;        // Angle 0..360
  heartRate: number;      // BPM (Normal: 65-95, Warning: 96-125, Critical: >125 or <45)
  spO2: number;           // % (Normal: 96-100%, Warning: 91-95%, Critical: <91%)
  temperature: number;    // °C (Normal: 36.5-37.5°C, Warning: >38°C, Critical: >39.2°C)
  ch4: number;            // Methane % vol (Normal: <0.5%, Warning: 0.5-1.0%, Critical: >1.0%)
  co: number;             // Carbon Monoxide ppm (Normal: <25ppm, Warning: 25-50ppm, Critical: >50ppm)
  co2: number;            // CO2 % (Normal: <0.5%, Warning: 0.5-1.5%, Critical: >1.5%)
  o2: number;             // Oxygen % (Normal: 19.5-23.5%, Warning: 18.0-19.4%, Critical: <18.0%)
  battery: number;        // Smart Jacket battery %
  motionStatus: MotionStatus;
  sosActive: boolean;
  fallDetected: boolean;
  signalStrength: number; // 0..100% (LoRa/UWB mesh link)
  status: SafetyStatus;
  riskScore: number;      // 0..100 composite risk calculated by AI
  lastPing: string;
  history: VitalsHistoryPoint[];
  ignoredStatus?: boolean; // If true, UI suppresses warning/critical states
}

export interface MineZone {
  id: string;             // e.g. "ZONE-1"
  code: string;           // e.g. "SEC-1"
  name: string;           // e.g. "Shaft A: Extraction Face"
  depthLevel: number;     // e.g. -350m
  baseRisk: number;       // 0..100
  ch4Level: number;       // % vol
  coLevel: number;        // ppm
  o2Level: number;        // %
  temperature: number;    // °C
  airflow: number;        // m³/s
  status: SafetyStatus;
  isBlocked: boolean;
  isEvacuated: boolean;
  color: string;
  polygon: Array<[number, number]>; // polygon boundary on 1000x700 map
  center: [number, number];
}

export interface RescueRobot {
  id: string;
  name: string;           // e.g. "AEGIS-UGV-01"
  model: string;          // e.g. "Titan-Subterranean Rover MK-IV"
  status: RobotMissionMode;
  x: number;
  y: number;
  heading: number;
  battery: number;        // %
  speed: number;          // m/s
  currentMission: string;
  frontGas: {
    ch4: number;
    co: number;
    o2: number;
    h2s: number;
  };
  lidarRadar: {
    front: number;        // meters clearance
    back: number;
    left: number;
    right: number;
  };
  obstacleDetected: boolean;
  cameraFeedMode: CameraMode;
  targetWorkerId: string | null;
  targetCoords: [number, number] | null;
  generatedMapPoints: Array<[number, number]>;
}

export interface FixedSensorNode {
  id: string;
  name: string;
  zoneId: string;
  x: number;
  y: number;
  type: 'gas_multi' | 'seismic' | 'ventilation' | 'optical_barrier';
  ch4: number;
  co: number;
  co2: number;
  o2: number;
  temperature: number;
  humidity: number;
  vibration: number;     // mm/s (seismic)
  fanRpm: number;        // for ventilation
  status: SafetyStatus;
  battery: number;
}

export interface EmergencyIncident {
  id: string;
  title: string;
  type: 'gas_leak' | 'roof_collapse' | 'worker_sos' | 'fall_detected' | 'low_oxygen' | 'high_heat';
  severity: 'critical' | 'warning';
  timestamp: string;
  affectedWorkerIds: string[];
  zoneId: string;
  description: string;
  hazardMetrics: string;
  safestRescueRoute: Array<[number, number]>;
  resolved: boolean;
}

export interface AIAnomalyPrediction {
  id: string;
  timestamp: string;
  type: 'gas_surge_prediction' | 'worker_cardiac_anomaly' | 'seismic_destabilization' | 'ventilation_choke' | 'cluster_risk';
  targetZoneId?: string;
  targetWorkerId?: string;
  confidence: number;    // % 0..100
  timeToCritical: string; // e.g. "3.5 mins"
  message: string;
  severity: SafetyStatus;
}
