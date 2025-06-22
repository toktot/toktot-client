"use client";

import { useEffect, useRef, ReactNode } from "react";

type BottomSheetProps = {
  children: ReactNode;
};

type BottomSheetMetrics = {
  touchStart: {
    sheetY: number;
    touchY: number;
  };
  touchMove: {
    prevTouchY?: number;
    movingDirection: "none" | "down" | "up";
  };
  isContentAreaTouched: boolean;
};

const Y_POSITIONS = {
  FULL: 202,
  MAX: 261,
  MID2: 298,
  MID: 504,
  MIN: 705,
};

export const BottomSheet = ({ children }: BottomSheetProps) => {
  const sheet = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  const metrics = useRef<BottomSheetMetrics>({
    touchStart: { sheetY: 0, touchY: 0 },
    touchMove: { prevTouchY: 0, movingDirection: "none" },
    isContentAreaTouched: false,
  });

  const Y_VALUES = Object.values(Y_POSITIONS);

  const getClosestPosition = (y: number) => {
    return Y_VALUES.reduce((prev, curr) =>
      Math.abs(curr - y) < Math.abs(prev - y) ? curr : prev
    );
  };

  const setSheetPosition = (targetTop: number) => {
    if (sheet.current) {
      const translateY = targetTop - Y_POSITIONS.MIN;
      sheet.current.style.transform = `translateY(${translateY}px)`;
    }
  };

  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      const { touchMove, isContentAreaTouched } = metrics.current;
      if (!isContentAreaTouched) return true;
      if (sheet.current!.getBoundingClientRect().y !== Y_POSITIONS.MAX)
        return true;
      if (touchMove.movingDirection === "down") {
        return content.current!.scrollTop <= 0;
      }
      return false;
    };

    const handleStart = (e: TouchEvent | MouseEvent) => {
      const { touchStart } = metrics.current;
      touchStart.sheetY = sheet.current!.getBoundingClientRect().y;

      if (e instanceof TouchEvent) {
        touchStart.touchY = e.touches[0].clientY;
      } else {
        touchStart.touchY = e.clientY;
        document.addEventListener("mousemove", handleMove);
        document.addEventListener("mouseup", handleEnd);
      }
    };

    const handleMove = (e: TouchEvent | MouseEvent) => {
      const { touchStart, touchMove } = metrics.current;
      let currentY: number;

      if (e instanceof TouchEvent) {
        currentY = e.touches[0].clientY;
      } else {
        currentY = e.clientY;
      }

      if (!touchMove.prevTouchY) {
        touchMove.prevTouchY = touchStart.touchY;
      }

      touchMove.movingDirection =
        touchMove.prevTouchY < currentY ? "down" : "up";

      if (canUserMoveBottomSheet()) {
        e.preventDefault();
        const offset = currentY - touchStart.touchY;
        const nextY = touchStart.sheetY + offset;

        const clampedY = Math.min(
          Y_POSITIONS.MIN,
          Math.max(Y_POSITIONS.FULL, nextY)
        );
        sheet.current!.style.transform = `translateY(${clampedY - Y_POSITIONS.MIN}px)`;
      } else {
        document.body.style.overflowY = "hidden";
      }
    };

    const handleEnd = () => {
      document.body.style.overflowY = "auto";
      const currentY = sheet.current!.getBoundingClientRect().y;
      const closest = getClosestPosition(currentY);
      setSheetPosition(closest);

      metrics.current = {
        touchStart: { sheetY: 0, touchY: 0 },
        touchMove: { prevTouchY: 0, movingDirection: "none" },
        isContentAreaTouched: false,
      };

      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
    };

    const node = sheet.current;
    node?.addEventListener("touchstart", handleStart);
    node?.addEventListener("touchmove", handleMove);
    node?.addEventListener("touchend", handleEnd);
    node?.addEventListener("mousedown", handleStart);

    return () => {
      node?.removeEventListener("touchstart", handleStart);
      node?.removeEventListener("touchmove", handleMove);
      node?.removeEventListener("touchend", handleEnd);
      node?.removeEventListener("mousedown", handleStart);
    };
  }, []);

  useEffect(() => {
    const handleTouchStart = () => {
      metrics.current.isContentAreaTouched = true;
    };
    content.current?.addEventListener("touchstart", handleTouchStart);
    return () => {
      content.current?.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  return (

    <div
      ref={sheet}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl h-[600px] transition-transform z-50"
    >
      <div ref={content} className="overflow-y-auto h-full p-4">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;