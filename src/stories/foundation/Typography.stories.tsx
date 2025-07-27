import React from 'react';

export default {
	title: 'FOUNDATIONS/FONT',
};

export const TypographyGuide = () => {
	return (
		<div style={{ padding: '2rem', lineHeight: 1.8 }}>
			<h2>🧵 Pretendard (Korean)</h2>

			<p style={{ fontSize: '1.5rem', fontWeight: 400 }}>
				<span lang="ko">가나다라마바사 (Regular - 400)</span>
			</p>
			<p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
				<span lang="ko">가나다라마바사 (Medium - 500)</span>
			</p>
			<p style={{ fontSize: '1.5rem', fontWeight: 600 }}>
				<span lang="ko">가나다라마바사 (SemiBold - 600)</span>
			</p>

			<hr style={{ margin: '2rem 0' }} />

			<h2>🧵 Manrope (English)</h2>

			<p style={{ fontSize: '1.5rem', fontWeight: 400 }}>
				<span lang="en">The quick brown fox jumps (Regular - 400)</span>
			</p>
			<p style={{ fontSize: '1.5rem', fontWeight: 500 }}>
				<span lang="en">The quick brown fox jumps (Medium - 500)</span>
			</p>
			<p style={{ fontSize: '1.5rem', fontWeight: 600 }}>
				<span lang="en">The quick brown fox jumps (SemiBold - 600)</span>
			</p>

			<hr style={{ margin: '2rem 0' }} />

			<h2>🌏 Mixed Example</h2>
			<p style={{ fontSize: '1.25rem', fontWeight: 500 }}>
				<span lang="ko">안녕하세요, </span>
				<span lang="en">Welcome to the Font Guide!</span>
			</p>
		</div>
	);
};
