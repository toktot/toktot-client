import { ReviewImage, ReviewImageItem } from '@/entities/review';

export const ReviewImageList = ({
	images,
	onSelectImage,
	selectedImageId,
}: {
	images: ReviewImage[];
	onSelectImage: (image: ReviewImage) => void;
	selectedImageId: string | null;
}) => {
	return (
		<div className="h-full flex">
			{images.map((image) => (
				<ReviewImageItem
					key={image.id}
					image={image}
					onSelectImage={() => onSelectImage(image)}
					isSelected={image.id === selectedImageId}
				/>
			))}
		</div>
	);
};
