import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../service/ApiClient';
import ProposalDetailModal from './ProposalDetailModal';

const MyPage = () => {
  const { user } = useAuth();

  // 사용자 정보
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [resumes, setResumes] = useState([
    {
      id: 1,
      title: '기본 이력서',
      updatedAt: '2024-01-15',
      isDefault: true
    },
    {
      id: 2,
      title: '개발자 이력서',
      updatedAt: '2024-01-10',
      isDefault: false
    }
  ]);

  const [portfolios, setPortfolios] = useState([
    {
      id: 1,
      title: '웹 쇼핑몰 프로젝트',
      description: 'React와 Node.js를 활용한 풀스택 웹 애플리케이션',
      techStack: ['React', 'Node.js', 'MongoDB'],
      githubUrl: 'https://github.com/honggildong/shopping-mall',
      demoUrl: 'https://shopping-mall-demo.com',
      imageUrl: '/api/placeholder/300/200',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      title: 'AI 챗봇 서비스',
      description: 'OpenAI API를 활용한 지능형 챗봇 서비스',
      techStack: ['Python', 'FastAPI', 'OpenAI API'],
      githubUrl: 'https://github.com/honggildong/ai-chatbot',
      demoUrl: 'https://ai-chatbot-demo.com',
      imageUrl: '/api/placeholder/300/200',
      createdAt: '2023-12-15'
    }
  ]);

  // 제안서 목록 상태
  const [proposals, setProposals] = useState([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);
  const [proposalsError, setProposalsError] = useState('');
  
  // 제안서 상세 모달 상태
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // 기업용 제안서 목록 상태 (기업 사용자가 받은 제안서들)
  const [companyProposals, setCompanyProposals] = useState([]);
  const [isLoadingCompanyProposals, setIsLoadingCompanyProposals] = useState(false);
  const [companyProposalsError, setCompanyProposalsError] = useState('');


  const handleAddResume = () => {
    // 이력서 추가 로직
    console.log('이력서 추가');
  };

  const handleAddPortfolio = () => {
    // 포트폴리오 추가 로직
    console.log('포트폴리오 추가');
  };

  // 제안서 목록 조회 (개인 사용자용)
  const fetchProposals = async () => {
    if (!user?.id) return;
    
    setIsLoadingProposals(true);
    setProposalsError('');
    
    try {
      const response = await ApiClient.getAllProposals();
      console.log('제안서 목록 응답:', response);
      
      // 현재 사용자의 제안서만 필터링
      const userProposals = response.data.filter(proposal => proposal.userId === user.id);
      setProposals(userProposals);
    } catch (error) {
      console.error('제안서 목록 조회 실패:', error);
      setProposalsError('제안서 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingProposals(false);
    }
  };

  // 기업용 제안서 목록 조회 (기업 사용자가 받은 제안서들)
  const fetchCompanyProposals = async () => {
    if (!user?.id) return;
    
    setIsLoadingCompanyProposals(true);
    setCompanyProposalsError('');
    
    try {
      const response = await ApiClient.getProposalsByCompany(user.id);
      console.log('기업 제안서 목록 응답:', response);
      
      setCompanyProposals(response.data || []);
    } catch (error) {
      console.error('기업 제안서 목록 조회 실패:', error);
      setCompanyProposalsError('제안서 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingCompanyProposals(false);
    }
  };

  // 컴포넌트 마운트 시 제안서 목록 조회
  useEffect(() => {
    if (user?.userType === 'company') {
      fetchCompanyProposals();
    } else {
      fetchProposals();
    }
  }, [user?.id, user?.userType]);

  // 채택 상태에 따른 스타일 반환 (다양한 형태 지원)
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

  // 채택 상태 한글 변환 (다양한 형태 지원)
  const getSelectedStatusText = (selected) => {
    if (selected === null || selected === undefined || selected === '' || selected === 'PENDING') {
      return '진행중';
    }
    if (selected === true || selected === 'true' || selected === 'SELECTED') {
      return '채택됨';
    }
    if (selected === false || selected === 'false' || selected === 'REJECTED') {
      return '미채택';
    }
    return '진행중';
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              홈으로
            </Link>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.userType === 'company' ? '기업 관리 페이지' : '마이페이지'}
              </h1>
              <p className="text-gray-600 mt-1">
                {user?.userType === 'company' 
                  ? '기업 정보와 공고를 관리하세요' 
                  : '개인 정보와 포트폴리오를 관리하세요'
                }
              </p>
            </div>
            <div className="w-20"></div> {/* 공간 확보용 */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* 프로필 섹션 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* 프로필 카드 */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {profileData.name.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    {profileData.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{profileData.email}</p>
                  
                  <div className="space-y-3 text-left">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm text-gray-600">{profileData.name || '이름 없음'}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-600">{profileData.email || '이메일 없음'}</span>
                    </div>
                    {user?.userType === 'company' && user?.companyName && (
                      <div className="flex items-center">
                        <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm text-gray-600">{user.companyName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 기본 정보 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                    <p className="text-gray-900">{profileData.name || '이름 없음'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <p className="text-gray-900">{profileData.email || '이메일 없음'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        {/* 이력서 관리 섹션 */}
        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">이력서 관리</h2>
            <button
              onClick={handleAddResume}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              새 이력서 작성
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {resume.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      수정일: {resume.updatedAt}
                    </p>
                  </div>
                  {resume.isDefault && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      기본
                    </span>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                    보기
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                    편집
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 제안서 관리 섹션 */}
        <div className="space-y-6 mb-12">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.userType === 'company' ? '받은 제안서' : '내 제안서'}
            </h2>
            <button
              onClick={user?.userType === 'company' ? fetchCompanyProposals : fetchProposals}
              disabled={user?.userType === 'company' ? isLoadingCompanyProposals : isLoadingProposals}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm"
            >
              {user?.userType === 'company' 
                ? (isLoadingCompanyProposals ? '새로고침 중...' : '새로고침')
                : (isLoadingProposals ? '새로고침 중...' : '새로고침')
              }
            </button>
          </div>

          {user?.userType === 'company' ? (
            // 기업 사용자용 제안서 목록
            isLoadingCompanyProposals ? (
              <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600">제안서 목록을 불러오는 중...</p>
                  </div>
                </div>
              </div>
            ) : companyProposalsError ? (
              <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">제안서를 불러올 수 없습니다</h3>
                  <p className="text-gray-600 mb-4">{companyProposalsError}</p>
                  <button 
                    onClick={fetchCompanyProposals}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : companyProposals.length === 0 ? (
              <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">받은 제안서가 없습니다</h3>
                  <p className="text-gray-600">아직 공고에 제출된 제안서가 없습니다.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyProposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {proposal.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          공고: {proposal.assignTitle}
                        </p>
                        <p className="text-xs text-gray-500 mb-1">
                          제출자: {proposal.userName}
                        </p>
                        <p className="text-xs text-gray-500">
                          제출일: {new Date(proposal.updateAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSelectedStatusStyle(proposal.selected)}`}>
                        {getSelectedStatusText(proposal.selected)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {proposal.content}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProposalDetail(proposal)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // 개인 사용자용 제안서 목록
            isLoadingProposals ? (
              <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p className="text-gray-600">제안서 목록을 불러오는 중...</p>
                  </div>
                </div>
              </div>
            ) : proposalsError ? (
              <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">제안서를 불러올 수 없습니다</h3>
                  <p className="text-gray-600 mb-4">{proposalsError}</p>
                  <button 
                    onClick={fetchProposals}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            ) : proposals.length === 0 ? (
              <div className="w-full min-h-screen bg-gray-50 px-6 py-8">
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">제출한 제안서가 없습니다</h3>
                  <p className="text-gray-600">공모전에 제안서를 제출해보세요!</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                          {proposal.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          공고: {proposal.assignTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          제출일: {new Date(proposal.updateAt).toLocaleDateString('ko-KR')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSelectedStatusStyle(proposal.selected)}`}>
                        {getSelectedStatusText(proposal.selected)}
                      </span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-gray-700 text-sm line-clamp-3">
                        {proposal.content}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProposalDetail(proposal)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* 포트폴리오 관리 섹션 - 개인 사용자만 표시 */}
        {user?.userType !== 'company' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">포트폴리오 관리</h2>
              <button
                onClick={handleAddPortfolio}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                새 포트폴리오 추가
              </button>
            </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">프로젝트 이미지</span>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {portfolio.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {portfolio.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {portfolio.techStack.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                      보기
                    </button>
                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-medium">
                      편집
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        )}
      </div>

      {/* 제안서 상세 모달 */}
      <ProposalDetailModal
        proposal={selectedProposal}
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
};

export default MyPage;
