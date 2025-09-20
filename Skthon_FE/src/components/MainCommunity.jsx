import React from 'react';
import Header from './Header';
import ContestList from './ContestList';
import ChatbotButton from './ChatbotButton';
import { useAuth } from '../contexts/AuthContext';

const MainCommunity = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <ContestList />
      </main>
      
      {/* 로그인된 사용자에게만 챗봇 버튼 표시 */}
      {isAuthenticated() && <ChatbotButton />}
    </div>
  );
};

export default MainCommunity;