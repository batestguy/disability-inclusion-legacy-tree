/** Focus after a conditional panel renders, clear of any sticky page header. */
export function scrollAndFocus(element: HTMLElement | null) {
  if (!element) return;
  const header = document.querySelector<HTMLElement>(".dashboard-header");
  const fixed = header && ["fixed", "sticky"].includes(getComputedStyle(header).position);
  const clearance = (fixed ? header.getBoundingClientRect().height : 0) + 24;
  element.focus({ preventScroll: true });
  window.scrollTo({ top: Math.max(0, window.scrollY + element.getBoundingClientRect().top - clearance), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
}
