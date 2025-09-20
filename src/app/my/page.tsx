'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { AppShell, Header } from '@/widgets/layout';

import { FolderList } from '@/features/my-folders/ui/FolderList';
import { MyReviewList } from '@/features/my-reviews/ui/MyReviewList';
import { BackButton } from '@/features/navigation/back/ui/BackButton';

import Icon from '@/shared/ui/Icon';
import Tab from '@/shared/ui/Tab';

type MyPageTab = 'written' | 'saved';

const MyPage = () => {
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
					<div className="rounded-2xl  text-grey-90 text-sm font-semibold p-4 bg-white flex justify-between items-center cursor-pointer">
						내 정보
					</div>
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

export default MyPage;
