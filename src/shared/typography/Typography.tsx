import React from 'react';

// 사용할 타이포그래피 변형(variant)들을 정의합니다.
type TypographyVariant = 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';

// 컴포넌트가 받을 props의 타입을 정의합니다.
interface TypographyProps {
	/**
	 * 컴포넌트 내부에 표시될 내용입니다.
	 */
	children: React.ReactNode;
	/**
	 * 미리 정의된 타이포그래피 스타일을 선택합니다.
	 * @default 'h2'
	 */
	variant?: TypographyVariant;
	/**
	 * 렌더링할 HTML 태그를 지정합니다. (예: 'h1', 'span', 'p')
	 * @default 'p'
	 */
	as?: React.ElementType;
	/**
	 * 추가적인 Tailwind CSS 클래스를 적용할 수 있습니다.
	 */
	className?: string;
}

// 각 variant에 해당하는 Tailwind CSS 클래스를 매핑합니다.
const variantStyles: Record<TypographyVariant, string> = {
	h1: 'text-2xl font-bold',
	h2: 'text-lg font-semibold',
	h3: 'text-base font-semibold',
	body1: 'text-base font-normal',
	body2: 'text-sm font-normal',
	caption: 'text-xs text-gray-500',
};

/**
 * 일관된 타이포그래피 스타일을 적용하기 위한 UI 컴포넌트입니다.
 */
export const Typography = ({
	children,
	variant = 'h2',
	as: Component = 'p',
	className = '',
}: TypographyProps) => {
	// 기본 스타일과 추가된 클래스를 결합합니다.
	const combinedClassName = `${variantStyles[variant]} ${className}`.trim();

	return <Component className={combinedClassName}>{children}</Component>;
};

export default Typography;
