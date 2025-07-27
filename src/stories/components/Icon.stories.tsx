import type { Meta } from '@storybook/nextjs';

import { DEFAULT_ICON_SIZE, SIZE } from '@/shared/icons/constants';
import { ICON_MAP, IconName } from '@/shared/icons/iconMap';
import Icon from '@/shared/ui/Icon';

export const IconGallery = ({ size }: { size: keyof typeof SIZE }) => {
	return (
		<div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
			{(Object.keys(ICON_MAP) as IconName[]).map((iconName) => (
				<div key={iconName} className="flex flex-col items-center w-20">
					<Icon name={iconName} size={size} />
					<div style={{ marginTop: 8, fontSize: 12 }}>{iconName}</div>
				</div>
			))}
		</div>
	);
};

export default {
	title: 'Components/Icons',
	component: IconGallery,
	args: {
		size: DEFAULT_ICON_SIZE,
	},
	argTypes: {
		size: {
			control: { type: 'select' },
			options: Object.keys(SIZE),
		},
	},
} satisfies Meta<typeof IconGallery>;
