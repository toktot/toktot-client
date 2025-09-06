interface AuthorScoreLabelProps {
	nickname: string;
	score: number;
}

export const AuthorScoreLabel = ({
	nickname,
	score,
}: AuthorScoreLabelProps) => {
	return (
		<div className="inline-flex items-center gap-2 px-2 py-1 rounded bg-white text-sub-green-50 text-xs border-sub-green-50 border ">
			<span className="">{nickname}</span>
			<span className="font-bold">{score.toFixed(1)}</span>
		</div>
	);
};
