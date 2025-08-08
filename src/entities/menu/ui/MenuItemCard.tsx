import Icon from '@/shared/ui/Icon';

import type { ReviewedMenuItemData } from '../model/types';

interface MenuItemCardProps {
	menu: ReviewedMenuItemData;
}

export const MenuItemCard = ({ menu }: MenuItemCardProps) => {
	return (
		<div className="w-full h-12 py-2.5 border-b border-grey-10 flex justify-between items-center gap-2.5">
			<div className="flex gap-2.5">
				<div className="justify-center text-grey-80 text-sm leading-tight">
					{menu.name}
				</div>
				<div className="justify-center text-grey-80 text-sm leading-tight">
					{menu.price.toLocaleString()}원
				</div>
			</div>
			<div className="flex justify-center items-center gap-1">
				<Icon
					name={'Star'}
					size="xs"
					className="text-sub-orange-40 fill-sub-orange-10"
				/>
				<div className="text-center justify-end text-grey-70 text-xs leading-tight">
					{menu.rating}
				</div>
			</div>
		</div>
	);
};
