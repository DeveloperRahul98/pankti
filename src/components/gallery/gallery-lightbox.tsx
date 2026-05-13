"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import Image from "next/image";
import { useLightbox } from "@/lib/lightbox-store";
import { sceneImage, cn } from "@/lib/utils";

const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

export function GalleryLightbox() {
  const open = useLightbox((s) => s.open);
  const items = useLightbox((s) => s.items);
  const index = useLightbox((s) => s.index);
  const setIndex = useLightbox((s) => s.setIndex);
  const close = useLightbox((s) => s.close);
  const next = useLightbox((s) => s.next);
  const prev = useLightbox((s) => s.prev);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    panX: number;
    panY: number;
  }>({ active: false, startX: 0, startY: 0, panX: 0, panY: 0 });

  const stripRef = useRef<HTMLDivElement>(null);
  const activeThumbRef = useRef<HTMLButtonElement>(null);

  // Reset zoom on image change
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [index]);

  // Body scroll lock + keyboard
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "+" || e.key === "=")
        setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP));
      else if (e.key === "-" || e.key === "_")
        setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP));
      else if (e.key === "0") {
        setZoom(1);
        setPan({ x: 0, y: 0 });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, prev, next]);

  // Auto-center the active thumbnail
  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      activeThumbRef.current?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    });
  }, [index, open]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    // Zoom with wheel
    e.stopPropagation();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => {
      const next = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z + delta));
      if (next === 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    if (zoom <= 1) return; // swipe handled by motion drag below
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    setPan({
      x: dragRef.current.panX + (e.clientX - dragRef.current.startX),
      y: dragRef.current.panY + (e.clientY - dragRef.current.startY),
    });
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragRef.current.active) return;
    dragRef.current.active = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const onDoubleClick = () => {
    if (zoom === 1) setZoom(2);
    else {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  };

  if (!mounted) return null;

  const current = items[index];

  return createPortal(
    <AnimatePresence>
      {open && current && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] bg-black/95 flex flex-col"
        >
          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
            <div className="text-xs sm:text-sm text-white/80 tabular-nums">
              <span className="font-semibold text-white">{index + 1}</span>
              <span className="text-white/50"> / {items.length}</span>
              <span className="hidden sm:inline ml-3 text-white/80">
                {current.caption}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
                disabled={zoom <= ZOOM_MIN}
                title="Zoom out (−)"
                aria-label="Zoom out"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setZoom(1);
                  setPan({ x: 0, y: 0 });
                }}
                title="Reset zoom (0)"
                aria-label="Reset zoom"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
                disabled={zoom >= ZOOM_MAX}
                title="Zoom in (+)"
                aria-label="Zoom in"
                className="h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white disabled:opacity-30"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <span className="hidden sm:inline-flex h-9 px-3 items-center justify-center rounded-full bg-white/10 text-white text-[11px] font-semibold tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={close}
                title="Close (Esc)"
                aria-label="Close"
                className="h-9 w-9 ml-1 inline-flex items-center justify-center rounded-full bg-white/15 hover:bg-white/25 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Prev / Next arrows (desktop) */}
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="hidden sm:inline-flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="hidden sm:inline-flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image stage */}
          <div
            className="flex-1 min-h-0 flex items-center justify-center overflow-hidden select-none touch-none"
            onWheel={onWheel}
            onClick={close}
          >
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              drag={zoom === 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={(_, info) => {
                if (info.offset.x > 90) prev();
                else if (info.offset.x < -90) next();
              }}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={onDoubleClick}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                cursor:
                  zoom > 1
                    ? dragRef.current.active
                      ? "grabbing"
                      : "grab"
                    : "zoom-in",
              }}
              className="relative w-[92vw] h-[68vh] sm:w-[88vw] sm:h-[72vh] max-w-[1400px]"
            >
              <div
                style={{
                  transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                  transition: dragRef.current.active
                    ? "none"
                    : "transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
                className="w-full h-full relative"
              >
                <Image
                  src={sceneImage(current.id)}
                  alt={current.caption}
                  fill
                  sizes="92vw"
                  priority
                  className="object-contain pointer-events-none"
                  draggable={false}
                />
              </div>
            </motion.div>
          </div>

          {/* Caption (mobile inline) */}
          <div className="sm:hidden px-4 pb-2 text-center text-sm text-white/85 line-clamp-2">
            {current.caption}
          </div>

          {/* Thumbnail strip */}
          <div className="shrink-0 bg-gradient-to-t from-black/85 to-transparent pt-6 pb-3 sm:pb-5">
            <div
              ref={stripRef}
              className="flex items-center gap-2 overflow-x-auto scrollbar-thin scroll-smooth px-[50%] sm:px-[50%]"
              style={{ scrollPaddingInline: "50%" }}
            >
              {items.map((g, i) => {
                const active = i === index;
                return (
                  <button
                    key={g.id}
                    ref={active ? activeThumbRef : null}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Open ${g.caption}`}
                    aria-current={active}
                    className={cn(
                      "relative shrink-0 rounded-lg overflow-hidden transition-all duration-300 ease-out",
                      active
                        ? "h-20 w-20 sm:h-24 sm:w-24 ring-2 ring-primary ring-offset-2 ring-offset-black scale-105"
                        : "h-14 w-14 sm:h-16 sm:w-16 opacity-55 hover:opacity-100 hover:scale-105",
                    )}
                  >
                    <Image
                      src={sceneImage(g.id)}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
