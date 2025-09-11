import { StoreId } from '@/shared/model/types';
import Icon from '@/shared/ui/Icon';
import Typography from '@/shared/ui/Typography';

interface UploadCompleteWidgetProps {
	storeId: StoreId;
}

export const UploadCompleteWidget = ({}: UploadCompleteWidgetProps) => {
	return (
		<>
			<div className="flex flex-col items-center justify-center flex-1 p-8 space-y-4 text-center">
				<Icon
					name="Checkmark"
					className="text-white fill-primary-50"
					width={64}
					height={64}
					color={'#3ac8ff'}
				/>
				<Typography as="h1" className="text-[28px]">
					메뉴판 내용이
					<br />
					등록됐어요!
				</Typography>
				<p className="text-xs text-grey-80">
					검수 완료 후 해당 가게의 메뉴판을
					<br />
					확인할 수 있습니다.
				</p>
			</div>
		</>
	);
};
