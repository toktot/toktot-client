'use client';

import { useState, useEffect, useRef, ChangeEvent } from 'react';

// Entities & Hooks
import { useReviewImageManager } from '@/entities/review/lib/useReviewImageManager';
import { ReviewImage } from '@/entities/review/model/reviewImage';

// Features
import { ReviewImageWithTooltip } from './ReviewImageWithTooltip';
import { ReviewImageList } from './ReviewImageList';
import { ReviewImageUploader } from './ReviewImageUploader';

/**
 * @description 리뷰 작성의 전체적인 흐름과 상태를 관리하는 최상위 컴포넌트.
 * 이미지 업로드 전/후의 UI를 분기합니다.
 */
const WriteReviewView = () => {
  const {
    images,
    addImages,
    removeImage,
    updateTooltip,
    removeTooltip,
    canAddMore,
  } = useReviewImageManager();

  const [selectedImage, setSelectedImage] = useState<ReviewImage | null>(null);

  // 이미지 목록이 변경될 때 선택된 이미지를 관리
  useEffect(() => {
    // 선택된 이미지가 삭제된 경우, 목록의 첫 번째 이미지나 null로 변경
    if (selectedImage && !images.find((img) => img.id === selectedImage.id)) {
      setSelectedImage(images[0] || null);
    }
    // 이미지가 있는데 아무것도 선택되지 않은 경우, 첫 번째 이미지를 선택
    else if (!selectedImage && images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images, selectedImage]);

  // 이미지가 없는 경우, 업로더만 표시
  if (images.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
        <p className="text-gray-600 mb-4">리뷰를 작성할 사진을 올려주세요.</p>
        <ReviewImageUploader onUpload={addImages} />
      </div>
    );
  }

  // 이미지가 있는 경우, 메인 뷰 렌더링
  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* 1. 선택된 이미지와 툴팁 영역 */}
      <div className="flex-grow w-full relative">
        {selectedImage && (
          <ReviewImageWithTooltip
            image={selectedImage}
            onClose={() => {}}
            onUpdateTooltip={updateTooltip}
            onRemoveTooltip={removeTooltip}
          />
        )}
      </div>

      {/* 2. 하단 이미지 썸네일 목록 */}
      <div className="flex-shrink-0 w-full p-4 border-t border-gray-200">
        <div className="flex items-center gap-4 overflow-x-auto">
          {/* 추가 업로드 버튼 */}
          {canAddMore && <ReviewImageUploader onUpload={addImages} />}
          
          {/* 이미지 썸네일 리스트 */}
          <ReviewImageList
            images={images}
            onSelectImage={setSelectedImage}
            onDeleteImage={removeImage}
          />
        </div>
      </div>
    </div>
  );
};

export default WriteReviewView;
