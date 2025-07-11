'use client';

import Icon from '@/widgets/Icon';
import { Tooltip } from '../model/tooltip';

interface TooltipBoxProps {
  tooltip: Tooltip;
  onDelete?: (id: string) => void;
}

export const TooltipBox = ({ tooltip, onDelete }: TooltipBoxProps) => {
  const handleDelete = () => {
    if (onDelete) onDelete(tooltip.id);
  };

  return (
    <div className="relative min-w-[270px] max-w-xs bg-white rounded-xl p-3 shadow-md text-xs">
      {/* 삭제 버튼 */}
    <div className="absolute top-1/2 right-2 -translate-y-1/2 w-12 h-12 bg-[#FFF9F9] rounded-[12px] flex flex-col items-center justify-center text-red-500 cursor-pointer hover:shadow"
      onClick={handleDelete}>
      <Icon name={"Delete"} />
      <span className="text-[10px] font-semibold mt-[2px]">삭제하기</span>
        </div>
       

      {/* 상단 정보 */}
      <div className="mb-1 font-semibold text-grey-90 flex gap-2 items-center">
        {tooltip.category === 'food' && (
          <>
            <span>{tooltip.menuName}</span>
            <span className="text-grey-70 font-normal">
              {tooltip.price.toLocaleString()}원
            </span>
            <span className="text-grey-60 font-normal">평점</span>
          </>
        )}

        {tooltip.category === 'service' && (
          <>
            <span>서비스</span>
            <span className="text-grey-70 font-normal">평점</span>
          </>
        )}

        {tooltip.category === 'clean' && (
          <>
            <span>청결</span>
            <span className="text-grey-70 font-normal">평점</span>
          </>
        )}
      </div>

      {/* 설명 */}
      {tooltip.description && (
        <p className="text-grey-80 whitespace-pre-wrap">
          {tooltip.description}
        </p>
      )}
    </div>
  );
};
