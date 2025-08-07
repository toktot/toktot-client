// features/StoreDetail/components/Copy.tsx
'use client';

type CopyButtonProps = {
	text: string;
};

export const CopyButton = ({ text }: CopyButtonProps) => {
	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			alert('텍스트가 복사되었습니다!');
		} catch (err) {
			alert('복사에 실패했습니다.');
			console.error(err);
		}
	};

	return (
		<button
			onClick={handleCopy}
			className="ml-2 text-grey-60 text-[12px] underline"
		>
			복사
		</button>
	);
};
