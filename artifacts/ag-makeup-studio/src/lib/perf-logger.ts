/**
 * High-precision startup performance tracer for AG Makeup Studio.
 * Measures timing relative to performance.timeOrigin / navigationStart.
 */

const startTime = performance.timeOrigin || Date.now();

export function getRelTime(): string {
  return `${performance.now().toFixed(2)}ms`;
}

export function logPerfEvent(event: string, details?: any): void {
  const timeStr = getRelTime();
  if (details !== undefined) {
    console.log(`[Perf +${timeStr}] ${event}`, details);
  } else {
    console.log(`[Perf +${timeStr}] ${event}`);
  }
}

// Global helper for quick console inspection
if (typeof window !== "undefined") {
  (window as any).__perfLog = logPerfEvent;
}
