'use client';

import Icon from '../ui/Icon';

export const BottomNav = () => {
	return (
		<nav className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center z-10">
			<div className="flex flex-col items-center justify-center">
				<Icon name={'Home'} />
			</div>
			<div className="flex flex-col items-center justify-center">
				<Icon name={'Review'} />
			</div>
			<div className="translate-y-[-16px]">
				<div className="w-14 h-14 rounded-full bg-grey-90 flex items-center justify-center shadow-md">
					<Icon name={'ReviewPlus'} className="text-primary-40" />
				</div>
			</div>
			<div className="flex flex-col items-center justify-center">
				<Icon name={'Route'} />
			</div>
			<div className="flex flex-col items-center justify-center">
				<Icon name={'My'} />
			</div>
		</nav>
	);
};

export default BottomNav;
