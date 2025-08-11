'use client';

import React from 'react';

import { AppShell, Header } from '@/widgets/layout';
import { ReviewStoryFeed } from '@/widgets/review/read/ui/ReviewStoryFeed';

import { BackButton } from '@/features/navigation/back/ui/BackButton';

import Icon from '@/shared/ui/Icon';

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
					<span className="text-white">
						<Icon name={'Kebab'} className="text-white" />
					</span>
				</Header.Right>
			</Header>

			<main className="flex-1">
				<ReviewStoryFeed />
			</main>
		</AppShell>
	);
};

export default page;
