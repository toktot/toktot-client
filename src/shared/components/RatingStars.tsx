import Icon from '../ui/Icon';

export const MAX_RATING = 5;

type RatingStarsProps = {
	rating: (0 | 0.5 | 1)[];
	onChange: (value: (0 | 0.5 | 1)[]) => void;
	category: '음식' | '서비스' | '청결';
	maxRating?: number;
	size?: 'default' | 'large';
};

const getIconName = (category: string) => {
	switch (category) {
		case '음식':
			return 'Star';
		case '서비스':
			return 'Service';
		case '청결':
			return 'Clear';
		default:
			return 'Star';
	}
};

const RatingStars = ({ rating, onChange, category }: RatingStarsProps) => {
	const iconName = getIconName(category);

	const handleClick = (index: number) => {
		const newRating = [...rating];
		const current = newRating[index];

		const isLeftFull = index === 0 || newRating[index - 1] === 1;
		const isLastFilledIndex = newRating.lastIndexOf(1);
		const isOnlyRightCanDelete = index === isLastFilledIndex;

		// 채우기 로직
		if (current === 0 && isLeftFull) {
			newRating[index] = 0.5;
		} else if (current === 0.5) {
			newRating[index] = 1;
		} else if (current === 1 && isOnlyRightCanDelete) {
			newRating[index] = 0;
		} else {
			return; // 위 조건 안 맞으면 변경 안 함
		}

		// 오른쪽은 전부 초기화
		for (let i = index + 1; i < newRating.length; i++) {
			newRating[i] = 0;
		}

		onChange(newRating);
	};

	return (
		<div className="flex flex-row gap-1 items-center">
			{rating.map((value, index) => {
				const isFull = value === 1;
				const isHalf = value === 0.5;

				return (
					<div
						key={index}
						className="relative cursor-pointer"
						onClick={() => handleClick(index)}
					>
						{/* 회색 배경 (기본 상태) */}
						<Icon name={iconName} size="xxl" className="text-grey-30" />

						{/* 색상 아이콘을 조건부로 덮어씀 */}
						{(isHalf || isFull) && (
							<div
								className={`absolute top-0 left-0 overflow-hidden`}
								style={{ width: isHalf ? '50%' : '100%', height: '100%' }}
							>
								<Icon
									name={iconName}
									size="xxl"
									className="fill-primary-50 text-grey-30"
								/>
							</div>
						)}
					</div>
				);
			})}
		</div>
	);
};

export default RatingStars;
