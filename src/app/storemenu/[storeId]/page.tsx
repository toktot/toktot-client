'use client';

import { useEffect, useState } from 'react';

import StoreCategoryTag from '@/entities/storeCard/components/StoreCategoryTag';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import api from '@/widgets/home/lib/api';
import GasimbiCategoryTag from '@/widgets/home/model/GasimbiCategory';
import TopPercentTag from '@/widgets/home/model/TopPercentTag';
import { CopyButton } from '@/widgets/store-detail/ui/Copy';
import StoreHome from '@/widgets/store-detail/ui/[storeId]/StoreHome';
import StoreMenuSection from '@/widgets/store-detail/ui/[storeId]/StoreMenu';
import StoreReview from '@/widgets/store-detail/ui/[storeId]/StoreReview';

import {
	BottomSheet,
	BottomSheetContent,
} from '@/shared/components/BottomSheet';
import PrimaryButton from '@/shared/components/PrimaryButton';
import Icon from '@/shared/ui/Icon';
import { getDecryptedToken } from '@/shared/utils/storage';

interface StoreData {
	id: number;
	name: string;
	address: string;

	phone: string;
	image?: string;
	business_hours?: string;
	latitude?: number;
	longitude?: number;
	point?: number;
	is_good_price_store?: boolean;
	value_for_money_score?: number;
	is_local_store?: boolean;
}
type ReviewStats = {
	overallRating: number; // 소수점 1자리 표시용
	totalReviewCount: number;
};
export default function StoreDetailPage() {
	const params = useParams();
	const router = useRouter();
	const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
	const storeId = Number(params.storeId);
	const [store, setStore] = useState<StoreData | null>(null);
	const [selected, setSelected] = useState(false);

	useEffect(() => {
		const token = getDecryptedToken();

		if (!token) {
			router.replace('login');
		}
	}, [router]);
	// 단일 Review 객체 추출 // 여기 변경
	useEffect(() => {
		const fetchReviewStats = async () => {
			try {
				const res = await api.get(
					`/v1/restaurants/${storeId}/review-statistics`,
				);
				const json = res.data;

				if (json?.success && json.data) {
					const d = json.data;

					// 문서/서버의 명칭 차이까지 안전하게 커버
					const total = d.totalReviewCount ?? d.totalCount ?? 0;

					const ratingRaw = d.overallRating ?? d.averageRating ?? 0;

					// 소수점 1자리 반올림
					const rating =
						typeof ratingRaw === 'number'
							? Math.round(ratingRaw * 10) / 10
							: Number(ratingRaw) || 0;

					setReviewStats({
						overallRating: rating,
						totalReviewCount: total,
					});
				} else {
					setReviewStats(null);
					console.error(json);
				}
			} catch (e) {
				console.error(e);
				setReviewStats(null);
			}
		};

		fetchReviewStats();
	}, [storeId]);

	useEffect(() => {
		const fetchStore = async () => {
			try {
				const res = await api.get(`/v1/restaurants/${storeId}`);

				const json = res.data;
				console.log(res.data);
				if (json.success && json.data) {
					setStore(json.data);
				} else {
					console.error(json);
					setStore(null);
				}
			} catch (err) {
				console.error(err);
				setStore(null);
			} finally {
			}
		};
		fetchStore();
	}, [storeId]);

	const [tab, setTab] = useState<'home' | 'menu' | 'review'>('home');

	const handleBack = () => {
		router.back();
	};
	const fillColor = '#3AC8FF';

	if (!store) {
		return;
	}

	return (
		<div>
			<div className="relative h-[300px] max-w-[480px] bg-cover bg-center mx-auto">
				{store.image ? (
					<Image
						src={store.image}
						alt={store.name}
						fill
						style={{ objectFit: 'cover' }}
						priority
					/>
				) : (
					<div className="relative min-w-[343px] max-w-[480px] h-[300px] bg-grey-20 flex items-center justify-center text-grey-60 text-sm rounded-3xl overflow-hidden">
						<div className="flex flex-col flex items-center">
							<span className="">
								<Icon name="KoreanDish" size="xxl"></Icon>
							</span>
							<div className="">사진을 준비하고 있어요</div>
						</div>
					</div>
				)}
				<Icon
					name={'ArrowLeftBar'}
					className="absolute top-3 left-4 transform text-white"
					onClick={handleBack}
				/>

				<div className="absolute bottom-4 left-4 text-white">
					<div className="flex flex-wrap items-center gap-2 mb-4">
						<div className="abosolute bottom-4 left-4 text-white">
							<div className="flex items-center gap-2 mb-2">
								{store.is_local_store && (
									<StoreCategoryTag
										className="text-[9px] px-1 py-0.3"
										type="착한가게"
									/>
								)}
							</div>
							<div className="flex items-center gap-1">
								{/*{store.point !== undefined && (*/}
								{store.value_for_money_score && (
									<span className="text-sm font-semibold">
										<TopPercentTag value={store.value_for_money_score} />
									</span>
								)}

								{/* 가심비 점수 */}
								{store.point != null && (
									<span className="text-sm font-semibold">
										<GasimbiCategoryTag value={store.point} />
									</span>
								)}
								{/*})}*/}
								{/*{store.value_for_money_score !== undefined && ( */}

								{/*})}*/}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-white w-full max-w-[480px] mx-auto rounded-t-3xl ">
				<div className="px-4 mt-3">
					<h1 className="text-[20px] font-bold">{store.name}</h1>
					<div className="flex flex-wrap justify items-center gap-1">
						<Icon
							name={'Star'}
							fill={fillColor}
							className="outline-none stroke-0 "
							color={fillColor}
							size="xxs"
						/>
						<span className="text-[14px] font-semibold text-grey-85">
							{(reviewStats?.overallRating ?? 0).toFixed(1)}
						</span>
						<span className="mx-1 text-[#D9D9D9]">·</span>
						<span className="text-[14px] font-semibold text-grey-85">
							리뷰 {reviewStats?.totalReviewCount ?? 0}개
						</span>
						<Icon name="ArrowRight" size="xxs" className=" text-grey-80 ml-1" />
					</div>
					<div className="border border-grey-20 rounded-2xl -mx-1 py-1 px-2 mt-2">
						<div className=" flex items-center gap-2 mb-2 pt-2">
							<Icon name={'Location'} className="mr-2 w-5 h-5 text-grey-50" />
							<span className="text-grey-80 text-base text-[14px]">
								{store.address}
							</span>
							<span className="-ml-2">
								<CopyButton text={store.address} />
							</span>
						</div>

						<div className="flex items-center gap-2 mb-2">
							<Icon name={'Time'} className="mr-2 w-5 h-5 text-grey-50" />
							<span className="text-green-500 text-[14px] font-semibold">
								{store.business_hours ? '영업중' : '정보 없음'}
							</span>
							<span className="text-grey-80 text-[14px] ml-1">
								{store.business_hours ?? '-'}까지
							</span>
							<button>
								<Icon
									name={'ArrowUp'}
									size="xs"
									className="text-grey-40 w-5 ml-1 mb-1"
								/>
							</button>
						</div>

						<div className="flex items-center gap-2 mb-2">
							<Icon name={'call'} className="mr-2 w-5 h-5 text-grey-50" />
							<span className="text-grey-80 text-[14px]">{store.phone}</span>
							<span className="-ml-2">
								<CopyButton text={store.phone} />
							</span>
						</div>
					</div>
					<div className="flex justify-around mt-6 border-b border-grey-20">
						{['home', 'menu', 'review'].map((t) => (
							<button
								key={t}
								className={clsx(
									'pb-2 text-base font-semibold transition-colors cursor-pointer inline-block w-[95px] text-center',
									tab === t
										? 'text-grey-90 border-b-2 border-w-[100px] border-grey-80'
										: 'text-grey-40',
								)}
								onClick={() => setTab(t as typeof tab)}
							>
								{t === 'home' ? '홈' : t === 'menu' ? '메뉴' : '리뷰'}
							</button>
						))}
					</div>
				</div>

				<div>
					{tab === 'home' && (
						<div className="bg-grey-10 w-full">
							<StoreHome />
						</div>
					)}
					{tab === 'menu' && (
						<div className="text-gray-700">
							<div className="h-[0.5px] bg-grey-10 w-full" />
							<StoreMenuSection storeId={storeId} />
						</div>
					)}
					{tab === 'review' && (
						<div className="text-gray-700">
							<StoreReview />
						</div>
					)}
				</div>
			</div>

			{selected && (
				<BottomSheet open>
					<BottomSheetContent className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl min-h-[40vh] overflow-hidden">
						<div className="flex flex-col rounded-2xl items-center justify gap-2 overflow-y-auto ">
							<div className="w-5 h-[2px] bg-grey-70 rounded-full mx-auto mt-2" />
							<button className="flex w-[343px] justify-start items-start px-4 py-4 border border-grey-20 rounded-xl">
								신고하기
							</button>
							<button className="flex justify-start items-start px-4 py-4 w-[343px] border border-grey-20 rounded-xl">
								차단하기
							</button>
							<PrimaryButton
								text="닫기"
								onClick={() => setSelected(false)}
								className="w-[343px] h-[48px] bg-grey-90 text-white mt-3"
							></PrimaryButton>
							<div className="w-16 h-[1.5px] bg-[#000000] rounded-full mx-auto z-50" />
						</div>
					</BottomSheetContent>
				</BottomSheet>
			)}
		</div>
	);
}
