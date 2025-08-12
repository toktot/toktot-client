import clsx from 'clsx';
import Image from 'next/image';

import { ReviewImage } from '../model/image';

interface Props {
	image: ReviewImage;
	onSelectImage: (image: ReviewImage) => void;
	isSelected?: boolean;
}

export const ReviewImageItem = ({
	image,
	onSelectImage,
	isSelected,
}: Props) => {
	return (
		<div
			className={clsx(
				'relative w-9 rounded-xl overflow-hidden border-2',
				isSelected ? 'border-primary-40' : 'border-transparent',
			)}
			onClick={() => onSelectImage(image)}
		>
			<Image src={image.url} alt="리뷰 이미지" fill />
		</div>
	);
};
