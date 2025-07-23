import { MenuItemCard, type ReviewedMenuItemData } from '@/entities/menu';

interface RegisteredMenuListWidgetProps {
	menuList: ReviewedMenuItemData[];
}

export const RegisteredMenuListWidget = ({
	menuList,
}: RegisteredMenuListWidgetProps) => {
	return (
		<section className="w-full space-y-3">
			<h3 className="text-base font-semibold">등록된 음식</h3>
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
