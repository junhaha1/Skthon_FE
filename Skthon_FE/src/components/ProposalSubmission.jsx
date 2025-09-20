import React, { useState } from 'react';
import { useAssignment } from '../contexts/AssignmentContext';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../service/ApiClient';
import ConfirmModal from './ConfirmModal';

const ProposalSubmission = ({ onBack, summaryContent = '' }) => {
  const { getActiveTab } = useAssignment();
  const { user } = useAuth();
  const activeTab = getActiveTab();
  const currentAssignment = activeTab?.assignment;

  const [proposalData, setProposalData] = useState({
    title: '',
    content: summaryContent,
    isEditing: true
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleTitleChange = (e) => {
    setProposalData(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  const handleContentChange = (e) => {
    setProposalData(prev => ({
      ...prev,
      content: e.target.value
    }));
  };

  const handleSubmit = () => {
    if (!proposalData.title.trim() || !proposalData.content.trim()) {
      alert('제안서 제목과 내용을 모두 입력해주세요.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setShowConfirmModal(false);
    
    try {
      // 사용자 로그인 확인
      if (!user?.id) {
        throw new Error('로그인이 필요합니다.');
      }

      // 공모전 정보 확인
      if (!currentAssignment?.id) {
        throw new Error('공모전 정보를 찾을 수 없습니다.');
      }

      // API 요청 데이터 구성
      const requestData = {
        userId: user.id, // 현재 로그인한 사용자 ID
        assignId: currentAssignment.id, // 공모전 과제 ID
        title: proposalData.title,
        content: proposalData.content,
        selected: "PENDING" // 기본값으로 PENDING 설정
      };

      console.log('제안서 제출 요청:', requestData);
      
      // API 호출
      const response = await ApiClient.submitProposal(requestData);
      console.log('제안서 제출 응답:', response);
      
      alert('제안서가 성공적으로 제출되었습니다!');
      setIsSubmitted(true);
      setIsEditing(false);
    } catch (error) {
      console.error('제안서 제출 실패:', error);
      alert(`제안서 제출에 실패했습니다: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = () => {
    if (isSubmitted) {
      alert('이미 제출된 제안서는 수정할 수 없습니다.');
      return;
    }
    setIsEditing(true);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-green-50 to-emerald-100 overflow-hidden">
      {/* 헤더 */}
      <div className="bg-white border-b border-green-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center text-gray-600 hover:text-green-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                채팅으로 돌아가기
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">
                {isSubmitted ? '제안서 제출 완료' : '제안서 제출'}
              </h1>
              <p className="text-gray-600 text-sm">
                {isSubmitted ? '제안서가 성공적으로 제출되었습니다' : '공모전에 제안서를 제출하세요'}
              </p>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </div>

      {/* 공모전 정보 */}
      {currentAssignment && (
        <div className="bg-white border-b border-green-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xs">📋</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-800 truncate">
                  {currentAssignment.title}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  ID: {currentAssignment.id} | 관리자: {currentAssignment.adminName}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 제안서 작성 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* 제안서 제목 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제안서 제목
            </label>
            {isEditing ? (
              <input
                type="text"
                value={proposalData.title}
                onChange={handleTitleChange}
                placeholder="제안서 제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm"
              />
            ) : (
              <p className="text-gray-900 font-medium">{proposalData.title}</p>
            )}
          </div>

          {/* 제안서 내용 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제안서 내용
            </label>
            {isEditing ? (
              <textarea
                value={proposalData.content}
                onChange={handleContentChange}
                placeholder="제안서 내용을 입력하세요"
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 text-sm resize-none"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-3 max-h-80 overflow-y-auto">
                <p className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed">
                  {proposalData.content}
                </p>
              </div>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex justify-end gap-3">
            {isEditing && !isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !proposalData.title.trim() || !proposalData.content.trim()}
                className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                  isSubmitting || !proposalData.title.trim() || !proposalData.content.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    <span>제출 중...</span>
                  </div>
                ) : (
                  '제안서 제출'
                )}
              </button>
            ) : !isSubmitted ? (
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm shadow-sm hover:shadow-md"
              >
                수정하기
              </button>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm font-medium">제출 완료</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 최종 제출 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        title="최종 제출 확인"
        message={`제안서를 최종 제출하시겠습니까?\n\n제출 후에는 수정할 수 없습니다.`}
        confirmText="최종 제출"
        cancelText="취소"
      />
    </div>
  );
};

export default ProposalSubmission;
