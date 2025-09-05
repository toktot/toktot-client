import { ReviewWriteContent } from '@/widgets/review/write/ui/ReviewWriteContent';

import { StoreId } from '@/shared/model/types';

interface ReviewWritePageProps {
	params: Promise<{ storeId: string }>;
}

export default async function ReviewWritePage({
	params,
}: ReviewWritePageProps) {
	const { storeId } = await params;
	return <ReviewWriteContent storeId={storeId as StoreId} />;
}
