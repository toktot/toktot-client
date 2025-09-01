'use client';

import { KEYWORDS_BY_CATEGORY } from '@/entities/keyword/config/data';
import { StoreData } from '@/entities/store';

import { AppShell, Header } from '@/widgets/layout';
import { ReviewImageWidget, VisitedStoreWidget } from '@/widgets/review/write';
import { KeywordSelectionWidget } from '@/widgets/review/write/ui/KeywordSelectionWidget';

import { BackButton } from '@/features/navigation/back/ui/BackButton';

import { StoreId } from '@/shared/model/types';

import { MealTimeSelectionWidget } from './MealTimeSelectionWidget';
import { NextButton } from './NextButton';

interface ReviewWriteContentProps {
	storeId: string;
	visitedStoreData: StoreData & { distance: number };
}

export function ReviewWriteContent({
	storeId,
	visitedStoreData,
}: ReviewWriteContentProps) {
	return (
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>
					<span className="leading-[48px]">리뷰 쓰기</span>
				</Header.Center>
			</Header>
			<div className="flex flex-col items-center p-4 gap-9">
				<VisitedStoreWidget store={visitedStoreData} />
				<ReviewImageWidget restaurantId={storeId as StoreId} />
				<KeywordSelectionWidget
					title="음식"
					category="food"
					keywords={KEYWORDS_BY_CATEGORY.food}
				/>
				<KeywordSelectionWidget
					title="청결"
					category="cleanliness"
					keywords={KEYWORDS_BY_CATEGORY.cleanliness}
				/>
				<KeywordSelectionWidget
					title="가격"
					category="price"
					keywords={KEYWORDS_BY_CATEGORY.price}
				/>
				<KeywordSelectionWidget
					title="서비스"
					category="service"
					keywords={KEYWORDS_BY_CATEGORY.service}
				/>
				<KeywordSelectionWidget
					title="분위기"
					category="atmosphere"
					keywords={KEYWORDS_BY_CATEGORY.atmosphere}
				/>
				<KeywordSelectionWidget
					title="접근성"
					category="accessibility"
					keywords={KEYWORDS_BY_CATEGORY.accessibility}
				/>
				<MealTimeSelectionWidget
					title="식사 시간"
					category="mealtime"
					keywords={KEYWORDS_BY_CATEGORY.mealtime}
				/>
				<div className="w-full sticky bottom-2">
					<NextButton restaurantId={parseInt(storeId)} />
				</div>
			</div>
		</AppShell>
	);
}
