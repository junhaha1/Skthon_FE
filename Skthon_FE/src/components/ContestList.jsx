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

  // 상세보기 모달 열기
  const handleAssignmentClick = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsDetailModalOpen(true);
  };

  // 상세보기 모달 닫기
  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedAssignmentId(null);
  };

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">과제를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 표시
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

  const getCategoryColor = (category) => {
    const colors = {
      '창업': 'bg-green-100 text-green-800',
      '기술': 'bg-blue-100 text-blue-800',
      '사회': 'bg-purple-100 text-purple-800',
      '환경': 'bg-emerald-100 text-emerald-800',
      '문화': 'bg-pink-100 text-pink-800',
      '도시': 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          과제 목록
        </h2>
        <p className="text-gray-600">
          다양한 과제를 확인하고 참여해보세요
        </p>
      </div>

      {/* 필터 및 정렬 */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex space-x-2">
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
        
        <div className="ml-auto">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>최신순</option>
            <option>마감임박순</option>
            <option>참여자순</option>
          </select>
        </div>
      </div>

      {/* 과제 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
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
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                {assignment.assignImage ? (
                  <img 
                    src={`data:image/jpeg;base64,${assignment.assignImage}`} 
                    alt={assignment.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <p className="text-blue-600 font-medium">과제</p>
                  </div>
                )}
              </div>

              {/* 콘텐츠 */}
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    과제
                  </span>
                  {assignment.endCheck && (
                    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      마감됨
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {assignment.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {assignment.content}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    시작: {formatDate(assignment.startAt)}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    마감: {formatDate(assignment.endAt)}
                    {isExpired(assignment.endAt) && (
                      <span className="ml-2 text-red-500 font-medium">(마감됨)</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    작성자: {assignment.adminName}
                  </div>
                </div>

                <button 
                  className={`w-full py-3 rounded-lg transition-colors duration-200 font-medium ${
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

      {/* 더보기 버튼 */}
      {assignments.length > 0 && (
        <div className="text-center mt-8">
          <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 font-medium">
            더 많은 과제 보기
          </button>
        </div>
      )}

      {/* 과제 상세보기 모달 */}
      <AssignmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        assignmentId={selectedAssignmentId}
      />
    </div>
  );
};

export default ContestList;