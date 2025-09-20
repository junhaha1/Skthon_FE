import React from 'react';
import { useAssignment } from '../contexts/AssignmentContext';

const SummaryModal = ({ isOpen, onClose, summaryContent, isLoading }) => {
  const { getActiveTab } = useAssignment();
  const activeTab = getActiveTab();
  const currentAssignment = activeTab?.assignment;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] mx-4 overflow-hidden flex flex-col">
        {/* 모달 헤더 */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">제안서 요약</h3>
              <p className="text-blue-100 text-sm">
                {currentAssignment ? `"${currentAssignment.title}" 과제 제안서` : 'AI가 생성한 제안서 요약본입니다'}
              </p>
              {currentAssignment && (
                <p className="text-blue-200 text-xs">
                  과제 ID: {currentAssignment.id} | 관리자: {currentAssignment.adminName}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 모달 컨텐츠 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                <p className="text-gray-600 text-lg">제안서를 생성하고 있습니다...</p>
                <p className="text-gray-500 text-sm mt-2">잠시만 기다려주세요</p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-800">생성된 제안서</h4>
                </div>
                
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base">
                    {summaryContent}
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(summaryContent);
                    alert('제안서가 클립보드에 복사되었습니다!');
                  }}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  복사하기
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([summaryContent], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = '제안서_요약.txt';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  다운로드
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
