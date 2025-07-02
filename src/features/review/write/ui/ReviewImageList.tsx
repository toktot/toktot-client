import { ReviewImage } from '@/entities/review/model/reviewImage';
import { ReviewImageItem } from '@/entities/review/ui/ReviewImageItem';

export const ReviewImageList = ({
	images,
	onSelectImage,
	onDeleteImage,
}: {
	images: ReviewImage[];
	onSelectImage: (image: ReviewImage) => void;
	onDeleteImage: (id: string) => void;
}) => {
	return (
		<>
			{images.map((image) => (
				<ReviewImageItem
					key={image.id}
					image={image}
					onSelectImage={() => onSelectImage(image)}
					onDeleteImage={() => onDeleteImage(image.id)}
				/>
			))}
		</>
	);
};
