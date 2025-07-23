import { ReviewImage, ReviewImageItem } from '@/entities/review';

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
