'use client';

import React from 'react';

import Link from 'next/link';

import { AppShell } from '@/widgets/layout';
import PolicyNavigator from '@/widgets/my/ui/PolicyNavigator';

const MyPage = () => {
	return (
		<AppShell showBottomNav={true}>
			<div className="max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col">
				<div className="mb-8">
					<Link href="/signup">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<button className="text-xl font-semibold text-gray-800 mb-4">
								회원가입하기
							</button>
						</div>
					</Link>
				</div>

				<div className="mb-8">
					<Link href="/login">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<button className="text-xl font-semibold text-gray-800 mb-4">
								로그인하기
							</button>
						</div>
					</Link>
				</div>

				<div className="mb-8">
					<Link href="/PasswordFind">
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
							<button className="text-xl font-semibold text-gray-800 mb-4">
								비밀번호 찾기
							</button>
						</div>
					</Link>
				</div>

				<PolicyNavigator className="mb-8" />
			</div>
		</AppShell>
	);
};

export default MyPage;
