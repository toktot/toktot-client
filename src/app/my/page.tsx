'use client';
'use client';

import { Suspense } from 'react';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';

import { FolderList } from '@/features/my-folders/ui/FolderList';
import { MyReviewList } from '@/features/my-reviews/ui/MyReviewList';
import { BackButton } from '@/features/navigation/back/ui/BackButton';

import Icon from '@/shared/ui/Icon';
import Tab from '@/shared/ui/Tab';

import { useMyProfile } from '@/entities/user/lib/useMyProfile';
import Image from 'next/image';

type MyPageTab = 'written' | 'saved';

const MyProfileSection = () => {
	const { profile, isLoading, error } = useMyProfile();

	if (isLoading) {
		return (
			<div className="rounded-2xl p-4 bg-grey-10 animate-pulse h-[72px]" />
		);
	}

	if (error || !profile) {
		return (
			<div className="rounded-2xl text-sm font-semibold p-4 bg-sub-red-10 text-sub-red-30">
				{error || '내 정보를 불러오지 못했습니다.'}
			</div>
		);
	}

	const safeProfileImageUrl =
		profile.profile_image_url && profile.profile_image_url.trim() !== ''
			? profile.profile_image_url
			: '/images/avatar_default.png';

	return (
		<div className="rounded-2xl p-4 bg-white flex justify-between items-center cursor-pointer">
			<div className="flex items-center gap-3">
				<div className="relative w-10 h-10 shrink-0">
					<Image
						src={safeProfileImageUrl}
						alt={`${profile.nickname} 프로필 이미지`}
						fill
						className="object-cover rounded-full"
						sizes="40px"
					/>
				</div>
				<div className="flex flex-col">
					<span className="font-semibold text-grey-90">{profile.nickname}</span>
					<div className="flex items-center text-xs text-grey-70 gap-1">
						<span>리뷰 {profile.review_count}개</span>
						<span>·</span>
						<span>평균 {profile.review_rating_avg.toFixed(1)}점</span>
					</div>
				</div>
			</div>
			<Icon name="ArrowRight" size="s" className="text-grey-50" />
		</div>
	);
};

const MyPageInner = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const activeTab = searchParams.get('tab') || 'written';

	const handleTabChange = (tab: MyPageTab) => {
		const url = new URL(window.location.href);
		url.searchParams.set('tab', tab);
		router.push(url.pathname + url.search);
	};

	return (
		<AppShell>
			<Header className="bg-white">
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>마이페이지</Header.Center>
				<Header.Right>
					<Link href="/my/setting">
						<Icon name={'Setting'} />
					</Link>
				</Header.Right>
			</Header>
			<div className="w-full bg-grey-10">
				<div className="mx-auto px-4 py-4">
					<MyProfileSection />
				</div>
			</div>
			<Tab<MyPageTab>
				activeTab={activeTab as MyPageTab}
				onTabChange={handleTabChange}
				tabs={[
					{ id: 'written', label: '작성한 리뷰' },
					{ id: 'saved', label: '저장한 리뷰' },
				]}
			/>
			<div>
				{activeTab === 'written' && <MyReviewList />}
				{activeTab === 'saved' && <FolderList />}
			</div>
		</AppShell>
	);
};

const MyPage = () => (
	<Suspense fallback={<div></div>}>
		<MyPageInner />
	</Suspense>
);

export default MyPage;
