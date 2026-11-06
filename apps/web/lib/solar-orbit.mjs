const samples = 720;

function solve(width, dimensions) {
  const { sun, planet, lane, gap, ring, laneHeight } = dimensions;
  const compact = width < 600;
  const points = [];
  let extentX = 0, extentY = 0;
  for (let index = 0; index < samples; index++) {
    const angle = index * 2 * Math.PI / samples;
    const depth = Math.sin(angle);
    const z = depth * (compact ? 26 : 90);
    const projection = 1100 / (1100 - z);
    const scale = compact ? .94 + (depth + 1) * .025 : .88 + (depth + 1) * .055;
    const radius = planet / 2 * scale * projection;
    const inner = sun / 2 + gap, outer = inner + lane;
    const safe = distance => {
      const x = Math.abs(Math.cos(angle) * distance), y = Math.abs(depth * distance);
      const dx = Math.max(inner - x, 0, x - outer), dy = Math.max(y - laneHeight / 2, 0);
      return distance >= sun / 2 + ring + radius + 14 && Math.hypot(dx, dy) >= radius + 14;
    };
    // Walk inward from outside the entire core, keeping the outermost safe path.
    let distance = Math.max(Math.hypot(outer, laneHeight / 2), sun / 2 + ring) + radius + 16;
    while (distance > 2 && safe(distance - 2)) distance -= 2;
    const x = Math.cos(angle) * distance, y = depth * distance;
    extentX = Math.max(extentX, Math.abs(x) + radius);
    extentY = Math.max(extentY, Math.abs(y) + radius);
    points.push({ x: x / projection, y: y / projection, z, scale });
  }
  if (extentX + 8 > width / 2) return null;
  return { ...dimensions, compact, height: Math.ceil(2 * (extentY + 20)), points };
}

/** A tight, continuous 3D orbit outside the portrait ring and both word streams. */
export function fitSolarOrbit(width, sun, planet, lane, gap) {
  if (![width, sun, planet, lane, gap].every(Number.isFinite) || width < 240) return null;
  for (let step = 0; step <= 8; step++) {
    const factor = 1 - step * .04;
    const adjustedSun = sun * factor;
    const orbit = solve(width, { sun: adjustedSun, planet, lane: lane * factor, gap: Math.max(26, gap * factor), ring: 24, laneHeight: adjustedSun * .84 + 100, verticalWords: false });
    if (orbit) return orbit;
  }
  // Slim vertical labels retain whole concept phrases beside the portrait on phones.
  const small = width < 310;
  for (let step = 0; step <= 5; step++) {
    const orbit = solve(width, {
      sun: width * (small ? .25 : .24) * (1 - step * .05),
      planet: small ? 60 : Math.min(80, Math.max(64, width * .22)),
      lane: small ? 12 : 16, gap: small ? 9 : 11, ring: small ? 6 : 8,
      laneHeight: 240, verticalWords: true,
    });
    if (orbit) return orbit;
  }
  return null;
}

export function orbitPoint(orbit, angle) {
  const position = ((angle / (2 * Math.PI) % 1 + 1) % 1) * samples;
  const index = Math.floor(position), fraction = position - index;
  const a = orbit.points[index], b = orbit.points[(index + 1) % samples];
  return Object.fromEntries(["x", "y", "z", "scale"].map(key => [key, a[key] + (b[key] - a[key]) * fraction]));
}
