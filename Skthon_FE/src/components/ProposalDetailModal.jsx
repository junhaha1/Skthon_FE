import React from 'react';

const ProposalDetailModal = ({ isOpen, onClose, proposal }) => {
  if (!isOpen || !proposal) return null;

  // 채택 상태 스타일
  const getSelectedStatusStyle = (selected) => {
    switch (selected) {
      case 'SELECTED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  // 채택 상태 텍스트
  const getSelectedStatusText = (selected) => {
    switch (selected) {
      case 'SELECTED':
        return '채택';
      case 'REJECTED':
        return '거절';
      case 'PENDING':
      default:
        return '검토중';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">제안서 상세보기</h2>
            <p className="text-gray-600 mt-1">{proposal.assignTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 컨텐츠 */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* 제안서 정보 */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {proposal.title}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSelectedStatusStyle(proposal.selected)}`}>
                {getSelectedStatusText(proposal.selected)}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">작성자:</span>
                  <span className="ml-2 text-gray-600">{proposal.userName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">이메일:</span>
                  <span className="ml-2 text-gray-600">{proposal.userEmail}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">제출일:</span>
                  <span className="ml-2 text-gray-600">{new Date(proposal.updateAt).toLocaleDateString('ko-KR')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">공고:</span>
                  <span className="ml-2 text-gray-600">{proposal.assignTitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 제안서 내용 */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">제안서 내용</h4>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {proposal.content}
              </p>
            </div>
          </div>
        </div>

        {/* 푸터 - 액션 버튼들 */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            닫기
          </button>
          {proposal.selected === 'PENDING' && (
            <>
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium">
                거절
              </button>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
                채택
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProposalDetailModal;