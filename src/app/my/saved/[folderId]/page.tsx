'use client';

import { use } from 'react';

import { AppShell, Header } from '@/widgets/layout';

import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { SavedReviewList } from '@/features/saved-reviews/ui/SavedReviewList';

interface SavedReviewsPageProps {
	params: Promise<{ folderId: string }>;
}

const SavedReviewsPage = ({ params }: SavedReviewsPageProps) => {
	const { folderId } = use(params);

	return (
		<AppShell showBottomNav={false}>
			<Header>
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>저장한 리뷰</Header.Center>
			</Header>
			<SavedReviewList folderId={Number(folderId)} />
		</AppShell>
	);
};

export default SavedReviewsPage;
