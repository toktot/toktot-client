import clsx from 'clsx';
import Image from 'next/image';

import { UploadReviewImage } from '../model/image';

interface Props {
	image: UploadReviewImage;
	onSelect: (image: UploadReviewImage) => void;
	isSelected?: boolean;
}

export const ReviewImageItem = ({ image, onSelect, isSelected }: Props) => {
	return (
		<div
			className={clsx(
				'relative w-9 h-9 rounded-xl overflow-hidden border-2',
				isSelected ? 'border-primary-40' : 'border-transparent',
			)}
			onClick={() => onSelect(image)}
		>
			<Image src={image.url} alt="리뷰 이미지" fill sizes="36px" />
		</div>
	);
};
