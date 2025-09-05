'use client';

import { useReviewWriteStore } from '@/features/review/write/model/useReviewWriteStore';

interface ReviewSubmitButtonProps {
  isLoading: boolean;
}

export const ReviewSubmitButton = ({ isLoading }: ReviewSubmitButtonProps) => {
  const valueForMoneyScore = useReviewWriteStore(
    (state) => state.valueForMoneyScore,
  );
  const isDisabled = isLoading || valueForMoneyScore === null;

  const getButtonText = () => {
    if (isLoading) return '리뷰 제출 중...';
    return '다음';
  };

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full p-2 text-primary-40  text-lg font-semibold bg-grey-90 rounded-3xl disabled:bg-grey-50 disabled:text-white disabled:cursor-not-allowed"
      aria-label="리뷰 제출하기"
    >
      {getButtonText()}
    </button>
  );
};