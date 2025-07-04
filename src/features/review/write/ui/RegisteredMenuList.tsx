import { ReviewedMenuItem } from '@/entities/review/model/menu';
import MenuItem from '@/entities/review/ui/MenuItem';

interface RegisteredMenuList {
	menuList: ReviewedMenuItem[];
}

export const RegisteredMenuList = ({ menuList }: RegisteredMenuList) => {
	return (
		<section className="space-y-4">
			<h3 className="text-base font-semibold">등록된 음식</h3>
			{menuList.length === 0 ? (
				<p className="text-sm text-gray-500">아직 등록된 메뉴가 없어요.</p>
			) : (
				<ul className="space-y-2">
					{menuList.map((menu) => (
						<MenuItem key={menu.id} menu={menu} />
					))}
				</ul>
			)}
		</section>
	);
};
