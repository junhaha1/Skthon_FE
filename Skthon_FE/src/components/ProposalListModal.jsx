import React, { useState, useEffect } from 'react';
import ApiClient from '../service/ApiClient';
import ProposalDetailModal from './ProposalDetailModal';

const ProposalListModal = ({ isOpen, onClose, assignmentId, assignmentTitle }) => {
  const [proposals, setProposals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 제안서 목록 조회
  const fetchProposals = async () => {
    if (!assignmentId) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await ApiClient.getProposalsByAssignId(assignmentId);
      console.log('제안서 목록 응답:', response);
      setProposals(response.data || []);
    } catch (error) {
      console.error('제안서 목록 조회 실패:', error);
      setError('제안서 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 모달이 열릴 때 제안서 목록 조회
  useEffect(() => {
    if (isOpen && assignmentId) {
      fetchProposals();
    }
  }, [isOpen, assignmentId]);

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setProposals([]);
      setError('');
      setSelectedProposal(null);
      setIsDetailModalOpen(false);
    }
  }, [isOpen]);

  // 제안서 상세보기 모달 열기
  const handleViewProposalDetail = (proposal) => {
    setSelectedProposal(proposal);
    setIsDetailModalOpen(true);
  };

  // 제안서 상세보기 모달 닫기
  const handleCloseDetailModal = () => {
    setSelectedProposal(null);
    setIsDetailModalOpen(false);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">제안서 목록</h2>
            <p className="text-gray-600 mt-1">{assignmentTitle}</p>
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-gray-600">제안서 목록을 불러오는 중...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">제안서를 불러올 수 없습니다</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={fetchProposals}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">제출된 제안서가 없습니다</h3>
              <p className="text-gray-600">아직 이 공고에 제출된 제안서가 없습니다.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {proposals.map((proposal) => (
                <div 
                  key={proposal.id} 
                  onClick={() => handleViewProposalDetail(proposal)}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {proposal.title}
                      </h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <p className="font-medium">{proposal.userName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(proposal.updateAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSelectedStatusStyle(proposal.selected)}`}>
                      {getSelectedStatusText(proposal.selected)}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm line-clamp-3 leading-relaxed">
                      {proposal.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      클릭하여 상세보기
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
          >
            닫기
          </button>
        </div>
      </div>

      {/* 제안서 상세보기 모달 */}
      <ProposalDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        proposal={selectedProposal}
        onUpdate={fetchProposals}
      />
    </div>
  );
};

export default ProposalListModal;
