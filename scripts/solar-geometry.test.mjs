import test from "node:test";
import assert from "node:assert/strict";
import { fitSolarOrbit, orbitPoint } from "../apps/web/lib/solar-orbit.mjs";

test("tight solar paths preserve clearance, click targets and screen bounds over a full revolution", () => {
  for (const [width, sun, planet, lane, gap] of [
    [1346, 320, 190, 100, 30], [1275, 320, 190, 100, 30], [1193, 320, 190, 100, 30],
    [945, 220, 170, 80, 24], [700, 160, 112, 54, 18], [530, 140, 112, 54, 18],
    [435, 140, 112, 54, 18], [338, 132, 88, 54, 18], [270, 132, 88, 54, 18],
  ]) {
    const orbit = fitSolarOrbit(width, sun, planet, lane, gap);
    assert.ok(orbit, `retain motion at ${width}px`);
    for (let degrees = .13; degrees < 360; degrees += .37) {
      const points = [0, 90, 180, 270].map(offset => {
        const point = orbitPoint(orbit, (degrees + offset) * Math.PI / 180);
        const q = 1100 / (1100 - point.z);
        return { x: point.x * q, y: point.y * q, r: orbit.planet / 2 * point.scale * q };
      });
      for (const p of points) {
        assert.ok(p.r * 2 >= 44, "click target remains usable");
        assert.ok(Math.abs(p.x) + p.r <= width / 2 - 7, "planet remains inside the screen");
        assert.ok(Math.hypot(p.x, p.y) - p.r - orbit.sun / 2 - orbit.ring >= 12, "portrait flag stays clear");
        for (const sign of [-1, 1]) {
          const inner = (orbit.sun / 2 + orbit.gap) * sign;
          const outer = inner + sign * orbit.lane;
          const dx = Math.max(Math.min(inner, outer) - p.x, 0, p.x - Math.max(inner, outer));
          const dy = Math.max(Math.abs(p.y) - orbit.laneHeight / 2, 0);
          assert.ok(Math.hypot(dx, dy) - p.r >= 12, "falling concept lane stays clear");
        }
      }
      for (let i = 0; i < points.length; i++) for (let j = i + 1; j < points.length; j++) {
        assert.ok(Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y) > points[i].r + points[j].r, "planets stay separate");
      }
    }
  }
  assert.ok(fitSolarOrbit(1346, 320, 190, 100, 30).height < 1000, "desktop scene is closer than the previous 1273px arena");
});
