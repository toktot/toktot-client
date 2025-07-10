import React from 'react';

import clsx from 'clsx';

type TypographyTag =
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'p'
	| 'span'
	| 'strong';

interface TypographyProps {
	/**
	 * 컴포넌트 내부에 표시될 내용입니다.
	 */
	children: React.ReactNode;
	/**
	 * 렌더링할 HTML 태그를 지정합니다. (예: 'h1', 'span', 'p')
	 * @default 'p'
	 */
	as?: TypographyTag;
	/**
	 * 추가적인 Tailwind CSS 클래스를 적용할 수 있습니다.
	 */
	className?: string;
}

const tagStyles: Record<TypographyTag, string> = {
	h1: 'text-2xl font-bold',
	h2: 'text-xl font-semibold',
	h3: 'text-lg font-semibold',
	h4: 'text-base font-semibold',
	h5: 'text-sm font-semibold',
	h6: 'text-xs font-semibold',
	p: 'text-base font-normal',
	span: 'text-base font-normal',
	strong: 'font-medium',
};

/**
 * 일관된 타이포그래피 스타일을 적용하기 위한 UI 컴포넌트입니다.
 */
export const Typography = ({
	children,
	as: Component = 'p',
	className = '',
}: TypographyProps) => {
	const combinedClassName = clsx(tagStyles[Component], className);

	return <Component className={combinedClassName}>{children}</Component>;
};

export default Typography;
