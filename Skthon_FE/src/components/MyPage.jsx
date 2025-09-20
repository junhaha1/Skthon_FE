import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const MyPage = () => {
  const { user } = useAuth();

  // 샘플 데이터
  const [profileData, setProfileData] = useState({
    name: user?.name || '홍길동',
    email: user?.email || 'hong@example.com',
    phone: '010-1234-5678',
    university: '서울대학교',
    major: '컴퓨터공학과',
    grade: '4학년',
    studentId: '2021001234',
    introduction: '안녕하세요! 열정적인 개발자 홍길동입니다. 다양한 프로젝트 경험을 통해 성장하고 있습니다.',
    skills: ['React', 'JavaScript', 'Python', 'Node.js', 'MongoDB'],
    github: 'https://github.com/honggildong',
    blog: 'https://honggildong.tistory.com'
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

  const handleEditProfile = () => {
    // 프로필 편집 로직
    console.log('프로필 편집');
  };

  const handleAddResume = () => {
    // 이력서 추가 로직
    console.log('이력서 추가');
  };

  const handleAddPortfolio = () => {
    // 포트폴리오 추가 로직
    console.log('포트폴리오 추가');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to="/" 
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                홈으로
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">마이페이지</h1>
                <p className="text-gray-600 mt-1">개인 정보와 포트폴리오를 관리하세요</p>
              </div>
            </div>
            <button
              onClick={handleEditProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              프로필 편집
            </button>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm text-gray-600">{profileData.university}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      <span className="text-sm text-gray-600">{profileData.major} {profileData.grade}</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm text-gray-600">{profileData.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 자기소개 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">자기소개</h3>
                <p className="text-gray-700 leading-relaxed">{profileData.introduction}</p>
              </div>

              {/* 기술 스택 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기술 스택</h3>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* 링크 */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">링크</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    <a href={profileData.github} className="text-blue-600 hover:text-blue-800">
                      GitHub
                    </a>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    <a href={profileData.blog} className="text-blue-600 hover:text-blue-800">
                      블로그
                    </a>
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

        {/* 포트폴리오 관리 섹션 */}
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
      </div>
    </div>
  );
};

export default MyPage;
