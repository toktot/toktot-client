import Image from 'next/image';
import Link from 'next/link';

import { User } from '@/features/auth/types/auth';
import { UserExtraInfo } from '@/features/review/read/model/types';

interface ReviewUserProps {
	author: User;
	extra?: UserExtraInfo;
}

const ReviewUser = ({ author, extra }: ReviewUserProps) => {
	return (
		<Link
			href={`/User/${author.id}`}
			aria-label={`${author.username} 상세 보기`}
		>
			<div className="flex items-start gap-3">
				<div className="flex-shrink-0">
					<Image
						className="w-9 h-9 rounded-full"
						width={100}
						height={100}
						src={'/images/mockReview.jpg'}
						alt={author.username}
					/>
				</div>

				<div className="flex flex-col min-w-0 flex-1">
					<div className="text-sm font-semibold">{author.username}</div>

					{extra && (
						<div className="mt-1 flex text-xs">
							<p>{extra.totalReviewCount}개</p>
							<div>﹒</div>
							<p>평균 {extra.averageRating}점</p>
						</div>
					)}
				</div>
			</div>
		</Link>
	);
};

export default ReviewUser;
