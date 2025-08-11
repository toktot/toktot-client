import { useCallback, useState } from 'react';

type UseReviewPaginationReturn = {
	page: number;
	direction: number;
	paginate: (delta: number) => void;
	setPage: (idx: number) => void;
};

export const useReviewPagination = (
	initial = 0,
	max = 1,
): UseReviewPaginationReturn => {
	const [pageState, setPageState] = useState<[number, number]>([initial, 0]);
	const [page, direction] = pageState;

	const paginate = useCallback(
		(delta: number) => {
			const newIndex = page + delta;
			if (newIndex < 0 || newIndex >= max) return;
			setPageState([newIndex, delta]);
		},
		[page, max],
	);

	const setPage = useCallback(
		(idx: number) => setPageState(([, dir]) => [idx, dir]),
		[],
	);

	return { page, direction, paginate, setPage };
};
