'use client';

import { Author } from '@/entities/review/model/author';
import Image from 'next/image';
import Link from 'next/link';

interface ReviewUserProps {
	author: Author;
}

const ReviewUser = ({ author }: ReviewUserProps) => {
	return (
		<>
			<Link
				href={{
					pathname: `/user/${author.id}`,
					query: {
						nickname: author.nickname,
						reviewCount: author.reviewCount,
						averageRating: author.averageRating,
						profileImageUrl:
							author.profileImageUrl ?? '/images/avatar_default.png',
					},
				}}
				className="w-full text-left"
				aria-label={`${author.nickname} 정보 보기`}
			>
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0">
						<Image
							className="w-9 h-9 rounded-full"
							src={author.profileImageUrl}
							alt={author.nickname}
							width={100}
							height={100}
						/>
					</div>

					<div className="flex flex-col min-w-0 flex-1">
						<div className="text-sm font-semibold">{author.nickname}</div>
						<div className="mt-1 flex text-xs">
							<p>{author.reviewCount}개</p>
							<div>·</div>
							<p>평균 {author.averageRating}점</p>
						</div>
					</div>
				</div>
			</Link>
		</>
	);
};

export default ReviewUser;
