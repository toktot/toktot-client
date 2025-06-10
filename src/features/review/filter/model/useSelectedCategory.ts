import { useState } from 'react';

export function useSelectedCategory(initialValue: number) {
	const [selectedCategory, setSelectedCategory] = useState<number[]>([
		initialValue,
	]);

	const changeCategory = (value: number[]) => {
		const target = value[0];

		setSelectedCategory((prev) => {
			const exists = prev.includes(target);
			return exists ? prev.filter((v) => v !== target) : [...prev, target];
		});
	};

	return { selectedCategory, changeCategory };
}
