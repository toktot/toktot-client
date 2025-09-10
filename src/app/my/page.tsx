'use client';

import { useState } from 'react';

import Link from 'next/link';

import { AppShell, Header } from '@/widgets/layout';
import PolicyNavigator from '@/widgets/my/ui/PolicyNavigator';

import { FolderList } from '@/features/my-folders/ui/FolderList';
import { MyReviewList } from '@/features/my-reviews/ui/MyReviewList';

import Tab from '@/shared/ui/Tab';

type MyPageTab = 'saved' | 'my';

const MyPage = () => {
	const [activeTab, setActiveTab] = useState<MyPageTab>('my');

	return (
		<AppShell>
			<Header className="bg-white">
				<Header.Center>마이페이지</Header.Center>
			</Header>
			<div className="mt-4">
				<div className="max-w-4xl mx-auto px-4 py-4 flex-1 flex flex-col">
					<div className="mb-8">
						<Link href="/signup">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
								<button className="text-xl font-semibold text-gray-800 mb-4">
									회원가입하기
								</button>
							</div>
						</Link>
					</div>

					<div className="mb-8">
						<Link href="/login">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
								<button className="text-xl font-semibold text-gray-800 mb-4">
									로그인하기
								</button>
							</div>
						</Link>
					</div>

					<div className="mb-8">
						<Link href="/PasswordFind">
							<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
								<button className="text-xl font-semibold text-gray-800 mb-4">
									비밀번호 찾기
								</button>
							</div>
						</Link>
					</div>
					<PolicyNavigator className="mb-8" />
				</div>
				<Tab<MyPageTab>
					activeTab={activeTab}
					onTabChange={setActiveTab}
					tabs={[
						{ id: 'my', label: '작성한 리뷰' },
						{ id: 'saved', label: '저장한 리뷰' },
					]}
				/>
			</div>

			<div className="mt-4">
				{activeTab === 'saved' && <FolderList />}
				{activeTab === 'my' && <MyReviewList />}
			</div>
		</AppShell>
	);
};

export default MyPage;
