import { Worker, MineZone, SafetyStatus } from '../types';

/**
 * Calculates a multi-parameter AI risk score (0-100) for a worker based on:
 * - Heart rate anomaly (tachycardia / bradycardia)
 * - Blood Oxygen (SpO2) level
 * - Core Temperature
 * - Micro-climate gas exposure (CH4, CO, CO2, O2)
 * - Motion status (Fall Detected or stationary for too long)
 * - Environmental volatility of their current zone
 */
export function calculateWorkerRisk(
  worker: Partial<Worker>,
  zone?: MineZone
): { riskScore: number; status: SafetyStatus; flags: string[] } {
  let score = 0;
  const flags: string[] = [];

  const hr = worker.heartRate ?? 75;
  const spO2 = worker.spO2 ?? 98;
  const temp = worker.temperature ?? 37.0;
  const ch4 = worker.ch4 ?? 0.05;
  const co = worker.co ?? 5;
  const o2 = worker.o2 ?? 20.9;
  const motion = worker.motionStatus ?? 'active';
  const fall = worker.fallDetected ?? false;
  const sos = worker.sosActive ?? false;

  // 1. SOS & Fall Trigger (Immediate Max Priority)
  if (sos) {
    score += 50;
    flags.push('MANUAL SOS ACTIVE');
  }
  if (fall) {
    score += 45;
    flags.push('MAN DOWN / FALL DETECTED');
  } else if (motion === 'stationary') {
    score += 15;
    flags.push('Extended Inactivity');
  }

  // 2. Heart Rate Assessment
  if (hr > 130) {
    score += 35;
    flags.push(`Severe Tachycardia (${hr} BPM)`);
  } else if (hr > 105) {
    score += 20;
    flags.push(`Elevated Heart Rate (${hr} BPM)`);
  } else if (hr < 45) {
    score += 35;
    flags.push(`Severe Bradycardia (${hr} BPM)`);
  }

  // 3. SpO2 Blood Oxygen Level
  if (spO2 < 88) {
    score += 40;
    flags.push(`Critical Hypoxia (${spO2}% SpO2)`);
  } else if (spO2 < 93) {
    score += 25;
    flags.push(`Low Blood Oxygen (${spO2}% SpO2)`);
  }

  // 4. Body Core Temperature
  if (temp > 39.0) {
    score += 30;
    flags.push(`Severe Hyperthermia (${temp.toFixed(1)}°C)`);
  } else if (temp > 38.0) {
    score += 15;
    flags.push(`Heat Strain (${temp.toFixed(1)}°C)`);
  }

  // 5. Gas Inhalation & Ambient Risk
  if (ch4 >= 1.0) {
    score += 35;
    flags.push(`Explosive Gas Hazard (CH4: ${ch4.toFixed(2)}%)`);
  } else if (ch4 >= 0.5) {
    score += 18;
    flags.push(`Elevated Methane (CH4: ${ch4.toFixed(2)}%)`);
  }

  if (co >= 50) {
    score += 35;
    flags.push(`Toxic CO Level (${co} ppm)`);
  } else if (co >= 25) {
    score += 15;
    flags.push(`Elevated CO (${co} ppm)`);
  }

  if (o2 < 18.0) {
    score += 35;
    flags.push(`Asphyxiation Hazard (O2: ${o2.toFixed(1)}%)`);
  } else if (o2 < 19.5) {
    score += 15;
    flags.push(`Depleted Oxygen (${o2.toFixed(1)}%)`);
  }

  // 6. Zone Baseline Influence
  if (zone) {
    score += zone.baseRisk * 0.15;
    if (zone.isBlocked) {
      score += 25;
      flags.push('Zone Corridor Blocked');
    }
  }

  // Normalize 0..100
  const finalScore = Math.min(100, Math.max(0, Math.round(score)));

  let status: SafetyStatus = 'safe';
  if (finalScore >= 70 || sos || fall || spO2 < 88 || ch4 > 1.2) {
    status = 'critical';
  } else if (finalScore >= 35 || hr > 105 || spO2 < 94 || ch4 > 0.5 || co > 25) {
    status = 'warning';
  }

  return { riskScore: finalScore, status, flags };
}

/**
 * Returns formatted color codes and status badges for UI
 */
export function getStatusColor(status: SafetyStatus): {
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  hex: string;
  label: string;
} {
  switch (status) {
    case 'critical':
      return {
        badgeBg: 'bg-red-950/80',
        badgeText: 'text-red-400',
        badgeBorder: 'border-red-500/50',
        hex: '#ff3366',
        label: 'CRITICAL'
      };
    case 'warning':
      return {
        badgeBg: 'bg-amber-950/80',
        badgeText: 'text-amber-400',
        badgeBorder: 'border-amber-500/50',
        hex: '#ffb703',
        label: 'WARNING'
      };
    case 'safe':
    default:
      return {
        badgeBg: 'bg-emerald-950/80',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/50',
        hex: '#00ff88',
        label: 'SAFE'
      };
  }
}
