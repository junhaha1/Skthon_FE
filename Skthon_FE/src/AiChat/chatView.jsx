import React, { useState, useRef, useEffect } from 'react';
import ApiClient from '../service/ApiClient';
import SummaryModal from '../components/SummaryModal';

function ChatView() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: '안녕하세요! 무엇을 도와드릴까요?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [summaryContent, setSummaryContent] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 메시지 추가 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 스트리밍 메시지 전송
  const sendMessage = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const currentInput = input;
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);

    // 사용자 메시지 추가
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // AI 응답 메시지 초기화
    const aiMessage = { role: 'ai', content: '' };
    setMessages(prev => [...prev, aiMessage]);

    try {
      const preContent =
        messages.length > 1
          ? messages.slice(0, -1).map(msg => `${msg.role}: ${msg.content}`).join('\n')
          : null;

      const response = await ApiClient.streamAnswer(currentInput, preContent);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6).trim();

            if (data === '[DONE]') {
              setIsStreaming(false);
              setIsLoading(false);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;

              if (content) {
                // ✅ 글자 단위로 느리게 추가
                for (let i = 0; i < content.length; i++) {
                  const char = content[i];
                  await new Promise(res => setTimeout(res, 10)); // 50ms 딜레이 (원하는 속도 조절)

                  setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    if (newMessages[lastIndex].role === 'ai') {
                      newMessages[lastIndex] = {
                        ...newMessages[lastIndex],
                        content: newMessages[lastIndex].content + char,
                      };
                    }
                    return newMessages;
                  });
                }
              }
            } catch (e) {
              console.error('JSON 파싱 오류:', e, '데이터:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('API 호출 오류:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'ai') {
          lastMessage.content = '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.';
        }
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 대화 내용을 요약하여 제안서 생성
  const generateSummary = async () => {
    if (messages.length <= 1) {
      alert('대화 내용이 충분하지 않습니다. 먼저 AI와 대화를 나눠보세요.');
      return;
    }

    setIsSummaryLoading(true);
    setIsSummaryModalOpen(true);

    try {
      console.log(messages);
      // 모든 대화 내용을 텍스트로 변환
      const totalContent = messages
        .map(msg => `${msg.role === 'user' ? '사용자' : 'AI'}: ${msg.content}`)
        .join('');
      console.log(totalContent);
      // API 호출 (assignmentId는 2로 고정)
      const summary = await ApiClient.summaryChat(2, totalContent);
      console.log(summary);
      setSummaryContent(summary);
    } catch (error) {
      console.error('요약 생성 실패:', error);
      setSummaryContent('요약 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSummaryLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-indigo-100">

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} items-end gap-4`}
          >
            {message.role === 'ai' && (
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
            )}
            <div
              className={`max-w-2xl lg:max-w-4xl px-6 py-4 rounded-2xl shadow-lg relative ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-br-md'
                  : 'bg-white text-gray-800 rounded-bl-md border border-blue-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <p className="whitespace-pre-wrap leading-relaxed flex-1 text-lg">{message.content}</p>
                {message.role === 'ai' && isStreaming && messages.length - 1 === index && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 flex-shrink-0"></div>
                )}
              </div>
            </div>
            {message.role === 'user' && (
              <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">U</span>
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 입력 영역 */}
      <div className="bg-white shadow-lg p-8 border-t border-blue-200">
        <div className="max-w-6xl mx-auto">
          {/* 제안서 만들기 버튼 */}
          <div className="mb-4 flex justify-center">
            <button
              onClick={generateSummary}
              disabled={messages.length <= 1 || isSummaryLoading}
              className={`px-6 py-3 rounded-xl transition-all duration-200 shadow-md font-medium ${
                messages.length <= 1 || isSummaryLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isSummaryLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>생성 중...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>제안서 만들기</span>
                </div>
              )}
            </button>
          </div>

          {/* 입력 필드와 전송 버튼 */}
          <div className="flex gap-6 items-end">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="w-full bg-gray-50 text-gray-800 px-6 py-4 rounded-2xl border border-blue-200 focus:outline-none focus:border-blue-500 focus:bg-white transition-colors shadow-sm text-lg"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={isLoading || input.trim() === ''}
              className={`px-8 py-4 rounded-2xl transition-all duration-200 shadow-md text-lg ${
                isLoading || input.trim() === ''
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="font-medium">전송 중...</span>
                </div>
              ) : (
                <span className="font-medium">전송</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 요약 모달 */}
      <SummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        summaryContent={summaryContent}
        isLoading={isSummaryLoading}
      />
    </div>
  );
}

export default ChatView;
