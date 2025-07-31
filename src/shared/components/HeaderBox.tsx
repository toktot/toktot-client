'use client';

import Icon from '../ui/Icon';

const HeaderBox = () => {
	return (
		<header className="w-full px-4 py-3 flex items-center justify-between bg-white">
			<div className="flex items-center text-sm font-medium text-black">
				<span>장소를 설정해주세요.</span>
				<Icon name={'ArrowDownBar'} className="ml-1" />
			</div>
			<div>
				<Icon name={'Bell'} />
			</div>
		</header>
	);
};
export default HeaderBox;
