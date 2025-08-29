import React from 'react';

interface InfoBoxProps {
	title?: string;
	children: React.ReactNode;
	type?: 'info' | 'warning' | 'success';
}

interface SectionCardProps {
	title: string;
	children: React.ReactNode;
	bgColor?: string;
	borderColor?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({
	title,
	children,
	type = 'info',
}) => {
	const colorClasses = {
		info: 'bg-blue-50 border-blue-200 text-blue-800',
		warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
		success: 'bg-green-50 border-green-200 text-green-800',
	};

	return (
		<div className={`${colorClasses[type]} border rounded-lg p-4`}>
			{title && <h4 className="font-medium mb-2">{title}</h4>}
			<div className="text-sm">{children}</div>
		</div>
	);
};

const SectionCard: React.FC<SectionCardProps> = ({
	title,
	children,
	bgColor = 'bg-white',
	borderColor = 'border-l-blue-500',
}) => (
	<div
		className={`${bgColor} rounded-xl shadow-sm border border-gray-100 p-6 ${borderColor} border-l-4`}
	>
		<div className="mb-6">
			<h2 className="text-lg font-semibold text-gray-800">{title}</h2>
		</div>
		<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
			{children}
		</div>
	</div>
);

export default function PrivacyPolicy() {
	return (
		<div className="max-w-4xl mx-auto bg-white min-h-screen">
			{/* Header */}
			<div className="text-center py-8 px-6 border-b-2 border-gray-100">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					똑똣 개인정보 보호정책
				</h1>
				<p className="text-sm text-gray-500">
					사용자의 개인정보 보호를 위한 정책을 안내합니다
				</p>
			</div>

			<div className="p-6 space-y-8">
				{/* 01 개인정보 보호정책 */}
				<SectionCard title="01 개인정보 보호정책">
					<p>
						본 개인정보 처리방침은 모여봐요 트로피의 숲(이하 "서비스
						제공자")에서 무료 서비스로 제작한 모바일 기기용 똑똣 앱(이하
						"애플리케이션")에 적용됩니다.
					</p>
				</SectionCard>

				{/* 02 정보 수집 및 사용 */}
				<SectionCard title="02 정보 수집 및 사용">
					<p>
						이 애플리케이션은 다운로드 및 사용 시 정보를 수집합니다. 이 정보에는
						다음과 같은 정보가 포함될 수 있습니다.
					</p>

					<div className="mt-6">
						<h3 className="text-base font-semibold text-gray-800 mb-4">
							1. 사용자의 동의를 받고 처리하는 개인정보
						</h3>
						<p className="mb-4">
							똑똣은 다음의 개인정보 항목을 사용자의 동의를 받은 뒤 처리하고
							있습니다.
						</p>

						<div className="space-y-4">
							<div className="bg-gray-50 rounded-lg p-4">
								<h4 className="font-medium text-gray-800 mb-2">
									회원가입 및 관리
								</h4>
								<ul className="list-disc ml-4 space-y-1 text-gray-600">
									<li>이메일, 닉네임, 저장한 리뷰, 프로필 사진(사진등록 시)</li>
									<li>카카오 계정 정보(이메일, 이름)</li>
								</ul>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<h4 className="font-medium text-gray-800 mb-2">리뷰 등록 시</h4>
								<ul className="list-disc ml-4 space-y-1 text-gray-600">
									<li>방문한 가게, 주문내역, 사진</li>
								</ul>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<h4 className="font-medium text-gray-800 mb-2">위치 설정 시</h4>
								<ul className="list-disc ml-4 space-y-1 text-gray-600">
									<li>현재 위치 정보</li>
								</ul>
							</div>

							<div className="bg-gray-50 rounded-lg p-4">
								<h4 className="font-medium text-gray-800 mb-2">
									사용자 신고 시
								</h4>
								<ul className="list-disc ml-4 space-y-1 text-gray-600">
									<li>신고자 정보, 신고 사유, 상세 내용</li>
								</ul>
							</div>
						</div>
					</div>

					<div className="mt-6">
						<h3 className="text-base font-semibold text-gray-800 mb-4">
							2. 서비스 이용과정에서 자동으로 생성 및 수집되는 정보
						</h3>
						<ul className="list-disc ml-4 space-y-2">
							<li>장치의 인터넷 프로토콜 주소(예: IP 주소)</li>
							<li>
								사용자가 검색한 기록, 방문한 페이지, 방문 시간 및 날짜, 해당
								페이지에서 소요된 시간 등 서비스 이용기록
							</li>
						</ul>
					</div>

					<InfoBox title="위치 정보 활용" type="info">
						<p>
							이 애플리케이션은 사용자 기기의 위치를 수집하여 서비스 제공자가
							사용자의 대략적인 지리적 위치를 파악하고 다음과 같은 방법으로
							활용합니다:
						</p>
						<p className="mt-2">
							<strong>지리적 위치 서비스:</strong> 서비스 제공자는 개인화된
							콘텐츠, 관련 추천, 위치 기반 서비스와 같은 기능을 제공하기 위해
							위치 데이터를 활용합니다.
						</p>
					</InfoBox>

					<p className="mt-4">
						서비스 제공자는 귀하가 제공한 정보를 사용하여 귀하에게 중요한 정보,
						공지 및 프로모션을 제공하기 위해 수시로 귀하에게 알림을 제공할 수
						있습니다.
					</p>
				</SectionCard>

				{/* 03 개인정보 처리 및 보유 정책 */}
				<SectionCard title="03 개인정보 처리 및 보유 정책">
					<p>
						개인정보 수집 시 사용자로부터 동의받은 보유/이용 기간 내에서
						개인정보를 처리 및 보유합니다.
					</p>

					<div className="mt-6">
						<h3 className="text-base font-semibold text-gray-800 mb-4">
							1. 법적, 목적별 보유 기간
						</h3>

						<div className="overflow-x-auto">
							<table className="w-full border border-gray-200 rounded-lg">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
											정보 항목
										</th>
										<th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
											수집 목적
										</th>
										<th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
											보유 기간
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									<tr className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600">이메일</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											회원가입 및 로그인
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											회원 탈퇴 시 즉시 파기
										</td>
									</tr>
									<tr className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600">
											위치 정보(선택)
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											주변 음식점 탐색 및 거리 필터 제공
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											수집일로부터 3년 경과 시 자동 파기
										</td>
									</tr>
									<tr className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600">
											사진 및 리뷰 내용
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											리뷰 작성
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											회원 탈퇴와 관계없이 익명 처리된 상태로 보관·유지
										</td>
									</tr>
									<tr className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600">
											저장 내역
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											이용 편의성 제공
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											회원 탈퇴 시 즉시 파기
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>

					<div className="mt-6 space-y-4">
						<h3 className="text-base font-semibold text-gray-800">
							2. 사용자 요청에 따른 보존 및 삭제
						</h3>
						<p>
							별도로 보관 의무가 있는 정보는 해당 기간 동안 보관 후 파기합니다.
						</p>

						<h3 className="text-base font-semibold text-gray-800">
							3. 보관 및 파기
						</h3>
						<ul className="list-disc ml-4 space-y-2">
							<li>
								보존 기간이 경과하거나 처리 목적이 달성된 개인정보는 자동화된
								절차를 통해 삭제됩니다.
							</li>
							<li>삭제된 개인정보는 복구가 불가능하게 처리됩니다.</li>
							<li>
								애플리케이션을 통해 제공한 사용자 제공 데이터를 삭제하려면{' '}
								<span className="font-medium text-blue-600">똑똣 이메일</span>로
								문의하시면 합리적인 시간 내에 답변해 드리겠습니다.
							</li>
						</ul>
					</div>
				</SectionCard>

				{/* 04 14세 미만 아동의 개인정보 처리 */}
				<SectionCard
					title="04 14세 미만 아동의 개인정보 처리에 관한 사항"
					borderColor="border-l-orange-500"
				>
					<InfoBox type="warning">
						<p>
							서비스 제공자는 고의로 14세 미만 아동에 대한 개인 식별 정보를
							수집하지 않습니다.
						</p>
					</InfoBox>

					<p>
						서비스 제공자는 모든 어린이가 애플리케이션 및/또는 서비스를 통해
						개인 식별 정보를 제출하지 않도록 권장합니다.
					</p>

					<p>
						서비스 제공자는 부모와 법적 보호자가 자녀의 인터넷 사용을
						모니터링하고 자녀가 본인의 허락 없이 애플리케이션 및/또는 서비스를
						통해 개인 식별 정보를 제공하지 않도록 교육하여 이 정책을 시행하는 데
						도움을 줄 것을 권장합니다.
					</p>

					<p>
						자녀가 애플리케이션 및/또는 서비스를 통해 서비스 제공자에게 개인
						식별 정보를 제공했다고 생각할 만한 이유가 있는 경우 서비스 제공자(
						<span className="font-medium text-blue-600">똑똣 이메일</span>)에게
						연락하여 필요한 조치를 취하도록 하십시오.
					</p>
				</SectionCard>

				{/* 05 보안 및 개인정보 파기 절차 */}
				<SectionCard
					title="05 보안 및 개인정보 파기 절차"
					borderColor="border-l-green-500"
				>
					<p>
						서비스 제공자는 귀하의 정보 기밀 유지에 최선을 다하고 있습니다.
						서비스 제공자는 처리 및 유지하는 정보를 보호하기 위해 물리적,
						전자적, 절차적 보안 조치를 제공합니다.
					</p>

					<p>
						개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게
						되었을 때에는 지체없이 해당 개인정보를 파기합니다.
					</p>

					<div className="mt-6">
						<h3 className="text-base font-semibold text-gray-800 mb-4">
							개인정보 파기의 절차
						</h3>
						<InfoBox type="success">
							<p>
								<strong>파기절차:</strong> 파기기준에 도달한 개인정보는 자동화된
								처리를 통해 삭제하며, 해당 삭제 과정은 전산 시스템을 통해
								관리자에게 통보됩니다.
							</p>
						</InfoBox>
					</div>
				</SectionCard>

				{/* 06 변경 사항 */}
				<SectionCard title="06 변경 사항" borderColor="border-l-yellow-500">
					<p>
						본 개인정보 보호정책은 어떠한 이유로든 수시로 업데이트될 수
						있습니다.
					</p>

					<p>
						서비스 제공업체는 이 페이지를 새로운 개인정보 보호정책으로
						업데이트하여 개인정보 보호정책의 변경 사항을 알림 페이지를 통해
						귀하에게 알립니다.
					</p>

					<InfoBox type="warning">
						<p>
							본 개인정보 보호정책을 정기적으로 확인하여 변경 사항을 확인하시기
							바랍니다. 본 정책을 계속 사용하는 것은 모든 변경 사항에 동의하는
							것으로 간주됩니다.
						</p>
					</InfoBox>
				</SectionCard>

				{/* 07 개인정보 자동 수집 */}
				<SectionCard title="07 개인정보 자동 수집 및 그 거부에 관한 사항">
					<p>
						서비스 제공업체는 정보주체에게 개별적인 맞춤서비스를 제공하기 위해
						이용정보를 저장하고 수시로 불러오는 개인정보 자동 수집 장치인
						'쿠키(cookie)'를 사용하며, 이용자는 이를 원치 않을 경우 아래를
						참고하셔서 쿠키를 차단 할 수 있습니다.
					</p>

					<div className="space-y-4 mt-4">
						<div className="bg-gray-50 rounded-lg p-4">
							<h4 className="font-medium text-gray-800 mb-2">
								쿠키(Cookie)란?
							</h4>
							<p>
								쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의
								브라우저에게 보내는 소량의 정보이며 정보주체의 PC 또는 모바일에
								저장됩니다.
							</p>
						</div>

						<div className="bg-gray-50 rounded-lg p-4">
							<h4 className="font-medium text-gray-800 mb-2">쿠키 설정</h4>
							<p>
								정보주체는 쿠키 설치에 대한 선택권을 가지고 있습니다. 따라서
								정보주체는 웹 브라우저에서 옵션을 설정을 통해 쿠키허용, 차단
								등의 설정을 할 수 있습니다.
							</p>
							<p className="mt-2 text-orange-600 font-medium">
								⚠️ 쿠키 저장을 거부할 경우 쿠키를 사용 하는 일부 기능이
								정상적으로 작동하지 않을 수 있습니다.
							</p>
						</div>
					</div>
				</SectionCard>

				{/* 08 귀하의 동의 */}
				<SectionCard title="08 귀하의 동의" borderColor="border-l-purple-500">
					<InfoBox type="info">
						<p>
							본 애플리케이션을 사용함으로써 귀하는 현재 및 당사가 개정한 본
							개인정보 보호정책에 명시된 대로 귀하의 정보 처리에 동의하는
							것입니다.
						</p>
					</InfoBox>
				</SectionCard>

				{/* 09 문의하기 */}
				<SectionCard title="09 문의하기" borderColor="border-l-indigo-500">
					<div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
						<h4 className="font-medium text-indigo-800 mb-2">문의 연락처</h4>
						<p className="text-indigo-700">
							애플리케이션을 사용하는 동안 개인정보 보호와 관련된 질문이 있거나,
							개인정보 보호 관행에 관한 질문이 있는 경우,{' '}
							<span className="font-semibold">똑똣 이메일</span>로 이메일을 보내
							서비스 제공자에게 문의하세요.
						</p>
					</div>
				</SectionCard>

				{/* Footer */}
				<div className="text-center py-8 border-t border-gray-200">
					<p className="text-xs text-gray-500 mb-2">
						본 개인정보 보호정책은 2024년 01월 01일부터 시행됩니다.
					</p>
					<p className="text-xs text-gray-400">
						마지막 업데이트: 2024년 01월 01일
					</p>
				</div>
			</div>
		</div>
	);
}
