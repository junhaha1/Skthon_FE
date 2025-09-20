import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiClient from '../service/ApiClient';

const AssignmentRegistrationModal = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startAt: '',
    endAt: '',
    assignImage: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('제목을 입력해주세요.');
      return false;
    }
    if (!formData.content.trim()) {
      setError('내용을 입력해주세요.');
      return false;
    }
    if (!formData.startAt) {
      setError('시작일을 선택해주세요.');
      return false;
    }
    if (!formData.endAt) {
      setError('마감일을 선택해주세요.');
      return false;
    }
    if (new Date(formData.startAt) >= new Date(formData.endAt)) {
      setError('마감일은 시작일보다 늦어야 합니다.');
      return false;
    }
    return true;
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // 날짜를 ISO 8601 형식으로 변환
        const startAt = formData.startAt ? `${formData.startAt}T00:00:00` : '';
        const endAt = formData.endAt ? `${formData.endAt}T23:59:59` : '';

        const requestData = {
          adminId: user.id,
          title: formData.title,
          content: formData.content,
          startAt: startAt,
          endAt: endAt,
          endCheck: false, // 새로 등록하는 공고는 아직 종료되지 않음
          assignImage: formData.assignImage || null
        };

        console.log('공고 등록 요청 데이터:', requestData);
        
        const response = await ApiClient.createAssignment(requestData);
        console.log('공고 등록 응답:', response);
        
        alert('공고가 성공적으로 등록되었습니다!');
        onSuccess && onSuccess();
        handleClose();

      } catch (error) {
        console.error('공고 등록 실패:', error);
        setError(error.message || '공고 등록에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 모달 닫기 및 폼 초기화
  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      startAt: '',
      endAt: '',
      assignImage: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">공고 등록</h2>
            <p className="text-gray-600 mt-1">새로운 공모전 공고를 등록하세요</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                공고 제목 *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="공고 제목을 입력하세요"
                required
              />
            </div>

            {/* 내용 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                공고 내용 *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                placeholder="공고 내용을 상세히 입력하세요"
                required
              />
            </div>

            {/* 날짜 선택 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startAt" className="block text-sm font-medium text-gray-700 mb-2">
                  시작일 *
                </label>
                <input
                  type="date"
                  id="startAt"
                  name="startAt"
                  value={formData.startAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
              <div>
                <label htmlFor="endAt" className="block text-sm font-medium text-gray-700 mb-2">
                  마감일 *
                </label>
                <input
                  type="date"
                  id="endAt"
                  name="endAt"
                  value={formData.endAt}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  required
                />
              </div>
            </div>

            {/* 이미지 URL (선택사항) */}
            <div>
              <label htmlFor="assignImage" className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL (선택사항)
              </label>
              <input
                type="url"
                id="assignImage"
                name="assignImage"
                value={formData.assignImage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg transition-colors duration-200 font-medium ${
                isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? '등록 중...' : '공고 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentRegistrationModal;
