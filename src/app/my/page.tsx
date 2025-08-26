'use client';

import React from 'react';

import { AppShell } from '@/widgets/layout';
import PolicyNavigator from '@/widgets/my/ui/PolicyNavigator';

const MyPage: React.FC = () => {
	return (
		<AppShell showBottomNav={true}>
			<div className="max-w-4xl mx-auto px-4 py-8 flex-1">
				{/* 사용자 정보 섹션 */}
				<div className="mb-8">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">
							내 정보
						</h2>
						{/* 사용자 정보 컨텐츠 */}
					</div>
				</div>

				{/* 설정 섹션 */}
				<div className="mb-8">
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
						<h2 className="text-xl font-semibold text-gray-800 mb-4">설정</h2>
						{/* 설정 컨텐츠 */}
					</div>
				</div>

				{/* 정책 네비게이터 섹션 - 방법 1: 상세 버전 */}
				<PolicyNavigator className="mb-8" />

				{/* 기타 섹션들 */}
			</div>
		</AppShell>
	);
};

export default MyPage;
