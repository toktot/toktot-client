'use client';

import { useEffect, useState } from 'react';

import StoreCategoryTag from '@/entities/storeCard/components/StoreCategoryTag';
import clsx from 'clsx';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { CopyButton } from '@/features/StoreDetail/components/Copy';
import StoreHome from '@/features/StoreDetail/components/[storeId]/StoreHome';
import StoreMenuSection from '@/features/StoreDetail/components/[storeId]/StoreMenu';
import StoreReview from '@/features/StoreDetail/components/[storeId]/StoreReview';
import api from '@/features/home/lib/api';
import GasimbiCategoryTag from '@/features/home/model/GasimbiCategory';
import TopPercentTag from '@/features/home/model/TopPercentTag';

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

export default function StoreDetailPage() {
	const params = useParams();
	const router = useRouter();

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
		const fetchStore = async () => {
			try {
				const res = await api.get(`/v1/restaurants/${storeId}`);

				const json = res.data;

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
	const handleClick = () => {
		setSelected(true);
	};
	const handleBack = () => {
		router.back();
	};

	if (!store) {
		return (
			<div className="flex items-center justify-center h-screen text-lg font-semibold">
				가게 정보를 찾을 수 없습니다.
			</div>
		);
	}

	return (
		<div className="relative min-h-screen flex justify-center cursor-pointer">
			<div className="relative w-full h-[300px] max-w-[480px] bg-cover bg-center">
				{store.image ? (
					<Image
						src={store.image}
						alt={store.name}
						fill
						style={{ objectFit: 'cover' }}
						priority
					/>
				) : (
					<Image
						src="/images/foodImage1.png"
						alt="기본 이미지"
						fill
						style={{ objectFit: 'cover' }}
						priority
					/>
				)}
				<Icon
					name={'ArrowLefttBar'}
					className="absolute top-3 left-4 transform text-white"
					onClick={handleBack}
				/>
				<Icon
					name={'Etc'}
					className="absolute top-2 right-2 transform rotate-90 text-white"
					onClick={handleClick}
				/>
				<div className="absolute bottom-4 left-4 text-white">
					<div className="flex flex-wrap items-center gap-2 mb-4">
						<div className="abosolute bottom-4 left-4 text-white">
							<div className="flex items-center gap-2 mb-2">
								<h1 className="text-[20px] font-bold">{store.name}</h1>

								{store.is_local_store && (
									<StoreCategoryTag
										className="text-[9px] px-1 py-0.3"
										type="착한가게"
									/>
								)}
							</div>
							<div className="flex items-center gap-1">
								{/*{store.point !== undefined && (*/}
								<span className="text-sm font-semibold">
									<GasimbiCategoryTag value={store.point ?? 80} />
								</span>
								{/*})}*/}
								{/*{store.value_for_money_score !== undefined && ( */}
								<span className="text-sm font-semibold">
									<TopPercentTag
										value={store.value_for_money_score ?? '상위 20%'}
									/>
								</span>
								{/*})}*/}
							</div>
						</div>
					</div>
				</div>
			</div>

			<BottomSheet open>
				<BottomSheetContent
					className="fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[480px] bg-white rounded-t-3xl max-h-[65vh] overflow-hidden cursor-pointer"
					style={{
						marginTop: '-16px',
						borderTopLeftRadius: '24px',
						borderTopRightRadius: '24px',
					}}
				>
					<div className="overflow-y-auto max-h-[70vh]">
						<div className="px-6">
							<div className=" flex items-center gap-2 mb-2 pt-3">
								<Icon name={'Location'} className="mr-2 w-5 h-5 text-grey-50" />
								<span className="text-grey-80 text-base text-[14px]">
									{store.address}
								</span>
								<CopyButton text={store.address} />
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
										className="text-grey-40 w-5 ml-1"
									/>
								</button>
							</div>

							<div className="flex items-center gap-2 mb-2">
								<Icon name={'call'} className="mr-2 w-5 h-5 text-grey-50" />
								<span className="text-grey-80 text-[14px]">
									{store.phone ?? '정보 없음'}
								</span>
								<CopyButton text={store.phone} />
							</div>

							<div className="flex gap-10 mt-6 border-b border-grey-20">
								{['home', 'menu', 'review'].map((t) => (
									<button
										key={t}
										className={clsx(
											'pb-2 text-base font-semibold transition-colors cursor-pointer',
											tab === t
												? 'text-grey-90 border-b-1 border-grey-80'
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
									<StoreMenuSection />
								</div>
							)}
							{tab === 'review' && (
								<div className="text-gray-700">
									<StoreReview />
								</div>
							)}
						</div>
					</div>
				</BottomSheetContent>
			</BottomSheet>
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
