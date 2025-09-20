import React, { useState, useEffect } from 'react';

const WelcomeScreen = ({ onTransitionComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // 3초 후에 페이드아웃 시작
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 3000);

    // 페이드아웃 완료 후 컴포넌트 숨김
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      onTransitionComplete();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, [onTransitionComplete]);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white transition-opacity duration-1000 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-blue-600 mb-4 animate-pulse">
            환영합니다
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full animate-pulse"></div>
        </div>
        
        <div className="space-y-4">
          <p className="text-xl text-gray-600 animate-fade-in">
            공모전 정보를 한눈에
          </p>
          <p className="text-lg text-gray-500 animate-fade-in-delay">
            다양한 기회를 발견하세요
          </p>
        </div>

        {/* 로딩 애니메이션 */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;