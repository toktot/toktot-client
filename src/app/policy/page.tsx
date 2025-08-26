import React from 'react';

export default function TermsOfService() {
	const CheckboxItem = ({ required = false }) => (
		<div className="flex items-center mb-4">
			<div className="w-5 h-5 rounded border-2 border-gray-300 flex items-center justify-center">
				<input
					type="checkbox"
					className="w-4 h-4 text-blue-600 rounded border-gray-300"
				/>
			</div>
			<span
				className={`ml-3 text-xs px-2 py-1 rounded-full font-medium ${
					required ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
				}`}
			>
				{required ? '필수' : '선택'}
			</span>
		</div>
	);

	return (
		<div className="max-w-4xl mx-auto bg-white min-h-screen">
			{/* Header */}
			<div className="text-center py-8 px-6 border-b-2 border-gray-100">
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					똑똣 서비스 이용약관
				</h1>
				<p className="text-sm text-gray-500">
					서비스 이용을 위해 아래 약관에 동의해주세요
				</p>
			</div>

			<div className="p-6 space-y-8">
				{/* 1. 서비스 이용약관 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
					<div className="flex items-start mb-6">
						<CheckboxItem required={true} />
						<h2 className="text-lg font-semibold text-gray-800 ml-2">
							1. 서비스 이용약관
						</h2>
					</div>

					<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
						<p>
							본 약관은 '똑똣'이 제공하는 음식점 탐색, 사용자 리뷰 열람 및 작성,
							여행 루트 저장 등 전반적인 서비스 이용과 관련하여, '똑똣'과 사용자
							간의 권리·의무 및 책임사항, 그리고 이용 조건 등 필요한 사항을
							규정함을 목적으로 합니다.
						</p>

						<p>
							사용자는 본 서비스를 이용함에 있어 관련 법령 및 본 약관에서 정하는
							바를 준수하여야 하며, 서비스 이용 신청 시 본 약관에 동의함으로써
							이에 대한 법적 효력을 가집니다.
						</p>

						<p>
							본 약관은 '똑똣'의 서비스 운영 정책, 공지사항 등과 함께 사용자의
							서비스 이용에 적용되며, 필요한 경우 사전 고지 후 변경될 수
							있습니다.
						</p>

						<p>
							'똑똣'은 서비스의 원활한 제공을 위하여 사용자가 동의한 목적과 범위
							내에서만 개인정보를 수집·이용하며, 개인정보 보호 관련 법령에 따라
							안전하게 관리합니다.
						</p>

						<p>
							'똑똣'은 서비스의 발전과 더불어 수시로 본 약관 및 정책을 개정할 수
							있습니다. 관련 법령을 위배하지 않는 범위 내에서 개정할 것이며,
							사전에 개정 이유와 적용 일자를 알리도록 하겠습니다.
						</p>
					</div>
				</div>

				{/* 2. 개인정보 수집 및 이용 동의 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
					<div className="flex items-start mb-6">
						<CheckboxItem required={true} />
						<h2 className="text-lg font-semibold text-gray-800 ml-2">
							2. 개인정보 수집 및 이용 동의
						</h2>
					</div>

					<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
						<p>
							<strong>개인정보 수집 목적 :</strong> 가게 리뷰 및 여행 정보 탐색
							서비스 제공, 루트 저장 및 사용자 맞춤형 정보 추천
						</p>
						<p>
							<strong>수집 항목 :</strong> 이름, 이메일, 위치 정보(선택),
							사진(선택), 리뷰 내용 및 저장 내역 등
						</p>

						<div className="overflow-x-auto mt-6">
							<table className="w-full border border-gray-200 rounded-lg">
								<thead className="bg-gray-50">
									<tr>
										<th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
											항목
										</th>
										<th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
											수집 목적
										</th>
										<th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">
											보유 및 이용 기간
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
											회원 탈퇴 시 자동 파기
										</td>
									</tr>
									<tr className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600">
											위치 정보(선택)
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											보다 정확한 내 주변 음식점 탐색, 거리 필터 제공
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											3년 후 자동 파기
										</td>
									</tr>
									<tr className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600">
											사진, 리뷰 내용
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											리뷰 작성
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											회원 탈퇴와 관련 없이 사용자 콘텐츠는 익명 처리되어 유지{' '}
											<br />제 2-1 조 참고
										</td>
									</tr>
									<tr className="hover:bg-gray-50">
										<td className="px-4 py-3 text-sm text-gray-600">
											저장 내역
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											이용 편의성
										</td>
										<td className="px-4 py-3 text-sm text-gray-600">
											회원 탈퇴 시 자동 파기
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>

				{/* 2-1. 회원탈퇴 및 게시물 처리 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
					<div className="flex items-start mb-6">
						<CheckboxItem required={true} />
						<h2 className="text-lg font-semibold text-gray-800 ml-2">
							2-1. 회원탈퇴 및 게시물 처리
						</h2>
					</div>

					<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
						<p>
							회원은 언제든지 '똑똣'의 마이 페이지를 통해 회원 탈퇴를 요청할 수
							있으며, '똑똣'은 관련 법령이 정하는 바에 따라 이를 처리합니다.
						</p>

						<p>
							회원 탈퇴 시, 회원의 개인정보는 「개인정보 보호법」에 따라 즉시
							파기됩니다.
						</p>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
							<p className="font-medium text-yellow-800">
								단, 회원이 작성한{' '}
								<strong>
									리뷰, 댓글, 이미지 등 사용자 콘텐츠는 탈퇴 후에도 삭제되지
									않으며
								</strong>
								,{' '}
								<strong>
									작성자 표기는 '탈퇴한 사용자' 등으로 익명 처리되어 유지됩니다.
								</strong>{' '}
								이에 동의하지 않을 경우, 게시글 삭제 후 탈퇴하실 수 있습니다.
							</p>
						</div>

						<p>
							이는 서비스의 신뢰도 및 정보의 연속성을 유지하기 위한 목적이며,
							회원은 이에 동의한 것으로 간주됩니다.
						</p>
					</div>
				</div>

				{/* 2-2. 개인위치정보 제3자 제공 시 즉시 통보 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-gray-400">
					<h3 className="text-base font-semibold text-gray-800 mb-4">
						2-2. 개인위치정보 제3자 제공 시 즉시 통보
					</h3>

					<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
						<p>
							'똑똣'은 사용자의 동의 없이 사용자의 개인위치정보를 제3자에게
							제공하지 아니하며, 제3자 제공 서비스를 제공하는 경우에는 제공받는
							자 및 제공목적을 사전에 개인위치정보주체에게 고지하고 동의를
							받습니다.
						</p>
					</div>
				</div>

				{/* 3. 게시물 관리 및 이용자 의무 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
					<div className="flex items-start mb-6">
						<CheckboxItem required={true} />
						<h2 className="text-lg font-semibold text-gray-800 ml-2">
							3. 게시물 관리 및 이용자 의무
						</h2>
					</div>

					<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
						<p>
							회원이 서비스 내에 작성한 리뷰, 댓글, 저장 정보, 사진 등(이하
							'게시물')은 해당 회원이 직접 작성한 것으로 간주되며, 그에 대한
							모든 책임은 게시자 본인에게 있습니다.
						</p>

						<p>
							회원은 다음 각 호에 해당하는 게시물을 등록하거나, 서비스 이용 중
							아래 행위를 해서는 안 됩니다.
						</p>

						<ul className="list-disc ml-6 space-y-2">
							<li>타인의 명예를 훼손하거나 모욕하는 내용</li>
							<li>
								욕설, 음란물, 폭력적 표현 등 공공질서 및 미풍양속을 해치는 내용
							</li>
							<li>허위 정보 또는 과도하게 광고성 내용을 담은 게시물</li>
							<li>타인의 개인정보를 무단으로 게시하거나 유출하는 행위</li>
							<li>저작권, 상표권 등 제3자의 권리를 침해하는 행위</li>
							<li>
								시스템의 정상적 운영을 방해하는 행위 또는 자동화 도구를 이용한
								게시·저장 등
							</li>
						</ul>

						<p>
							'똑똣'은 회원의 게시물이 위 조항에 해당한다고 판단되는 경우, 사전
							통보 없이 해당 게시물을 삭제하거나 열람을 제한할 수 있으며, 필요
							시 회원 자격을 정지하거나 탈퇴시킬 수 있습니다.
						</p>

						<p>차단 조치 안내는 계정에 인증 된 정보(이메일)로 전달됩니다.</p>

						<p>
							회원은 본인의 계정 정보 및 비밀번호를 관리할 책임이 있으며,
							타인에게 이를 공유하거나 양도할 수 없습니다.
						</p>

						<p>
							회원은 서비스 이용 시 관련 법령, 본 약관, 운영정책 및 공지사항
							등을 준수하여야 하며, 회사 및 타인의 권리를 침해하거나 서비스
							운영에 지장을 주는 행위를 해서는 안 됩니다.
						</p>
					</div>
				</div>

				{/* 4. 용어의 정의 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-blue-500">
					<div className="flex items-start mb-6">
						<CheckboxItem required={true} />
						<h2 className="text-lg font-semibold text-gray-800 ml-2">
							4. 용어의 정의
						</h2>
					</div>

					<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
						<p>본 서비스에서 사용하는 용어의 정의는 다음과 같습니다.</p>

						<div className="space-y-3">
							<div>
								<span className="font-medium text-gray-800">
									1. 가게(식당) :
								</span>{' '}
								제주도 내에서 운영 중인 음식점, 주점, 카페 등 음식 및 음료를
								판매하는 요식업 업소를 의미하며, 사용자가 방문 후 리뷰를 등록할
								수 있는 대상 업소
							</div>
							<div>
								<span className="font-medium text-gray-800">2. 음식 :</span>{' '}
								사용자가 섭취하고 리뷰를 작성하는 식사, 요리, 음료 등 섭취
								가능한 모든 형태의 식·음료 품목
							</div>
							<div>
								<span className="font-medium text-gray-800">3. 서비스 :</span>{' '}
								가게에서 고객에게 제공하는 음식 제공, 응대, 분위기, 위생, 가격
								정책 등 전반적인 고객 응대 행위
							</div>
							<div>
								<span className="font-medium text-gray-800">4. 청결 :</span>{' '}
								가게의 내·외부 환경, 테이블 및 식기류 상태, 위생 관리 수준 등
								전반적인 위생 상태
							</div>
							<div>
								<span className="font-medium text-gray-800">5. 분위기 :</span>{' '}
								가게가 전달하는 공간적, 시각적, 감성적 인상을 의미하며 인테리어,
								조명, 음악, 창밖 풍경(예: 오션뷰, 한라산뷰), 좌석 간 간격,
								혼잡도 등으로 구성
							</div>
							<div>
								<span className="font-medium text-gray-800">6. 향토음식 :</span>{' '}
								제주도의 전통적 조리 방식과 지역 특산 재료를 기반으로 하여 오랜
								기간 제주도민들 사이에서 즐겨 먹은 고유한 음식
							</div>
						</div>
					</div>
				</div>

				{/* 5. 마케팅 정보 푸시 알림 수신 동의 */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 border-l-4 border-l-green-500">
					<div className="flex items-start mb-6">
						<CheckboxItem required={false} />
						<h2 className="text-lg font-semibold text-gray-800 ml-2">
							5. 마케팅 정보 푸시 알림 수신 동의
						</h2>
					</div>

					<div className="space-y-4 text-sm text-gray-600 leading-relaxed">
						<p>
							'똑똣'은 회원에게 더 나은 여행 경험을 제공하기 위해 아래와 같은
							정보를 푸시 알림으로 제공할 수 있습니다.
						</p>

						<ul className="list-disc ml-6 space-y-1">
							<li>가게 추천</li>
							<li>신규 기능 안내</li>
						</ul>

						<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
							<h4 className="font-medium text-blue-800 mb-2">
								동의 거부 시 불이익
							</h4>
							<ul className="list-disc ml-4 space-y-1 text-blue-700">
								<li>
									마케팅 정보 수신에 대한 동의는 선택 사항이며, 동의를
									거부하시더라도 서비스 이용에 제한은 없습니다.
								</li>
								<li>
									단, 맞춤형 추천, 할인 정보 등의 안내는 제공되지 않을 수
									있습니다.
								</li>
								<li>알림 수신 여부는 마이페이지에서 변경이 가능합니다.</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center py-8 border-t border-gray-200">
					<p className="text-xs text-gray-500">
						본 약관은 2024년 01월 01일부터 시행됩니다.
					</p>
				</div>
			</div>
		</div>
	);
}
