'use client';

import { useReviewImageManager } from '@/entities/review/lib/useReviewImageManager';
import { ReviewImageItem } from '@/entities/review/ui/ReviewImageItem';

import Icon from '@/widgets/Icon';

export const ReviewImageUploader = () => {
	const { images, addImage, removeImage, canAddMore } = useReviewImageManager();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) addImage(file);
	};

	return (
		<div className="w-full gap-3 flex overflow-x-auto [&::-webkit-scrollbar]:hidden">
			{canAddMore && (
				<label className="w-[100px] h-[100px] bg-grey-10 flex items-center justify-center cursor-pointer rounded flex-shrink-0">
					<input type="file" className="hidden" onChange={handleChange} />
					<Icon className="text-grey-50" name={'Plus'} size="s" />
				</label>
			)}
			{images.map((image) => (
				<div key={image.id} className="flex-shrink-0 w-[100px]">
					<ReviewImageItem image={image} />
					<button onClick={() => removeImage(image.id)}>
						<Icon name={'Cancel'} size="s" />
					</button>
				</div>
			))}
		</div>
	);
};
