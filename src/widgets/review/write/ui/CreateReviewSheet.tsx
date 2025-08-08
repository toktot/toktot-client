'use client';

import { useState } from 'react';

import { type TooltipCategory } from '@/entities/review';

import { ReviewCategorySelector } from '@/features/related-reviews/ui/ReviewCategorySelector';
import { ReviewFormData } from '@/features/review/write/ui/ReviewFormRenderer';

import DetailedReviewStep from './DetailedReviewStep';
import InitialInfoStep from './InitialInfoStep';

export interface FinalReviewData {
	category: TooltipCategory;
	rating: number;
	formData: ReviewFormData | null;
	detailedText?: string;
}

interface CreateReviewSheetProps {
	onComplete: (data: FinalReviewData) => void;
}

export const CreateReviewSheet = ({ onComplete }: CreateReviewSheetProps) => {
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedCategory, setSelectedCategory] =
		useState<TooltipCategory>('food');
	const [step1Data, setStep1Data] = useState({
		rating: 0,
		formData: null as ReviewFormData | null,
	});

	const handleCategoryChange = (category: TooltipCategory) => {
		if (category !== selectedCategory) {
			setSelectedCategory(category);
			setStep1Data({ rating: 0, formData: null });
		}
	};

	const handleInitialInfoSubmit = (formData: ReviewFormData) => {
		setStep1Data((prev) => ({ ...prev, formData }));
		setCurrentStep((prev) => prev + 1);
	};

	const handleDetailedReviewComplete = (detailedText: string) => {
		const finalData: FinalReviewData = {
			...step1Data,
			category: selectedCategory,
			detailedText,
		};
		onComplete(finalData); // 최종 데이터 외부로 전달
	};

	const steps = [
		{
			name: 'InitialInfo',
			component: (
				<InitialInfoStep
					category={selectedCategory}
					rating={step1Data.rating}
					onRatingChange={(rating) =>
						setStep1Data((prev) => ({ ...prev, rating }))
					}
					onSubmit={handleInitialInfoSubmit}
				/>
			),
		},
		{
			name: 'DetailedReview',
			component: (
				<DetailedReviewStep onComplete={handleDetailedReviewComplete} />
			),
		},
	];

	const CurrentStepComponent = steps[currentStep].component;
	const isLastStep = currentStep === steps.length - 1;

	const isNextButtonDisabled = () => {
		// 현재 첫 번째 스텝이 아니면, 비활성화 로직을 적용하지 않음
		if (currentStep !== 0) {
			return false;
		}

		// 첫 번째 스텝일 경우, 별점이 0점이면 버튼을 비활성화
		if (step1Data.rating === 0) {
			return true;
		}

		return false;
	};

	return (
		<div className="p-6 flex flex-col h-full">
			<div className="flex-grow space-y-3">
				{currentStep === 0 && (
					<div>
						<ReviewCategorySelector
							selectedCategory={selectedCategory}
							onCategoryChange={handleCategoryChange}
						/>
					</div>
				)}
				{CurrentStepComponent}
			</div>

			<div className="mt-auto pt-4">
				<button
					type="submit"
					form="step-form"
					disabled={isNextButtonDisabled()}
					className="w-full p-2 text-primary-40  text-lg font-semibold bg-grey-90 rounded-3xl disabled:bg-grey-50 disabled:text-white disabled:cursor-not-allowed"
				>
					{isLastStep ? '제출' : '다음'}
				</button>
			</div>
		</div>
	);
};

export default CreateReviewSheet;
