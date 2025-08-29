'use client';

import { useEffect, useState } from 'react';

import Icon from '../ui/Icon';

interface ToastProps {
	message: string;
	duration?: number;
	onClose?: () => void;
}
export default function Toast({
	message,
	duration = 3000,
	onClose,
}: ToastProps) {
	const [visible, setVisible] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setVisible(false);
			onClose?.();
		}, duration);
		return () => clearTimeout(timer);
	}, [duration, onClose]);

	if (!visible) return null;
	return (
		<div className="w-[330px] min-h-[54px] bg-grey-90 fixed bottom-25 left-1/2 -ml-1 -translate-x-1/2 z-50 bg-grey-800 text-white text-sm py-2 px-2 rounded-lg shadow-lg flex items-center gap-2">
			<span>
				<Icon name="Checkmark" size="xxs" className="text-green-300" />
			</span>
			<span>{message}</span>
		</div>
	);
}
