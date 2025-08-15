export function validateFiles(
	files: File[],
	maxCount: number,
): {
	validFiles: File[];
	errorMessage?: string;
} {
	// Check file count
	if (files.length > maxCount) {
		return {
			validFiles: files.slice(0, maxCount),
			errorMessage: `최대 ${maxCount}장의 이미지만 업로드할 수 있습니다.`,
		};
	}

	return { validFiles: files };
}
