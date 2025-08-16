'use client';

import { MenuItemCard, type ReviewedMenuItemData } from '@/entities/menu';
import { FoodTooltip, type UploadReviewImage } from '@/entities/review';

import { useReviewWriteStore } from '@/features/review/write/model/useReviewWriteStore';

import { MenuItemId } from '@/shared/model/types';
import Typography from '@/shared/ui/Typography';

interface RegisteredMenuListWidgetProps {
	images: UploadReviewImage[];
}

export const RegisteredMenuListWidget = ({
	images,
}: RegisteredMenuListWidgetProps) => {
	const { selectTooltipsForImage } = useReviewWriteStore();

	// 모든 이미지의 food 툴팁을 수집
	const foodTooltips = images.flatMap((image) => {
		const tooltips = selectTooltipsForImage(image.id);

		return tooltips.filter(
			(tooltip): tooltip is FoodTooltip =>
				tooltip.category === 'food' &&
				'menuName' in tooltip &&
				Boolean(tooltip.menuName),
		);
	});

	const menuList = foodTooltips.map((tooltip) => ({
		id: tooltip.id as unknown as MenuItemId,
		name: tooltip.menuName,
		price: tooltip.price,
		rating: tooltip.rating,
	})) as ReviewedMenuItemData[];

	return (
		<section className="w-full space-y-3">
			<Typography as="h3">등록된 음식</Typography>
			{menuList.length === 0 ? (
				<p className="text-sm text-gray-500">아직 등록된 메뉴가 없어요.</p>
			) : (
				<ul className="space-y-2">
					{menuList.map((menu) => (
						<MenuItemCard key={menu.id} menu={menu} />
					))}
				</ul>
			)}
		</section>
	);
};
