'use client';

interface AlarmBoxProps {
	alarmText: string;
}

export default function AlarmBox({ alarmText }: AlarmBoxProps) {
	if (!alarmText.trim()) return null;

	return (
		<div className="mx-4 mt-3">
			<div className="inline-flex items-center justify-between gap-3 w-full px-4 py-2 rounded-xl bg-primary-5 text-primary-60 text-sm shadow-sm">
				<div className="flex items-center gap-2">
					<span className="text-xs text-gray-400">1분 전</span>
					<span className="font-medium text-gray-800 truncate max-w-[150px]">
						{alarmText}
					</span>
					<span className="text-gray-700 font-semibold">2,600원</span>
				</div>
				<span className="text-gray-400 text-xs">닉네임</span>
			</div>
		</div>
	);
}
