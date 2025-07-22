import { memo } from 'react';
import type { SVGProps } from 'react';

import { DEFAULT_ICON_SIZE, SIZE } from '@/shared/icons/constants';
import { ICON_MAP, IconName } from '@/shared/icons/iconMap';
import { TSizeName } from '@/shared/icons/types';

interface IconProps extends SVGProps<SVGSVGElement> {
	name: IconName;
	size?: TSizeName;
}

/**
 * @param size? - @default 'm' size, 16px
 */
function Icon({ name, size = DEFAULT_ICON_SIZE, ...props }: IconProps) {
	const { width, height } = SIZE[size];
	const IconComponent = ICON_MAP[name];

	if (!IconComponent) {
		console.warn(`[Icon] "${name}" 아이콘을 찾을 수 없습니다.`);
		return null;
	}

	return <IconComponent width={width} height={height} {...props} />;
}

export default memo(Icon);
