'use client';

import { AppShell, Header } from '@/widgets/layout';
import PolicyNavigator from '@/widgets/my/ui/PolicyNavigator';

import { DeleteAccountButton } from '@/features/auth/delete-account/ui/DeleteAccountButton';
import { LogoutButton } from '@/features/auth/logout/ui/LogoutButton';
import { BackButton } from '@/features/navigation/back/ui/BackButton';

import Icon from '@/shared/ui/Icon';

const Page = () => {
	return (
		<AppShell>
			<Header className="bg-white">
				<Header.Left>
					<BackButton />
				</Header.Left>
				<Header.Center>환경 설정</Header.Center>
			</Header>
			<div className="p-4 w-full bg-grey-10 h-full flex flex-col justify-between items-center pb-12">
				<div className="flex flex-col gap-3 w-full">
					<div className="rounded-2xl  text-grey-90 text-sm font-semibold p-4 bg-white flex justify-between items-center cursor-pointer">
						<div className="flex gap-2">
							<Icon name={'Bell'} className="text-grey-50" />
							<span>알림 설정</span>
						</div>
						<Icon name={'ArrowRight'} className="text-grey-50" />
					</div>
					<div className="rounded-2xl  text-grey-90 text-sm font-semibold p-4 bg-white flex justify-between items-center cursor-pointer">
						<div className="flex gap-2">
							<Icon name={'My'} className="text-grey-50" />
							<span>연결된 계정</span>
						</div>
						<Icon name={'ArrowRight'} className="text-grey-50" />
					</div>
					<PolicyNavigator />

					<DeleteAccountButton />
				</div>

				<div className="mt-10">
					<LogoutButton />
				</div>
			</div>
		</AppShell>
	);
};

export default Page;
