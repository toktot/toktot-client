export function getTimeAgo(dateString: string): string {
	const now = new Date();
	const date = new Date(dateString);
	const diff = (now.getTime() - date.getTime()) / 1000; // 초

	if (diff < 60) return `${Math.floor(diff)}초 전`;
	if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
	if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
	return `${Math.floor(diff / 86400)}일 전`;
}
