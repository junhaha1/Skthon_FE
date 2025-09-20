import React, { useState, useEffect } from 'react';
import ChatView from '../AiChat/chatView';
import { useAssignment } from '../contexts/AssignmentContext';

const ChatbotButton = () => {
  const { chatbotTabs, activeTabId, setActiveTab, closeChatbotTab } = useAssignment();
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

      // 전역 이벤트 리스너 추가
      useEffect(() => {
        const handleOpenChatbot = () => {
          setIsOpen(true);
        };

        const handleCloseChatbot = () => {
          setIsOpen(false);
        };

        window.addEventListener('openChatbot', handleOpenChatbot);
        window.addEventListener('closeChatbot', handleCloseChatbot);

        return () => {
          window.removeEventListener('openChatbot', handleOpenChatbot);
          window.removeEventListener('closeChatbot', handleCloseChatbot);
        };
      }, []);

  return (
    <>
      {/* 플로팅 챗봇 버튼 */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center group"
        >
          {isOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </button>
        
        {/* 툴팁 */}
        {!isOpen && (
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            AI 챗봇과 대화하기
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
          </div>
        )}
      </div>

      {/* 챗봇 모달 */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 오버레이 */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          
          {/* 챗봇 모달 컨텐츠 */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] mx-4 overflow-hidden flex flex-col">
            {/* 모달 헤더 */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AI</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold">AI 챗봇</h3>
                  <p className="text-blue-100 text-sm">무엇이든 물어보세요!</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-blue-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 탭 시스템 */}
            {chatbotTabs.length > 0 && activeTabId && (
              <div className="bg-gray-100 border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {chatbotTabs.map((tab) => (
                        <div
                          key={tab.id}
                          className={`flex items-center gap-2 px-3 py-2 border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                            activeTabId === tab.id
                              ? 'border-blue-600 bg-white text-blue-600'
                              : 'border-transparent text-gray-600 hover:text-gray-800'
                          }`}
                          onClick={() => setActiveTab(tab.id)}
                        >
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-32">
                              {tab.assignmentTitle}
                            </span>
                            {tab.assignment && (
                              <span className="text-xs text-gray-500 truncate max-w-32">
                                ID: {tab.assignment.id} | {tab.assignment.adminName}
                              </span>
                            )}
                          </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          closeChatbotTab(tab.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 챗봇 컨텐츠 */}
            <div className="flex-1 overflow-hidden">
              <ChatView />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
