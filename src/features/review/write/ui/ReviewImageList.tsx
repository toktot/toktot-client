import { ReviewImage, ReviewImageItem } from '@/entities/review';
import { ReviewImageId } from '@/shared/model/types';

export const ReviewImageList = ({
	images,
	onSelectImage,
	onDeleteImage,
}: {
	images: ReviewImage[];
	onSelectImage: (image: ReviewImage) => void;
	onDeleteImage: (id: ReviewImageId) => void;
}) => {
	return (
		<div className="h-full flex">
			{images.map((image) => (
				<ReviewImageItem
					key={image.id}
					image={image}
					onSelectImage={() => onSelectImage(image)}
					onDeleteImage={() => onDeleteImage(image.id)}
				/>
			))}
		</div>
	);
};
