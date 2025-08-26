'use client';

import React from 'react';

import Link from 'next/link';

import Icon from '@/shared/ui/Icon';

interface PolicyItem {
	title: string;
	description: string;
	href: string;
	icon?: string;
}

interface PolicyNavigatorProps {
	className?: string;
}

const PolicyNavigator: React.FC<PolicyNavigatorProps> = ({
	className = '',
}) => {
	const policyItems: PolicyItem[] = [
		{
			title: '서비스 이용약관',
			description: '똑똣 서비스 이용에 관한 약관을 확인하세요',
			href: '/policy',
			icon: '📋',
		},
		{
			title: '개인정보 보호정책',
			description: '개인정보 수집 및 처리에 관한 정책을 확인하세요',
			href: '/privacy',
			icon: '🔒',
		},
	];

	return (
		<div
			className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}
		>
			{/* 헤더 */}
			<div className="px-6 py-4 border-b border-gray-100">
				<h3 className="text-lg font-semibold text-gray-800">정책 및 약관</h3>
				<p className="text-sm text-gray-500 mt-1">
					서비스 이용 관련 정책을 확인하세요
				</p>
			</div>

			{/* 정책 리스트 */}
			<div className="divide-y divide-gray-100">
				{policyItems.map((item, index) => (
					<Link
						key={index}
						href={item.href}
						className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors duration-200 group"
					>
						{/* 아이콘 */}
						<div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-100 transition-colors">
							<span className="text-lg">{item.icon}</span>
						</div>

						{/* 텍스트 정보 */}
						<div className="flex-1 min-w-0">
							<h4 className="text-base font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
								{item.title}
							</h4>
							<p className="text-sm text-gray-500 mt-1 line-clamp-2">
								{item.description}
							</p>
						</div>

						{/* 화살표 아이콘 */}
						<div className="flex-shrink-0 ml-4">
							<Icon name={'ArrowRight'} />
						</div>
					</Link>
				))}
			</div>
		</div>
	);
};

export default PolicyNavigator;
