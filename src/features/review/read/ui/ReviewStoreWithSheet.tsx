import { ReviewView } from '@/entities/review';

import { ReviewTooltipSheet } from '@/widgets/review/read/ui/ReviewTooltipSheet';

import Icon from '@/shared/ui/Icon';

interface ReviewStoreWithSheetProps {
	review: ReviewView;
	isSheetOpen?: boolean;
	onSheetOpenChange?: (open: boolean) => void;

	className?: string;
	buttonClassName?: string;
	children?: React.ReactNode;
}

export function ReviewStoreWithSheet({
	review,
	isSheetOpen = false,
	onSheetOpenChange,
	className = 'w-full px-2 py-2 rounded-xl text-sm',
	buttonClassName = 'flex items-center justify-between w-full min-w-0 self-stretch whitespace-normal break-words text-left',
	children,
}: ReviewStoreWithSheetProps) {
	const handleClick = () => {
		onSheetOpenChange?.(true);
	};

	return (
		<div className={className}>
			<button onClick={handleClick} className={buttonClassName}>
				{children || (
					<>
						<span className="flex-1 truncate">
							이 가게의
							<br />
							전체 리뷰
						</span>
						<Icon name={'ArrowRight'} size={'xs'} />
					</>
				)}
			</button>
			<ReviewTooltipSheet
				open={isSheetOpen}
				onOpenChange={onSheetOpenChange || (() => {})}
				review={review}
			/>
		</div>
	);
}
