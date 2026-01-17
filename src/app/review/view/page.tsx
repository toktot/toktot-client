import { Suspense } from 'react';

import { AppShell, Header } from '@/widgets/layout';
import { ReviewStoryFeed } from '@/widgets/review/read/ui/ReviewStoryFeed';

import { LocationDisplayTrigger } from '@/features/locationsetting/ui/LocationDisplayTrigger';
import { BackButton } from '@/features/navigation/ui/back/BackButton';
import { ReviewOptionsMenu } from '@/features/review/read/ui/ReviewOptionsMenu';

const page = () => {
	return (
		<AppShell showBottomNav={true}>
			<Header className="bg-black">
				<Header.Left>
					<BackButton className="text-white" />
				</Header.Left>
				<Header.Center>
					<LocationDisplayTrigger className="text-white" />
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
