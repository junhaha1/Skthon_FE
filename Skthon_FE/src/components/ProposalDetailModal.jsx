import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../service/ApiClient';

const ProposalDetailModal = ({ isOpen, onClose, proposal, onUpdate }) => {
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // 'accept' 또는 'reject'
  
  if (!isOpen || !proposal) return null;


  // 채택 상태 텍스트 (다양한 형태 지원)
  const getSelectedStatusText = (selected) => {
    if (selected === null || selected === undefined || selected === '' || selected === 'PENDING') {
      return '진행중';
    }
    if (selected === true || selected === 'true' || selected === 'SELECTED') {
      return '채택';
    }
    if (selected === false || selected === 'false' || selected === 'REJECTED') {
      return '거절';
    }
    return '진행중';
  };

  // 채택 상태 스타일 (다양한 형태 지원)
  const getSelectedStatusStyle = (selected) => {
    if (selected === null || selected === undefined || selected === '' || selected === 'PENDING') {
      return 'bg-yellow-100 text-yellow-800';
    }
    if (selected === true || selected === 'true' || selected === 'SELECTED') {
      return 'bg-green-100 text-green-800';
    }
    if (selected === false || selected === 'false' || selected === 'REJECTED') {
      return 'bg-red-100 text-red-800';
    }
    return 'bg-yellow-100 text-yellow-800';
  };

  // 채택 확인 모달 열기
  const handleAcceptClick = () => {
    setConfirmAction('accept');
    setShowConfirmModal(true);
  };

  // 거절 확인 모달 열기
  const handleRejectClick = () => {
    setConfirmAction('reject');
    setShowConfirmModal(true);
  };

  // 확인 모달 닫기
  const handleCancelConfirm = () => {
    setShowConfirmModal(false);
    setConfirmAction(null);
  };

  // 실제 채택/거절 처리
  const handleConfirmAction = async () => {
    if (!proposal.id || !confirmAction) return;
    
    setIsUpdating(true);
    setShowConfirmModal(false);
    
    try {
      const isAccept = confirmAction === 'accept';
      const response = await ApiClient.updateProposalSelected(proposal.id, isAccept);
      console.log(`제안서 ${isAccept ? '채택' : '거절'} 응답:`, response);
      
      alert(`제안서를 ${isAccept ? '채택' : '거절'}했습니다!`);
      onUpdate && onUpdate();
      onClose();
    } catch (error) {
      console.error(`제안서 ${confirmAction === 'accept' ? '채택' : '거절'} 실패:`, error);
      alert(`제안서 ${confirmAction === 'accept' ? '채택' : '거절'}에 실패했습니다. 다시 시도해주세요.`);
    } finally {
      setIsUpdating(false);
      setConfirmAction(null);
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
          {/* 기업 사용자에게만 채택/거절 버튼 표시 (진행중 상태일 때만) */}
          {(() => {
            // 제안서가 진행중 상태인지 확인 (null, undefined, 'PENDING' 등)
            const isPending = proposal.selected === null || 
                             proposal.selected === undefined || 
                             proposal.selected === 'PENDING' ||
                             proposal.selected === '';
            
            console.log('ProposalDetailModal 디버그:', {
              userType: user?.userType,
              isCompany: user?.userType === 'company',
              proposalSelected: proposal.selected,
              isPending: isPending,
              shouldShowButtons: user?.userType === 'company' && isPending
            });
            
            return user?.userType === 'company' && isPending;
          })() && (
            <>
              <button 
                onClick={handleRejectClick}
                disabled={isUpdating}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  isUpdating
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {isUpdating ? '처리 중...' : '거절'}
              </button>
              <button 
                onClick={handleAcceptClick}
                disabled={isUpdating}
                className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium ${
                  isUpdating
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isUpdating ? '처리 중...' : '채택'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* 확인 모달 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {confirmAction === 'accept' ? '제안서를 채택하시겠습니까?' : '제안서를 거절하시겠습니까?'}
              </h3>
              <p className="text-gray-600 mb-6">
                {confirmAction === 'accept' 
                  ? '이 제안서를 채택하면 지원자에게 알림이 전송됩니다.' 
                  : '이 제안서를 거절하면 지원자에게 알림이 전송됩니다.'
                }
              </p>
              <div className="flex justify-center space-x-3">
                <button
                  onClick={handleCancelConfirm}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmAction}
                  className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium ${
                    confirmAction === 'accept'
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {confirmAction === 'accept' ? '채택' : '거절'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalDetailModal;