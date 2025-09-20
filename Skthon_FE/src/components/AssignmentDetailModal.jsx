import React, { useState, useEffect } from 'react';
import ApiClient from '../service/ApiClient';
import { useAssignment } from '../contexts/AssignmentContext';

const AssignmentDetailModal = ({ isOpen, onClose, assignmentId }) => {
  const { createChatbotTab, chatbotTabs } = useAssignment();
  const [assignment, setAssignment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && assignmentId) {
      fetchAssignmentDetail();
    }
  }, [isOpen, assignmentId]);

  const fetchAssignmentDetail = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await ApiClient.getAssignmentById(assignmentId);
      setAssignment(response.data);
    } catch (error) {
      console.error('과제 상세 조회 실패:', error);
      setError('과제 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    if (!dateString) return '날짜 미정';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // 마감 상태 확인
  const isExpired = (endAt) => {
    if (!endAt) return false;
    const endDate = new Date(endAt);
    const now = new Date();
    return endDate < now;
  };

  // 챗봇 생성하기
  const handleCreateChatbot = () => {
    if (assignment) {
      createChatbotTab(assignment);
      onClose(); // 상세보기 모달 닫기
      
      // 챗봇 모달 열기 (전역 이벤트 발생)
      window.dispatchEvent(new CustomEvent('openChatbot'));
    }
  };

  // 해당 과제에 대한 챗봇 탭이 이미 있는지 확인
  const hasExistingChatbot = () => {
    return chatbotTabs.some(tab => tab.assignmentId === assignmentId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] mx-4 overflow-hidden flex flex-col">
        {/* 모달 헤더 */}
        <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold">과제 상세보기</h3>
              <p className="text-blue-100 text-sm">과제 정보를 자세히 확인하세요</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 transition-colors"
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
                <p className="text-gray-600 text-lg">과제 정보를 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mb-4">
                  <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">과제를 불러올 수 없습니다</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button 
                  onClick={fetchAssignmentDetail}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            </div>
          ) : assignment ? (
            <div className="p-6">
              {/* 이미지 섹션 */}
              {assignment.assignImage && (
                <div className="mb-6">
                  <img 
                    src={`data:image/jpeg;base64,${assignment.assignImage}`} 
                    alt={assignment.title}
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              {/* 제목과 상태 */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    과제
                  </span>
                  {assignment.endCheck && (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                      마감됨
                    </span>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {assignment.title}
                </h1>
              </div>

              {/* 과제 내용 */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">과제 내용</h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {assignment.content}
                  </p>
                </div>
              </div>

              {/* 과제 정보 */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">과제 정보</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-gray-700">시작일</span>
                    </div>
                    <p className="text-gray-600">{formatDate(assignment.startAt)}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium text-gray-700">마감일</span>
                    </div>
                    <p className="text-gray-600">
                      {formatDate(assignment.endAt)}
                      {isExpired(assignment.endAt) && (
                        <span className="ml-2 text-red-500 font-medium">(마감됨)</span>
                      )}
                    </p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-medium text-gray-700">작성자</span>
                    </div>
                    <p className="text-gray-600">{assignment.adminName}</p>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium text-gray-700">이메일</span>
                    </div>
                    <p className="text-gray-600">{assignment.adminEmail}</p>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button
                  onClick={handleCreateChatbot}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {hasExistingChatbot() ? '챗봇 열기' : '챗봇 생성하기'}
                </button>
                {!assignment.endCheck && !isExpired(assignment.endAt) && (
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                    참여하기
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailModal;
