export const validateFiles = (
	files: File[],
	maxCount: number,
	maxFileSize: number, // 개별 파일 최대 크기
) => {
	if (files.length > maxCount) {
		return {
			validFiles: [],
			errorMessage: `최대 ${maxCount}개의 파일만 선택할 수 있습니다.`,
		};
	}

	for (const file of files) {
		if (file.size > maxFileSize) {
			const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
			const maxSizeMB = (maxFileSize / (1024 * 1024)).toFixed(0);
			return {
				validFiles: [],
				errorMessage: `${file.name} 파일이 ${fileSizeMB}MB입니다. 개별 파일은 ${maxSizeMB}MB 이하로 선택해주세요.`,
			};
		}
	}

	return {
		validFiles: files,
		errorMessage: null,
	};
};
