import { AppShell, Header } from '@/widgets/layout';
import { SearchVisitedStoreWidget } from '@/widgets/search/ui/SearchVisitedStoreWidget';

import { BackButton } from '@/features/navigation/back/ui/BackButton';

export default async function RestaurantSearchPage() {
	return (
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>리뷰 쓰기</Header.Center>
			</Header>
			<div className="flex flex-col items-center p-4 gap-9">
				<SearchVisitedStoreWidget />
			</div>
		</AppShell>
	);
}
