import { Suspense } from 'react';

import { AppShell, Header } from '@/widgets/layout';
import { ReviewStoryFeed } from '@/widgets/review/read/ui/ReviewStoryFeed';

import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { ReviewOptionsMenu } from '@/features/review/read/ui/ReviewOptionsMenu';

const page = () => {
	return (
		<AppShell showBottomNav={true}>
			<Header className="bg-black">
				<Header.Left>
					<BackButton className="text-white" />
				</Header.Left>
				<Header.Center>
					<span className="text-white">위치 표시</span>
				</Header.Center>
				<Header.Right>
					<Suspense fallback={<div></div>}>
						<ReviewOptionsMenu />
					</Suspense>
				</Header.Right>
			</Header>

			<main className="flex-1">
				<Suspense fallback={<div></div>}>
					<ReviewStoryFeed />
				</Suspense>
			</main>
		</AppShell>
	);
};

export default page;
