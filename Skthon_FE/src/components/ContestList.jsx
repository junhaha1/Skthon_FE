import React, { useState, useEffect } from 'react';
import ApiClient from '../service/ApiClient';
import AssignmentDetailModal from './AssignmentDetailModal';

const ContestList = () => {
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError('');
      const response = await ApiClient.getAllAssignments();
      setAssignments(response.data || []);
    } catch (error) {
      console.error('과제 조회 실패:', error);
      setError('과제를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

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

  const isExpired = (endAt) => {
    if (!endAt) return false;
    const endDate = new Date(endAt);
    const now = new Date();
    return endDate < now;
  };

  const handleAssignmentClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAssignmentId(null);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">과제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">과제를 불러올 수 없습니다</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchAssignments}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">
          공모전 목록
        </h3>
        <p className="text-gray-600">
          다양한 공모전을 확인하고 참여해보세요
        </p>
      </div>

      {/* 필터 버튼 (정렬 박스 제거됨) */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          전체
        </button>
        <button className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          창업
        </button>
        <button className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          기술
        </button>
        <button className="px-4 py-2 bg-white text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          사회
        </button>
      </div>

      {/* 과제 그리드 - 가로 4개 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 과제가 없습니다</h3>
            <p className="text-gray-600">새로운 과제가 등록되면 여기에 표시됩니다.</p>
          </div>
        ) : (
          assignments.map((assignment) => (
            <div 
              key={assignment.id} 
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 cursor-pointer"
              onClick={() => handleAssignmentClick(assignment.id)}
            >
              {/* 이미지 */}
              <div className="h-40 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                {assignment.assignImage ? (
                  <img 
                    src={`data:image/jpeg;base64,${assignment.assignImage}`} 
                    alt={assignment.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-14 h-14 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-blue-600 font-medium text-sm">과제</p>
                  </div>
                )}
              </div>

              {/* 콘텐츠 */}
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    과제
                  </span>
                  {assignment.endCheck && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      마감됨
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                  {assignment.title}
                </h3>
                
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                  {assignment.content}
                </p>

                <div className="space-y-1 mb-3 text-xs text-gray-500">
                  <div>시작: {formatDate(assignment.startAt)}</div>
                  <div>
                    마감: {formatDate(assignment.endAt)}
                    {isExpired(assignment.endAt) && (
                      <span className="ml-1 text-red-500 font-medium">(마감됨)</span>
                    )}
                  </div>
                  <div>작성자: {assignment.adminName}</div>
                </div>

                <button 
                  className={`w-full py-2 rounded-lg text-sm transition-colors duration-200 font-medium ${
                    assignment.endCheck || isExpired(assignment.endAt)
                      ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={assignment.endCheck || isExpired(assignment.endAt)}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAssignmentClick(assignment.id);
                  }}
                >
                  {assignment.endCheck || isExpired(assignment.endAt) ? '마감된 과제' : '자세히 보기'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 상세 모달 */}
      <AssignmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        assignmentId={selectedAssignmentId}
      />
    </div>
  );
};

export default ContestList;
