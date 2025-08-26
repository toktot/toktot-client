'use client';

import { AppShell } from '@/widgets/layout';

export default function ComingSoonPage() {
	return (
		<AppShell showBottomNav={true}>
			<div className="flex-1 bg-gradient-to-br from-primary-30 via-primary-10 to-primary-20 flex items-center justify-center p-4">
				<div className="text-center max-w-md mx-auto">
					{/* Construction Icon */}
					<div className="mb-8 relative flex justify-center">
						<div className="animate-bounce text-6xl mb-4">🚧</div>
					</div>

					{/* Main Content */}
					<div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 animate-fade-in">
						<h2 className="text-xl font-semibold text-orange-600 mb-4">
							열심히 준비 중입니다!
						</h2>

						<p className="text-gray-600 leading-relaxed mb-6">
							간편하게 합리적인 맛집을 즐길 수 있도록
							<br />
							현재 열심히 개발하고 있습니다.
						</p>

						<div className="bg-orange-50 rounded-lg p-4 mb-6">
							<p className="text-sm text-orange-700">
								🍽️ <strong>곧 만나볼 수 있는 기능들</strong>
								<br />
								• 메뉴판 업로드
								<br />
							</p>
						</div>
					</div>

					{/* Contact Info */}
					<div className="bg-white rounded-xl p-4 text-center">
						<p className="text-gray-800 font-medium">
							📧 문의사항이 있으시면 언제든 연락주세요!
						</p>
					</div>

					{/* Tools Animation */}
					<div className="mt-8 text-2xl space-x-4 flex justify-center">
						{['🔧', '🔨', '⚙️', '🛠️'].map((tool, index) => (
							<span
								key={tool}
								className="inline-block animate-bounce"
								style={{ animationDelay: `${index * 0.1}s` }}
							>
								{tool}
							</span>
						))}
					</div>

					{/* Footer */}
					<div className="mt-8 text-white text-sm opacity-75">
						<p>© 똑똣 - Coming Soon</p>
					</div>
				</div>

				<style jsx>{`
					@keyframes fade-in {
						from {
							opacity: 0;
							transform: translateY(20px);
						}
						to {
							opacity: 1;
							transform: translateY(0);
						}
					}

					@keyframes spin-slow {
						from {
							transform: rotate(0deg);
						}
						to {
							transform: rotate(360deg);
						}
					}

					.animate-fade-in {
						animation: fade-in 1s ease-out;
					}

					.animate-spin-slow {
						animation: spin-slow 3s linear infinite;
					}
				`}</style>
			</div>
		</AppShell>
	);
}
