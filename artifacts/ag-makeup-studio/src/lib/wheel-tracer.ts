/**
 * Complete runtime wheel event pipeline tracer for AG Makeup Studio.
 * Instruments:
 * (1) Native wheel events reaching window and document in capture & bubble phases.
 * (2) Intercepts preventDefault() calls with caller stack location.
 * (3) Reports event.defaultPrevented state at every stage.
 * (4) Inspects elements under pointer via document.elementFromPoint.
 * (5) Reports computed styles (pointer-events, overflow, position, z-index).
 * Zero changes to application behavior.
 */
import { getRelTime, logPerfEvent } from "./perf-logger";

export function initWheelTracer(): void {
  if (typeof window === "undefined") return;

  const traceWheelEvent = (phase: "capture" | "bubble", targetName: "window" | "document") => (e: WheelEvent) => {
    const time = getRelTime();

    // Wrap preventDefault to detect invocations and callers
    if (!(e as any).__preventDefaultWrapped) {
      (e as any).__preventDefaultWrapped = true;
      const origPrevent = e.preventDefault.bind(e);
      e.preventDefault = function () {
        const stack = new Error().stack;
        const callerLine = stack ? stack.split("\n")[2]?.trim() : "unknown";
        console.log(`[WheelTracer +${time}] preventDefault() CALLED by: ${callerLine}`);
        logPerfEvent(`preventDefault() called`, { caller: callerLine });
        return origPrevent();
      };
    }

    // Inspect element directly under pointer
    let elementUnderPointer: Element | null = null;
    let computedPointerEvents: string | null = null;
    let computedPosition: string | null = null;
    let computedZIndex: string | null = null;

    if (e.clientX !== undefined && e.clientY !== undefined) {
      try {
        elementUnderPointer = document.elementFromPoint(e.clientX, e.clientY);
        if (elementUnderPointer) {
          const style = window.getComputedStyle(elementUnderPointer);
          computedPointerEvents = style.pointerEvents;
          computedPosition = style.position;
          computedZIndex = style.zIndex;
        }
      } catch {
        // Safe fallback
      }
    }

    const bodyStyle = document.body ? window.getComputedStyle(document.body) : null;
    const htmlStyle = document.documentElement ? window.getComputedStyle(document.documentElement) : null;

    console.log(`[WheelTracer +${time}] [${targetName.toUpperCase()} ${phase.toUpperCase()}]`, {
      deltaY: e.deltaY,
      deltaX: e.deltaX,
      defaultPrevented: e.defaultPrevented,
      eventTarget: e.target,
      elementUnderPointer: elementUnderPointer ? {
        tagName: elementUnderPointer.tagName,
        className: elementUnderPointer.className,
        id: elementUnderPointer.id,
        pointerEvents: computedPointerEvents,
        position: computedPosition,
        zIndex: computedZIndex,
      } : null,
      cssOverflowState: {
        bodyOverflow: bodyStyle ? bodyStyle.overflow : "none",
        htmlOverflow: htmlStyle ? htmlStyle.overflow : "none",
      },
    });
  };

  window.addEventListener("wheel", traceWheelEvent("capture", "window"), { capture: true, passive: false });
  window.addEventListener("wheel", traceWheelEvent("bubble", "window"), { capture: false, passive: false });
  document.addEventListener("wheel", traceWheelEvent("capture", "document"), { capture: true, passive: false });
  document.addEventListener("wheel", traceWheelEvent("bubble", "document"), { capture: false, passive: false });

  console.log("[WheelTracer] Runtime Wheel Event Pipeline Tracer initialized.");
}
