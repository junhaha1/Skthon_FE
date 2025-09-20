import React, { createContext, useContext, useState, useEffect } from 'react';

const AssignmentContext = createContext();

export const useAssignment = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignment must be used within an AssignmentProvider');
  }
  return context;
};

export const AssignmentProvider = ({ children }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [chatbotTabs, setChatbotTabs] = useState([]);
  const [activeTabId, setActiveTabId] = useState(null);

  useEffect(() => {
    // localStorage에서 챗봇 탭 정보 로드
    const savedTabs = localStorage.getItem('chatbotTabs');
    const savedActiveTab = localStorage.getItem('activeTabId');
    
    if (savedTabs) {
      try {
        const parsedTabs = JSON.parse(savedTabs);
        setChatbotTabs(parsedTabs);
        
        // 저장된 탭이 있으면 활성 탭 설정
        if (savedActiveTab && parsedTabs.some(tab => tab.id === savedActiveTab)) {
          setActiveTabId(savedActiveTab);
        } else if (parsedTabs.length > 0) {
          // 저장된 활성 탭이 유효하지 않으면 첫 번째 탭을 활성화
          setActiveTabId(parsedTabs[0].id);
          saveActiveTabToStorage(parsedTabs[0].id);
        } else {
          // 저장된 탭이 비어있으면 탭 없음 상태
          setActiveTabId(null);
          localStorage.removeItem('activeTabId');
        }
      } catch (error) {
        console.error('챗봇 탭 정보 파싱 오류:', error);
        localStorage.removeItem('chatbotTabs');
        localStorage.removeItem('activeTabId');
        setChatbotTabs([]);
        setActiveTabId(null);
      }
    } else {
      // 저장된 탭이 없으면 탭 없음 상태
      setChatbotTabs([]);
      setActiveTabId(null);
    }
  }, []);

  // 챗봇 탭 저장
  const saveTabsToStorage = (tabs) => {
    localStorage.setItem('chatbotTabs', JSON.stringify(tabs));
  };

  // 활성 탭 저장
  const saveActiveTabToStorage = (tabId) => {
    localStorage.setItem('activeTabId', tabId);
  };

  // 과제 선택
  const selectAssignment = (assignment) => {
    setSelectedAssignment(assignment);
  };

  // 특정 공고의 탭이 이미 존재하는지 확인
  const findExistingTab = (assignmentId) => {
    return chatbotTabs.find(tab => tab.assignmentId === assignmentId);
  };

  // 챗봇 탭 생성 또는 기존 탭으로 이동
  const createChatbotTab = (assignment) => {
    // 이미 해당 공고의 탭이 있는지 확인
    const existingTab = findExistingTab(assignment.id);
    
    if (existingTab) {
      // 기존 탭이 있으면 해당 탭으로 이동
      setActiveTabId(existingTab.id);
      saveActiveTabToStorage(existingTab.id);
      return existingTab.id;
    }

    // 새로운 탭 생성
    const newTab = {
      id: `tab_${assignment.id}_${Date.now()}`,
      assignmentId: assignment.id,
      assignmentTitle: assignment.title,
      assignment: assignment, // assignment 전체 정보 저장
      createdAt: new Date().toISOString(),
      messages: [
        { role: 'ai', content: `안녕하세요! "${assignment.title}" 과제에 대해 무엇이든 물어보세요!` }
      ]
    };

    const updatedTabs = [...chatbotTabs, newTab];
    setChatbotTabs(updatedTabs);
    setActiveTabId(newTab.id);
    saveTabsToStorage(updatedTabs);
    saveActiveTabToStorage(newTab.id);
    
    return newTab.id;
  };


  // 챗봇 탭 닫기
  const closeChatbotTab = (tabId) => {
    const updatedTabs = chatbotTabs.filter(tab => tab.id !== tabId);
    setChatbotTabs(updatedTabs);
    saveTabsToStorage(updatedTabs);

    // 닫힌 탭이 활성 탭이었다면 다른 탭으로 전환
    if (activeTabId === tabId) {
      if (updatedTabs.length > 0) {
        setActiveTabId(updatedTabs[0].id);
        saveActiveTabToStorage(updatedTabs[0].id);
      } else {
        setActiveTabId(null);
        localStorage.removeItem('activeTabId');
      }
    }
  };

  // 활성 탭 변경
  const setActiveTab = (tabId) => {
    setActiveTabId(tabId);
    saveActiveTabToStorage(tabId);
  };

  // 탭의 메시지 업데이트
  const updateTabMessages = (tabId, messages) => {
    const updatedTabs = chatbotTabs.map(tab => 
      tab.id === tabId ? { ...tab, messages } : tab
    );
    setChatbotTabs(updatedTabs);
    saveTabsToStorage(updatedTabs);
  };

  // 활성 탭 정보 가져오기
  const getActiveTab = () => {
    return chatbotTabs.find(tab => tab.id === activeTabId);
  };

  const value = {
    selectedAssignment,
    chatbotTabs,
    activeTabId,
    selectAssignment,
    createChatbotTab,
    closeChatbotTab,
    setActiveTab,
    updateTabMessages,
    getActiveTab,
    findExistingTab
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};
