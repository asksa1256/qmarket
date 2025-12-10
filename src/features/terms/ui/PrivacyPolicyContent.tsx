export default function PrivacyPolicyContent() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        개인정보 처리방침
      </h1>
      <p className="text-sm text-gray-600 mb-8 pb-6 border-b-2 border-gray-200">
        <strong>최종 수정일:</strong> 2025년 12월 08일
      </p>

      <p className="text-gray-700 mb-4">
        본 서비스는 운영에 필요한 최소한의 개인정보만을 수집합니다.
      </p>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        1. 수집하는 개인정보
      </h2>

      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
        Discord OAuth를 통해 자동 수집되는 정보
      </h3>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>Discord 사용자 ID</li>
        <li>Discord 사용자명(닉네임)</li>
        <li>Discord에 등록된 이메일 주소</li>
        <li>프로필 이미지</li>
        <li>서비스 회원가입일</li>
        <li>마지막 로그인 일자</li>
      </ul>

      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
        서비스 이용 중 자동 생성되는 정보
      </h3>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>구매/판매 요청 등록 내역</li>
        <li>거래 완료 내역</li>
        <li>아이템 등록 요청 내역</li>
        <li>서비스 이용 기록 (접속 시간, IP 주소)</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        2. 개인정보 이용 목적
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>회원 식별 및 인증</li>
        <li>서비스 제공 (마이페이지, 거래 요청 관리 등)</li>
        <li>부정 이용 방지</li>
        <li>서비스 개선</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        3. 개인정보 보관 및 파기
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>
          회원 탈퇴 시 개인정보는 즉시 삭제되지만, 서비스 이용 기록은 별도의
          삭제 요청이 필요합니다. 프로필코드와 함께 qmarket.cs@gmail.com으로
          요청해주세요.
        </li>
        <li>서비스 종료 시 모든 사용자 데이터가 삭제됩니다.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        4. 사용자 개인정보 권리
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>본인의 개인정보를 조회하고 수정할 수 있습니다 (마이페이지)</li>
        <li>회원 탈퇴를 통해 개인정보 삭제를 요청할 수 있습니다</li>
        <li>개인정보 처리에 대해 문의할 수 있습니다</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        5. 쿠키 사용
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>서비스는 로그인 상태 유지를 위해 쿠키를 사용합니다.</li>
        <li>
          브라우저 설정을 통해 쿠키를 거부할 수 있으나, 이 경우 서비스 이용이
          제한될 수 있습니다.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        6. 개인정보 보호
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>Discord OAuth의 보안 로그인을 제공합니다.</li>
        <li>데이터베이스 접근은 암호화된 연결을 통해서만 가능합니다.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        7. 개인정보 관련 문의
      </h2>
      <p className="text-gray-700 mb-3">
        개인정보 관련 문의사항이 있으시면 다음으로 연락해 주세요.
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>qmarket.cs@gmail.com</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-200">
        8. 정책 변경
      </h2>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
        <li>본 방침은 필요에 따라 변경될 수 있습니다.</li>
        <li>중요한 변경 사항은 서비스 내 공지를 통해 안내 드리겠습니다.</li>
      </ul>

      <hr className="my-10 border-t-2 border-gray-200" />

      <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded">
        <p className="text-sm text-amber-800 leading-relaxed">
          • 중요한 데이터는 별도로 백업해주세요.
        </p>
      </div>

      <p className="text-gray-700 mt-6">
        <strong>시행일:</strong> 2025년 12월 08일
      </p>
    </div>
  );
}
