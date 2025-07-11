'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';

import { useTooltipManager } from '@/entities/review/lib/useTooltipManager';
import { useImageCoordinate } from '@/features/review/write/lib/useImageCoordinate';
import { TooltipMarker } from '@/features/review/ui/TooltipMarker';
import { TooltipBox } from '@/entities/review/ui/TooltipBox';
import { getTailDirection } from '@/shared/bubble/lib/getTailDirection';
import { getBubbleTransformFromMarker } from '@/shared/bubble/model/direction';
import { Bubble } from '@/shared/bubble/ui/Bubble';
import { Tooltip } from '@/entities/review/model/tooltip';
import PrimaryButton from '@/shared/components/PrimaryButton';
import Icon from '@/widgets/Icon';

interface ReviewModalProps {
  images: string[];
  onDone?: () => void;
}

export default function ReviewModal({ images, onDone }: ReviewModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { tooltips, addTooltip, removeTooltip, resetTooltips, error } = useTooltipManager();
  const [selectedTooltip, setSelectedTooltip] = useState<Tooltip | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);
  const { getRelativeCoord } = useImageCoordinate(imgRef);

  const currentImage = images[currentImageIndex];

  const handleImageClick = (e: React.MouseEvent) => {
    const coord = getRelativeCoord(e);
    if (!coord) return;

    // 임시 mock 데이터
    addTooltip({
      ...coord,
      category: 'food',
      menuName: '불고기',
      price: 13000,
      description: '음식리뷰 내용이 뜨는 곳이에요',
    } as Omit<Tooltip, 'id'>);
  };

  const handleMarkerClick = (tooltip: Tooltip) => {
    setSelectedTooltip((prev) => (prev?.id === tooltip.id ? null : tooltip));
  };
  const handleImageChange = (idx:number) => {
    setCurrentImageIndex(idx);
    resetTooltips();
    setSelectedTooltip(null);
  }
  const tooltipDirection =
    selectedTooltip && getTailDirection(selectedTooltip.x, selectedTooltip.y);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex flex-col items-center justify-center">
      {/* 상단: 이미지 영역 */}
      <div className="relative w-[375px] h-[644px] rounded-xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full px-4 py-3 z-20 flex justify-between items-center">
            <Icon name={"Back"} size="m"></Icon>
            <span className="text-white font-semibold text-lg">리뷰 쓰기</span>
            <div className="w-6"/>
        </div>
        <Image
          ref={imgRef}
          src={currentImage}
          alt="리뷰 이미지"
          fill
          onClick={handleImageClick}
          className="object-cover"
        />

        {tooltips.map((tip) => (
          <div
            key={tip.id}
            className="absolute"
            style={{ left: `${tip.x}%`, top: `${tip.y}%` }}
          >
            <div className="relative">
              <TooltipMarker tip={tip} onClick={handleMarkerClick} />
              {tooltipDirection && selectedTooltip?.id === tip.id && (
                <div
                  className="absolute z-10"
                  style={{
                    transform: getBubbleTransformFromMarker(tooltipDirection),
                  }}
                >
                  <Bubble direction={tooltipDirection}>
                  
                      <TooltipBox tooltip={tip} onDelete ={() => removeTooltip(tip.id)}/>
                      
                    
                  </Bubble>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {error && (
        <div className="mt-2 w-[342px] max-h-[54px] bg-grey-100 text-xs text-grey-30 rounded-xl px-4 py-3 flex items-center gap-2">
            <Icon name={"WarningMark"} size="m" className="text-[#FF2626]"/>
            <span>{error}</span>
        </div>
      )}

      {/* 하단: 미리보기 + 완료 버튼 */}
      <div className="mt-4 w-[320px] flex items-center px-4">
        <div className="flex gap-2 overflow-x-auto flex-grow">
          {images.map((src, idx) => (
            <button
              key={idx}
              onClick={() => handleImageChange(idx)}
              className={`w-10 h-10 rounded-md overflow-hidden border ${
                idx === currentImageIndex ? 'border-primary-40' : 'border-gray-300'
              }`}
            >
              <Image src={src} alt={`미리보기${idx}`} width={40} height={40} />
            </button>
          ))}
        </div>
        <PrimaryButton
            text="완료"
            onClick={onDone}
            className="ml-auto w-[120px] h-[48px] bg-grey-90 text-primary-60 rounded-full text-sm"
        />
          
      </div>
    </div>
  );
}
