import KeywordLabel from '@/entities/keyword/ui/KeywordLabel';

interface KeywordScrollerProps {
	keywords: string[];
}

export const KeywordScroller = ({ keywords }: KeywordScrollerProps) => {
	if (keywords.length === 0) return null;

	return (
		<div className="overflow-x-auto scrollbar-hide py-1 text-xs">
			<div className="flex gap-2">
				{keywords.map((k) => (
					<KeywordLabel key={k} label={k} />
				))}
			</div>
		</div>
	);
};
