'use client';

import { Suspense, use, useState } from 'react';

import Image from 'next/image';
import { notFound, useSearchParams } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';

import { FolderList } from '@/features/my-folders/ui/FolderList';
import { MyReviewList } from '@/features/my-reviews/ui/MyReviewList';
import { BackButton } from '@/features/navigation/back/ui/BackButton';
import { UserOptionsMenu } from '@/features/user/ui/UserOptionsMenu';

import Tab from '@/shared/ui/Tab';

type UserTab = 'saved' | 'my';

interface UserPageProps {
	params: Promise<{ authorId: string }>;
}

const UserPage = ({ params }: UserPageProps) => {
	const { authorId } = use(params);
	const searchParams = useSearchParams();
	const nickname = searchParams.get('nickname');
	const reviewCount = searchParams.get('reviewCount');
	const averageRating = searchParams.get('averageRating');
	const profileImageUrl = searchParams.get('profileImageUrl');
	const safeProfileImageUrl =
		profileImageUrl && profileImageUrl.trim() !== ''
			? profileImageUrl
			: '/images/avatar_default.png';

	const [activeTab, setActiveTab] = useState<UserTab>('my');

	if (!authorId) return notFound();

	return (
		<AppShell>
			<Header className="bg-white">
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>{nickname}</Header.Center>
				<Header.Right>
					<Suspense fallback={<div></div>}>
						<UserOptionsMenu />
					</Suspense>
				</Header.Right>
			</Header>
			<div className="w-full bg-grey-10">
				<div className="mx-auto px-4 py-4">
					<div className="mx-auto p-4 flex gap-2 rounded-2xl  bg-white">
						<div className="w-10 h-10 relative shrink-0">
							<Image
								src={safeProfileImageUrl}
								fill
								sizes="40px"
								alt={'프로필 이미지'}
								className="object-cover rounded-full"
							/>
						</div>
						<div className="flex flex-col min-w-0 flex-1">
							<div className="text-sm font-semibold">{nickname}</div>
							<div className="mt-1 flex text-xs">
								<p>{reviewCount}개</p>
								<div>·</div>
								<p>평균 {averageRating}점</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<Tab<UserTab>
				activeTab={activeTab}
				onTabChange={setActiveTab}
				tabs={[
					{ id: 'my', label: '작성한 리뷰' },
					{ id: 'saved', label: '저장한 리뷰' },
				]}
			/>
			{/* // TODO: 해당 유저 작성한 리뷰, 저장한 리뷰 조회로 변경 현재 api 미구현으로 마이페이지와 동일로직 */}
			<div>
				{activeTab === 'my' && <MyReviewList />}
				{activeTab === 'saved' && <FolderList />}
			</div>
		</AppShell>
	);
};

export default UserPage;
