// @ts-nocheck
import { useEffect, useRef } from 'react';

type BottomSheetMetrics = {
  touchStart: {
    sheetY: number;
    touchY: number;
  };
  touchMove: {
    prevTouchY?: number;
    movingDirection: 'none' | 'down' | 'up';
  };
  isContentAreaTouched: boolean;
};

export function useBottomSheet() {
  const sheet = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);

  const metrics = useRef<BottomSheetMetrics>({
    touchStart: { sheetY: 0, touchY: 0 },
    touchMove: { prevTouchY: 0, movingDirection: 'none' },
    isContentAreaTouched: false,
  });

  const MAX_Y = useRef<number>(0);
  const MIN_Y = 60;
  const MIDDLE_Y = useRef<number>(0);

  useEffect(() => {
    MAX_Y.current = window.innerHeight - 160;
    MIDDLE_Y.current = (MIN_Y + MAX_Y.current) / 2;
  }, []);

  useEffect(() => {
    const canUserMoveBottomSheet = () => {
      const { touchMove, isContentAreaTouched } = metrics.current;
      if (!isContentAreaTouched) return true;
      if (sheet.current!.getBoundingClientRect().y !== MIN_Y) return true;
      if (touchMove.movingDirection === 'down') {
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
        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleEnd);
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

      if (touchMove.prevTouchY === undefined || touchMove.prevTouchY === 0) {
        touchMove.prevTouchY = touchStart.touchY;
      }

      touchMove.movingDirection =
        touchMove.prevTouchY < currentY ? 'down' : 'up';

      if (canUserMoveBottomSheet()) {
        e.preventDefault();
        const offset = currentY - touchStart.touchY;
        let nextY = touchStart.sheetY + offset;

        nextY = Math.max(MIN_Y, Math.min(nextY, MAX_Y.current));

        sheet.current!.style.transform = `translateY(${nextY - MAX_Y.current}px)`;
      } else {
        document.body.style.overflowY = 'hidden';
      }
    };

    const handleEnd = () => {
      document.body.style.overflowY = 'auto';
      const { touchMove } = metrics.current;
      const currentY = sheet.current!.getBoundingClientRect().y;

      if (currentY !== MIN_Y) {
        if (touchMove.movingDirection === 'down') {
          if (currentY > MIN_Y && currentY < MIDDLE_Y.current + 50) {
            sheet.current!.style.transform = `translateY(${MIDDLE_Y.current - MAX_Y.current}px)`;
          } else {
            sheet.current!.style.transform = 'translateY(0)';
          }
        }

        if (touchMove.movingDirection === 'up') {
          if (currentY < MAX_Y.current && currentY > MIDDLE_Y.current - 50) {
            sheet.current!.style.transform = `translateY(${MIDDLE_Y.current - MAX_Y.current}px)`;
          } else {
            sheet.current!.style.transform = `translateY(${MIN_Y - MAX_Y.current}px)`;
          }
        }
      }

      metrics.current = {
        touchStart: { sheetY: 0, touchY: 0 },
        touchMove: { prevTouchY: 0, movingDirection: 'none' },
        isContentAreaTouched: false,
      };

      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleEnd);
    };

    const node = sheet.current;
    node?.addEventListener('touchstart', handleStart);
    node?.addEventListener('touchmove', handleMove);
    node?.addEventListener('touchend', handleEnd);
    node?.addEventListener('mousedown', handleStart);

    return () => {
      node?.removeEventListener('touchstart', handleStart);
      node?.removeEventListener('touchmove', handleMove);
      node?.removeEventListener('touchend', handleEnd);
      node?.removeEventListener('mousedown', handleStart);
    };
  }, []);

  useEffect(() => {
    const handleTouchStart = () => {
      metrics.current.isContentAreaTouched = true;
    };
    content.current?.addEventListener('touchstart', handleTouchStart);
    return () => {
      content.current?.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  return { sheet, content };
}
