'use client';

import { IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

import { TSizeName } from '../icons/types';

interface StarRatingProps {
	/** 현재 별점 값 (0에서 iconCount까지) */
	value: number;
	/** 별점 변경 시 호출되는 함수 */
	onChange: (value: number) => void;
	/** 렌더링할 아이콘의 이름 */
	icon?: IconName;
	/** 렌더링할 아이콘의 총 개수 */
	iconCount?: number;
	/** 채워진 아이콘의 색상 */
	fillColor?: string;
	/** 비워진 아이콘의 색상 */
	emptyColor?: string;
	className?: string;
	iconSize?: TSizeName | undefined;
}

/**
 * @description 별점을 표시하고 0.5점 단위로 변경 가능한 컴포넌트입니다.
 * @param {number} value - 현재 별점 값
 * @param {(value: number) => void} onChange - 별점 변경 핸들러
 * @param {IconName} [icon='Star'] - 사용할 아이콘 이름
 * @param {number} [iconCount=5] - 아이콘 총 개수
 * @param {string} [fillColor='#FFC107'] - 채워진 아이콘 색상
 * @param {string} [emptyColor='#E0E0E0'] - 비워진 아이콘 색상
 */

const StarRating = ({
	value,
	onChange,
	icon = 'Star',
	iconCount = 5,
	fillColor = '#3AC8FF',
	emptyColor = '#F6F9FB',
	className = '',
	iconSize = 'xl',
}: StarRatingProps) => {
	const handleClick = (index: number) => {
		const currentValue = index + 1;
		// 1점 -> 0.5점 순환 로직
		const newValue = value === currentValue ? currentValue - 0.5 : currentValue;

		onChange(newValue);
	};

	return (
		<div className={`flex ${className}`}>
			{[...Array(iconCount)].map((_, index) => {
				const starValue = index + 1;
				const isHalf = value === starValue - 0.5;

				// 반쪽 별 렌더링
				if (isHalf) {
					return (
						<div
							key={index}
							onClick={() => handleClick(index)}
							style={{ position: 'relative', cursor: 'pointer' }}
						>
							<Icon
								name={icon}
								fill={emptyColor}
								size={iconSize}
								color={'#D4DEE5'}
							/>
							<div
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '50%',
									overflow: 'hidden',
								}}
							>
								<Icon
									name={icon}
									fill={fillColor}
									size={iconSize}
									color={'#D4DEE5'}
								/>
							</div>
						</div>
					);
				}

				// 꽉 찬 별 또는 빈 별 렌더링
				const isFilled = starValue <= value;

				return (
					<div
						key={index}
						onClick={() => handleClick(index)}
						style={{ cursor: 'pointer' }}
					>
						<Icon
							name={icon}
							color={isFilled ? fillColor : '#D4DEE5'}
							fill={isFilled ? fillColor : emptyColor}
							size={iconSize}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default StarRating;
