module.exports = {
	svgProps: {
		width: '{props.width}',
		height: '{props.height}',
	},
	plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
	svgoConfig: {
		plugins: [
			{
				/**
				 * @description width/height 제거
				 * (props로 사이즈 조절 위함)
				 */
				name: 'removeDimensions',
				active: true,
			},
			{
				// 반드시 false: viewBox는 유지해야 크기 조절 가능
				name: 'removeViewBox',
				active: false,
			},
		],
	},
};
