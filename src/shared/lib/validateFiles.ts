export const validateFiles = async (
	files: File[],
	maxCount: number,
	maxFileSize: number,
): Promise<{ validFiles: File[]; errorMessage: string | null }> => {
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

		const isValidDimension = await new Promise<boolean>((resolve) => {
			const reader = new FileReader();
			reader.onload = () => {
				const img = new Image();
				img.onload = () => {
					if (img.width < 400 || img.height < 400) {
						resolve(false);
					} else {
						resolve(true);
					}
				};
				img.onerror = () => resolve(false);
				if (typeof reader.result === 'string') {
					img.src = reader.result;
				} else {
					resolve(false);
				}
			};
			reader.onerror = () => resolve(false);
			reader.readAsDataURL(file);
		});

		if (!isValidDimension) {
			return {
				validFiles: [],
				errorMessage: `${file.name} 이미지는 최소 400px 이상만 업로드할 수 있습니다.`,
			};
		}
	}

	return {
		validFiles: files,
		errorMessage: null,
	};
};
