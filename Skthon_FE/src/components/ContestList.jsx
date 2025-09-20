import React from 'react';

const ContestList = () => {
  // 샘플 공모전 데이터
  const contests = [
    {
      id: 1,
      title: "2024 창업 아이디어 공모전",
      organization: "한국창업진흥원",
      deadline: "2024-03-15",
      prize: "총 상금 1억원",
      category: "창업",
      participants: 1250,
      image: "https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=창업+공모전"
    },
    {
      id: 2,
      title: "디지털 혁신 아이디어 공모전",
      organization: "과학기술정보통신부",
      deadline: "2024-03-20",
      prize: "총 상금 5천만원",
      category: "기술",
      participants: 890,
      image: "https://via.placeholder.com/300x200/1E40AF/FFFFFF?text=디지털+혁신"
    },
    {
      id: 3,
      title: "청년 사회혁신 프로젝트",
      organization: "청년정책부",
      deadline: "2024-03-25",
      prize: "총 상금 3천만원",
      category: "사회",
      participants: 650,
      image: "https://via.placeholder.com/300x200/2563EB/FFFFFF?text=사회혁신"
    },
    {
      id: 4,
      title: "환경보호 캠페인 공모전",
      organization: "환경부",
      deadline: "2024-03-30",
      prize: "총 상금 2천만원",
      category: "환경",
      participants: 420,
      image: "https://via.placeholder.com/300x200/1D4ED8/FFFFFF?text=환경보호"
    },
    {
      id: 5,
      title: "문화콘텐츠 창작 공모전",
      organization: "문화체육관광부",
      deadline: "2024-04-05",
      prize: "총 상금 4천만원",
      category: "문화",
      participants: 780,
      image: "https://via.placeholder.com/300x200/1E3A8A/FFFFFF?text=문화콘텐츠"
    },
    {
      id: 6,
      title: "스마트시티 솔루션 공모전",
      organization: "국토교통부",
      deadline: "2024-04-10",
      prize: "총 상금 6천만원",
      category: "도시",
      participants: 950,
      image: "https://via.placeholder.com/300x200/1E40AF/FFFFFF?text=스마트시티"
    }
  ];

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
          인기 공모전
        </h2>
        <p className="text-gray-600">
          다양한 분야의 공모전을 확인하고 참여해보세요
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

      {/* 공모전 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contests.map((contest) => (
          <div key={contest.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100">
            {/* 이미지 */}
            <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {contest.category.charAt(0)}
                  </span>
                </div>
                <p className="text-blue-600 font-medium">{contest.category}</p>
              </div>
            </div>

            {/* 콘텐츠 */}
            <div className="p-6">
              <div className="mb-3">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(contest.category)}`}>
                  {contest.category}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {contest.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                {contest.organization}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  마감: {contest.deadline}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  {contest.prize}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  참여자 {contest.participants.toLocaleString()}명
                </div>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                자세히 보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 더보기 버튼 */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200 font-medium">
          더 많은 공모전 보기
        </button>
      </div>
    </div>
  );
};

export default ContestList;