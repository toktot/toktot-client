"use client";

import React, { useState } from 'react';
import CategorySelector from './CategorySelector';
import TextInputWithLabel from '../../../shared/components/TextInputWithLabel';
import QuantitySelector from './QuantitySelector';
import PrimaryButton from '../../../shared/components/PrimaryButton';
import RatingStars from '../../../shared/components/RatingStars';

type Category = '음식' | '서비스' | '청결';

interface ReviewDetailSheetProps {
  onNext?: () => void;
}

export default function ReviewDetailSheet({ onNext }: ReviewDetailSheetProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('음식');
  const [foodName, setFoodName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState('');
  const [rating, setRating] = useState<(0 | 0.5 | 1)[]>([0, 0, 0, 0, 0]);

  const hasAtLeastOneRating = rating.some((r) => r > 0);
  // disabled 조건 계산
const isFoodValid =
  foodName.trim() !== "" &&
  price.trim() !== "" &&
  quantity > 0 &&
  hasAtLeastOneRating;



const isButtonEnabled =
  selectedCategory === "음식" ? isFoodValid : hasAtLeastOneRating;

  const handleNext = () => {
    // 여기서 데이터 처리 로직을 추가할 수 있습니다
    console.log({
      category: selectedCategory,
      foodName,
      quantity,
      price,
      rating
    });
    onNext?.();
  };

  const renderFoodCategory = () => (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <TextInputWithLabel
          value={foodName}
          onChange={setFoodName}
          placeholder="음식을 입력하세요"
          inputClassName="max-w-[296px] h-[62px]"
        />
        <span className="text-grey-90 text-sm font-medium w-[37px] h-[25px] flex items-center justify-center">은/는</span>
      </div>
      
      <div className="flex items-center gap-2">
        <QuantitySelector
          value={quantity}
          onChange={setQuantity}
        />
        <span className="text-grey-90 text-sm font-medium w-[31px] h-[25px] flex items-center justify-center">인분</span>
        <span className="text-grey-80 text-sm font-medium w-[45px] h-[24px] flex items-center justify-center pr-[20px]">으로</span>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-[180px] h-[62px]">
        <TextInputWithLabel
          value={price}
          onChange={(value) => {
            // 최대 6자 제한
            if (value.length <= 6) {
              setPrice(value);
            }
          }}
          placeholder="가격을 입력하세요"
          type="text"
          inputClassName="w-[180px] h-[62px] pr-[12px] pl-[12px]"
        />
        </div>
        <span className="text-grey-90 text-sm font-medium w-[16px] h-[25px] flex items-center justify-center pl-[3px]">원</span>
        <span className="text-grey-80 text-sm font-medium w-[45px] h-[24px] flex items-center justify-center pr-[5px]">이에요.</span>
      </div>
      
      <div className="flex flex-col gap-3">
        <span className="text-grey-90 text-sm font-medium">별점</span>
        <RatingStars
          rating={rating}
          onChange={setRating}
          category = {selectedCategory}
        />
      </div>
    </div>
  );

  const renderServiceOrCleanCategory = () => (
    <div className="flex flex-col gap-3">
      <span className="text-grey-90 text-sm font-medium">별점</span>
      <RatingStars
        rating={rating}
        onChange={setRating}
        category = {selectedCategory}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-8 p-6 bg-white max-w-md mx-auto">
      {/* 카테고리 선택 */}
      <CategorySelector
        selected={selectedCategory}
        onSelect={(category) => {
          setSelectedCategory(category);
          // 카테고리 변경 시 상태 초기화
          setFoodName('');
          setQuantity(1);
          setPrice('');
          setRating([0, 0, 0, 0, 0]);
        }}
      />

      {/* 선택된 카테고리에 따른 컨텐츠 렌더링 */}
      <div className="flex flex-col gap-6">
        {selectedCategory === '음식' ? renderFoodCategory() : renderServiceOrCleanCategory()}
      </div>

      {/* 다음 버튼 */}
      <div className="mt-8">
        <PrimaryButton
          text="다음"
          onClick={handleNext}
          className="w-[343px] mx-auto"
          disabled={!isButtonEnabled}
        bgColorWhenEnabled="bg-grey-90"
        textColorWhenEnabled="text-primary-60"
        />
      </div>
    </div>
  );
}