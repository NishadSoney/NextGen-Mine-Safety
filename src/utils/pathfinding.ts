import { MineZone } from '../types';

export interface MapNode {
  id: string;
  x: number;
  y: number;
  zoneId: string;
  connections: string[]; // IDs of connected nodes
}

// Underground Mine Corridor Graph
export const MINE_GRAPH: MapNode[] = [
  { id: 'N_PORTAL', x: 170, y: 115, zoneId: 'ZONE-0', connections: ['N_JUNC_A'] },
  { id: 'N_JUNC_A', x: 280, y: 140, zoneId: 'ZONE-1', connections: ['N_PORTAL', 'N_HAULAGE_MID', 'N_REFUGE_WEST'] },
  { id: 'N_HAULAGE_MID', x: 430, y: 165, zoneId: 'ZONE-1', connections: ['N_JUNC_A', 'N_JUNC_B', 'N_INCLINE_MID'] },
  { id: 'N_JUNC_B', x: 580, y: 150, zoneId: 'ZONE-2', connections: ['N_HAULAGE_MID', 'N_LONGWALL', 'N_DEEP_CHUTE'] },
  { id: 'N_LONGWALL', x: 750, y: 175, zoneId: 'ZONE-2', connections: ['N_JUNC_B', 'N_LONGWALL_TAIL'] },
  { id: 'N_LONGWALL_TAIL', x: 860, y: 200, zoneId: 'ZONE-2', connections: ['N_LONGWALL', 'N_ESCAPE_CHUTE'] },
  
  { id: 'N_INCLINE_MID', x: 450, y: 280, zoneId: 'ZONE-1', connections: ['N_HAULAGE_MID', 'N_VENT_JUNC', 'N_SUB_4B_ENTRY'] },
  { id: 'N_DEEP_CHUTE', x: 620, y: 320, zoneId: 'ZONE-3', connections: ['N_JUNC_B', 'N_SUB_4B_ENTRY'] },
  
  { id: 'N_SUB_4B_ENTRY', x: 600, y: 440, zoneId: 'ZONE-3', connections: ['N_INCLINE_MID', 'N_DEEP_CHUTE', 'N_SUB_4B_FACE'] },
  { id: 'N_SUB_4B_FACE', x: 745, y: 485, zoneId: 'ZONE-3', connections: ['N_SUB_4B_ENTRY', 'N_SUB_4B_DEEP'] },
  { id: 'N_SUB_4B_DEEP', x: 850, y: 530, zoneId: 'ZONE-3', connections: ['N_SUB_4B_FACE'] },
  { id: 'N_ESCAPE_CHUTE', x: 890, y: 360, zoneId: 'ZONE-3', connections: ['N_LONGWALL_TAIL', 'N_SUB_4B_FACE'] },

  { id: 'N_VENT_JUNC', x: 370, y: 420, zoneId: 'ZONE-4', connections: ['N_INCLINE_MID', 'N_VENT_EXHAUST', 'N_REFUGE_EAST'] },
  { id: 'N_VENT_EXHAUST', x: 340, y: 550, zoneId: 'ZONE-4', connections: ['N_VENT_JUNC'] },

  { id: 'N_REFUGE_WEST', x: 200, y: 280, zoneId: 'ZONE-0', connections: ['N_JUNC_A', 'N_REFUGE_GATE'] },
  { id: 'N_REFUGE_EAST', x: 230, y: 460, zoneId: 'ZONE-4', connections: ['N_VENT_JUNC', 'N_REFUGE_GATE'] },
  { id: 'N_REFUGE_GATE', x: 190, y: 485, zoneId: 'ZONE-5', connections: ['N_REFUGE_WEST', 'N_REFUGE_EAST', 'N_REFUGE_CORE'] },
  { id: 'N_REFUGE_CORE', x: 135, y: 485, zoneId: 'ZONE-5', connections: ['N_REFUGE_GATE'] }
];

/**
 * Finds closest graph node to arbitrary coordinate (e.g. Worker or Robot position)
 */
export function findClosestNode(x: number, y: number): MapNode {
  let closest = MINE_GRAPH[0];
  let minDist = Infinity;

  for (const node of MINE_GRAPH) {
    const dist = Math.hypot(node.x - x, node.y - y);
    if (dist < minDist) {
      minDist = dist;
      closest = node;
    }
  }

  return closest;
}

/**
 * A* / Dijkstra Pathfinding Algorithm for subterranean mine rescue routing.
 * Avoids blocked sectors, penalized by hazardous gas plumes (CH4, CO) and heat.
 */
export function findSafestRescueRoute(
  startPos: [number, number],
  targetPos: [number, number],
  zones: MineZone[]
): Array<[number, number]> {
  const startNode = findClosestNode(startPos[0], startPos[1]);
  const targetNode = findClosestNode(targetPos[0], targetPos[1]);

  const zoneMap = new Map<string, MineZone>();
  zones.forEach((z) => zoneMap.set(z.id, z));

  const distances = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const unvisited = new Set<string>();

  MINE_GRAPH.forEach((node) => {
    distances.set(node.id, Infinity);
    previous.set(node.id, null);
    unvisited.add(node.id);
  });

  distances.set(startNode.id, 0);

  while (unvisited.size > 0) {
    // Pick unvisited node with lowest distance
    let currentId: string | null = null;
    let minD = Infinity;
    unvisited.forEach((id) => {
      const d = distances.get(id)!;
      if (d < minD) {
        minD = d;
        currentId = id;
      }
    });

    if (!currentId || minD === Infinity) break;
    if (currentId === targetNode.id) break;

    unvisited.delete(currentId);
    const currentNode = MINE_GRAPH.find((n) => n.id === currentId)!;

    for (const neighborId of currentNode.connections) {
      if (!unvisited.has(neighborId)) continue;
      const neighborNode = MINE_GRAPH.find((n) => n.id === neighborId)!;

      // Base Euclidean distance
      const euclideanDist = Math.hypot(currentNode.x - neighborNode.x, currentNode.y - neighborNode.y);

      // Hazard & Blocked Penalty Multiplier
      const neighborZone = zoneMap.get(neighborNode.zoneId);
      let hazardWeight = 1.0;

      if (neighborZone) {
        if (neighborZone.isBlocked) {
          hazardWeight = 50.0; // Extreme penalty for physically blocked collapses
        } else if (neighborZone.status === 'critical') {
          hazardWeight = 6.0;  // High penalty for toxic / high-methane zones
        } else if (neighborZone.status === 'warning') {
          hazardWeight = 2.0;  // Moderate penalty
        }
      }

      const alt = minD + euclideanDist * hazardWeight;
      if (alt < distances.get(neighborId)!) {
        distances.set(neighborId, alt);
        previous.set(neighborId, currentId);
      }
    }
  }

  // Reconstruct path
  const pathNodes: Array<[number, number]> = [];
  let curr: string | null = targetNode.id;

  while (curr) {
    const node = MINE_GRAPH.find((n) => n.id === curr);
    if (node) {
      pathNodes.unshift([node.x, node.y]);
    }
    curr = previous.get(curr) || null;
  }

  // Prepend actual start position and append target position
  const fullPath: Array<[number, number]> = [
    startPos,
    ...pathNodes,
    targetPos
  ];

  // Remove micro-duplicates
  return fullPath.filter((point, idx, arr) => {
    if (idx === 0) return true;
    const prev = arr[idx - 1];
    return Math.hypot(point[0] - prev[0], point[1] - prev[1]) > 5;
  });
}
