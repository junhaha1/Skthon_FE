import React, { useState, useEffect } from 'react';
import Header from './Header';
import ContestList from './ContestList';
import ChatbotButton from './ChatbotButton';
import AssignmentDetailModal from './AssignmentDetailModal';
import ProposalListModal from './ProposalListModal';
import AssignmentRegistrationModal from './AssignmentRegistrationModal';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../service/ApiClient';

const MainCommunity = () => {
  const { isAuthenticated, isCompany, user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-assignments'); // 'my-assignments' 또는 'all-assignments'
  const [myAssignments, setMyAssignments] = useState([]);
  const [isLoadingMyAssignments, setIsLoadingMyAssignments] = useState(false);
  const [myAssignmentsError, setMyAssignmentsError] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProposalAssignmentId, setSelectedProposalAssignmentId] = useState(null);
  const [selectedProposalAssignmentTitle, setSelectedProposalAssignmentTitle] = useState('');
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // 기업 사용자의 공고 목록 조회
  const fetchMyAssignments = async () => {
    if (!user?.id) return;
    
    setIsLoadingMyAssignments(true);
    setMyAssignmentsError('');
    
    try {
      const response = await ApiClient.getAssignmentsByAdminId(user.id);
      console.log('내 공고 목록 응답:', response);
      
      setMyAssignments(response.data || []);
    } catch (error) {
      console.error('내 공고 목록 조회 실패:', error);
      setMyAssignmentsError('공고 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingMyAssignments(false);
    }
  };

  // 기업 사용자인 경우 내 공고 목록 조회
  useEffect(() => {
    if (isCompany() && user?.id) {
      fetchMyAssignments();
    }
  }, [isCompany, user?.id]);

  // 공고 상세보기 모달 열기
  const handleViewAssignmentDetail = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsDetailModalOpen(true);
  };

  // 공고 상세보기 모달 닫기
  const handleCloseDetailModal = () => {
    setSelectedAssignmentId(null);
    setIsDetailModalOpen(false);
  };

  // 제안서 열람 모달 열기
  const handleViewProposals = (assignmentId, assignmentTitle) => {
    setSelectedProposalAssignmentId(assignmentId);
    setSelectedProposalAssignmentTitle(assignmentTitle);
    setIsProposalModalOpen(true);
  };

  // 제안서 모달 닫기
  const handleCloseProposalModal = () => {
    setSelectedProposalAssignmentId(null);
    setSelectedProposalAssignmentTitle('');
    setIsProposalModalOpen(false);
  };

  // 공고 등록 모달 열기
  const handleOpenRegistrationModal = () => {
    setIsRegistrationModalOpen(true);
  };

  // 공고 등록 모달 닫기
  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  // 공고 등록 성공 시 처리
  const handleRegistrationSuccess = () => {
    // 내 공고 목록 새로고침
    fetchMyAssignments();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        {isCompany() ? (
          // 기업 사용자용 탭 구조
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 탭 헤더 */}
            <div className="mb-8">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('my-assignments')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'my-assignments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    내 공고
                  </button>
                  <button
                    onClick={() => setActiveTab('all-assignments')}
                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === 'all-assignments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    전체 공고
                  </button>
                </nav>
              </div>
            </div>

            {/* 탭 컨텐츠 */}
            {activeTab === 'my-assignments' ? (
              // 내 공고 탭
                    <div>
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">내가 올린 공고</h2>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleOpenRegistrationModal}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            공고 등록
                          </button>
                          <button
                            onClick={fetchMyAssignments}
                            disabled={isLoadingMyAssignments}
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
                          >
                            {isLoadingMyAssignments ? '새로고침 중...' : '새로고침'}
                          </button>
                        </div>
                      </div>

                {isLoadingMyAssignments ? (
                  <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                        <p className="text-gray-600">공고 목록을 불러오는 중...</p>
                      </div>
                    </div>
                  </div>
                ) : myAssignmentsError ? (
                  <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                    <div className="text-center py-12">
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">공고를 불러올 수 없습니다</h3>
                      <p className="text-gray-600 mb-4">{myAssignmentsError}</p>
                      <button 
                        onClick={fetchMyAssignments}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        다시 시도
                      </button>
                    </div>
                  </div>
                ) : myAssignments.length === 0 ? (
                  <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                    <div className="text-center py-12">
                      <div className="mb-4">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">올린 공고가 없습니다</h3>
                      <p className="text-gray-600">새로운 공고를 올려보세요!</p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                    {/* 과제 그리드 - 가로 4개 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                      {myAssignments.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {assignment.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {assignment.adminName}
                              </p>
                              <p className="text-xs text-gray-500">
                                마감일: {new Date(assignment.endAt).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              new Date(assignment.endAt) < new Date() 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {new Date(assignment.endAt) < new Date() ? '마감' : '진행중'}
                            </span>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-gray-700 text-sm line-clamp-3">
                              {assignment.content}
                            </p>
                          </div>
                          
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewAssignmentDetail(assignment.id)}
                              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                            >
                              공고 상세보기
                            </button>
                            <button 
                              onClick={() => handleViewProposals(assignment.id, assignment.title)}
                              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                            >
                              제안서 열람
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // 전체 공고 탭
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">전체 공고</h2>
                <ContestList isCompanyView={true} />
              </div>
            )}
          </div>
        ) : (
          // 개인 사용자용 기본 화면
          <ContestList />
        )}
      </main>
      
      {/* 개인 사용자에게만 챗봇 버튼 표시 */}
      {isAuthenticated() && !isCompany() && <ChatbotButton />}

      {/* 공고 상세보기 모달 */}
      <AssignmentDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        assignmentId={selectedAssignmentId}
      />

      {/* 제안서 목록 모달 */}
      <ProposalListModal
        isOpen={isProposalModalOpen}
        onClose={handleCloseProposalModal}
        assignmentId={selectedProposalAssignmentId}
        assignmentTitle={selectedProposalAssignmentTitle}
      />

      {/* 공고 등록 모달 */}
      <AssignmentRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistrationModal}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
};

export default MainCommunity;