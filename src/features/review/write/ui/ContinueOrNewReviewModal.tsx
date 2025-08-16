import { motion } from 'framer-motion';
import Image from 'next/image';

interface ContinueOrNewReviewModalProps {
	onStartNew: () => void;
	onContinue: () => void;
	onClose?: () => void;
}

const ContinueOrNewReviewModal = ({
	onStartNew,
	onContinue,
	onClose,
}: ContinueOrNewReviewModalProps) => {
	const handleStartNew = () => {
		onStartNew();
		onClose?.();
	};

	const handleContinue = () => {
		onContinue();
		onClose?.();
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.9, opacity: 0 }}
				className="bg-white rounded-2xl px-4 py-5 w-full max-w-sm text-center flex flex-col justify-center items-center gap-5"
				onClick={(e) => e.stopPropagation()}
			>
				<span className="text-grey-90 text-lg font-semibold">
					<b className="text-primary-50 text-lg font-semibold">앗!</b>
					{` 이전에 쓰던 리뷰가 있어요.`}
				</span>
				<div className="flex flex-col justify-start items-center gap-2">
					<div
						data-mode="mode3"
						className="w-64 px-3 py-2 bg-slate-50 rounded-xl flex flex-col justify-center items-start gap-2.5 overflow-hidden"
					>
						<div className="flex-1 flex justify-start items-center gap-3">
							<Image
								className="w-10 h-10 relative rounded"
								src="/images/store1.png"
								alt="매장 이미지"
								width={40}
								height={40}
							/>
							<div className="inline-flex flex-col justify-start items-start">
								<div className="inline-flex justify-start items-center gap-1.5">
									<div className="justify-center text-grey-90 text-sm font-semibold">
										매장명
									</div>
									<div className="justify-center text-grey-90 text-xs font-normal">
										(음식이름)
									</div>
								</div>
								<div className="inline-flex justify-start items-center gap-1">
									<div className="justify-center text-grey-90 text-xs font-normal">
										서귀포시 애월읍
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="w-72 h-6 text-center justify-center text-grey-70 text-xs font-medium">
						쓰고 있던 리뷰의 가게예요
					</div>
				</div>
				<div className="flex gap-3 self-stretch">
					<button
						onClick={handleContinue}
						className="flex-1 py-3 font-semibold text-grey-90"
					>
						계속 쓰기
					</button>
					<button
						onClick={handleStartNew}
						className="flex-1 py-3 font-semibold text-primary-50"
					>
						새로 쓰기
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
};

export default ContinueOrNewReviewModal;
