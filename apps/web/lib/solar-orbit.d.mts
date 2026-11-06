type Point = { x: number; y: number; z: number; scale: number };
export type SolarOrbit = { height: number; sun: number; planet: number; lane: number; gap: number; ring: number; laneHeight: number; verticalWords: boolean; compact: boolean; points: Point[] };
export function fitSolarOrbit(width: number, sun: number, planet: number, lane: number, gap: number): SolarOrbit | null;
export function orbitPoint(orbit: SolarOrbit, angle: number): Point;
