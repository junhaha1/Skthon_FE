import React from 'react';

const ProposalDetailModal = ({ proposal, isOpen, onClose }) => {
  if (!isOpen || !proposal) return null;

  // 채택 상태에 따른 스타일 반환
  const getSelectedStatusStyle = (selected) => {
    switch (selected) {
      case 'SELECTED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // 채택 상태 한글 변환
  const getSelectedStatusText = (selected) => {
    switch (selected) {
      case 'SELECTED':
        return '채택됨';
      case 'REJECTED':
        return '미채택';
      case 'PENDING':
      default:
        return '검토중';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold text-gray-900">제안서 상세보기</h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSelectedStatusStyle(proposal.selected)}`}>
              {getSelectedStatusText(proposal.selected)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 transition-colors duration-200 p-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* 기본 정보 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">제안서 제목</label>
                <p className="text-gray-900 font-medium">{proposal.title}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">공고명</label>
                <p className="text-gray-900">{proposal.assignTitle}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">제출자</label>
                <p className="text-gray-900">{proposal.userName}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">제출일</label>
                <p className="text-gray-900">{new Date(proposal.updateAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</p>
              </div>
            </div>
          </div>

          {/* 제안서 내용 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">제안서 내용</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="prose max-w-none">
                <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                  {proposal.content}
                </p>
              </div>
            </div>
          </div>

          {/* 채택 상태 정보 */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">채택 상태</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getSelectedStatusStyle(proposal.selected)}`}>
                  {getSelectedStatusText(proposal.selected)}
                </span>
                <p className="text-sm text-gray-600">
                  {proposal.selected === 'PENDING' && '현재 검토 중입니다. 결과를 기다려주세요.'}
                  {proposal.selected === 'SELECTED' && '축하합니다! 제안서가 채택되었습니다.'}
                  {proposal.selected === 'REJECTED' && '아쉽게도 이번에는 채택되지 않았습니다.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;
