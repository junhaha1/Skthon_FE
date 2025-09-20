import React, { useState } from 'react';
import ApiClient from '../service/ApiClient';
import CompanySelectionModal from './CompanySelectionModal';

const RegisterModal = ({ isOpen, onClose, onLoginClick }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    companyId: '',
    companyName: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [userType, setUserType] = useState('user'); // 'user' 또는 'company'
  const [showCompanyModal, setShowCompanyModal] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 사용자 타입 변경
  const handleUserTypeChange = (type) => {
    setUserType(type);
    // 기업 선택 시 기업 정보 초기화
    if (type === 'user') {
      setFormData(prev => ({
        ...prev,
        companyId: '',
        companyName: ''
      }));
    }
  };

  // 기업 선택 모달 열기
  const handleOpenCompanyModal = () => {
    setShowCompanyModal(true);
  };

  // 기업 선택
  const handleSelectCompany = (company) => {
    setFormData(prev => ({
      ...prev,
      companyId: company.id,
      companyName: company.name
    }));
    setShowCompanyModal(false);
  };

  const validateForm = () => {
    const newErrors = {};
    
    // 이메일 검증
    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }
    
    // 비밀번호 검증
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 6자 이상이어야 합니다';
    }
    
    // 비밀번호 확인 검증
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }
    
    // 이름 검증
    if (!formData.name) {
      newErrors.name = '이름을 입력해주세요';
    } else if (formData.name.length < 2) {
      newErrors.name = '이름은 2자 이상이어야 합니다';
    }

    // 기업 사용자인 경우 기업 선택 검증
    if (userType === 'company' && !formData.companyId) {
      newErrors.company = '소속 기업을 선택해주세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    
    if (validateForm()) {
      setIsLoading(true);
      try {
        let response;
        
        // 사용자 타입에 따라 다른 API 호출
        if (userType === 'company') {
          // 기업 회원가입
          const adminData = {
            email: formData.email,
            password: formData.password,
            name: formData.name,
            companyId: parseInt(formData.companyId)
          };
          
          console.log('기업 회원가입 요청 데이터:', adminData);
          response = await ApiClient.registerAdmin(adminData);
        } else {
          // 개인 회원가입
          response = await ApiClient.register(
            formData.email, 
            formData.password, 
            formData.name
          );
        }
        
        // 회원가입 성공 처리
        console.log('회원가입 성공:', response);
        setRegisterSuccess(true);
        
        // 2초 후 모달 닫기
        setTimeout(() => {
          onClose();
          setRegisterSuccess(false);
          // 폼 초기화
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            name: '',
            companyId: '',
            companyName: ''
          });
          setUserType('user');
          setShowCompanyModal(false);
        }, 2000);
        
      } catch (error) {
        console.error('회원가입 실패:', error);
        setRegisterError(error.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLoginClick = () => {
    onClose();
    onLoginClick();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      
      {/* 모달 컨텐츠 */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 max-h-[90vh] overflow-y-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 헤더 */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h2>
          <p className="text-gray-600">공모전 커뮤니티에 가입하세요</p>
        </div>

        {/* 성공 메시지 */}
        {registerSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
               <p className="text-sm text-green-600">
                 {userType === 'company' ? '기업 회원가입이 완료되었습니다!' : '회원가입이 완료되었습니다!'}
               </p>
            </div>
          </div>
        )}

        {/* 에러 메시지 */}
        {registerError && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{registerError}</p>
            </div>
          </div>
        )}

        {/* 사용자 타입 선택 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">회원 유형</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleUserTypeChange('user')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                userType === 'user'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">개인 회원</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleUserTypeChange('company')}
              className={`p-3 rounded-lg border-2 transition-colors duration-200 ${
                userType === 'company'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <svg className="w-6 h-6 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="text-sm font-medium">기업 회원</span>
              </div>
            </button>
          </div>
        </div>

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 이름 입력 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="이름을 입력하세요"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* 기업 선택 (기업 회원인 경우만) */}
          {userType === 'company' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                소속 기업
              </label>
              <button
                type="button"
                onClick={handleOpenCompanyModal}
                className={`w-full px-4 py-3 border rounded-lg text-left transition-colors ${
                  errors.company ? 'border-red-300' : 'border-gray-300'
                } ${formData.companyName ? 'bg-white' : 'bg-gray-50'}`}
              >
                {formData.companyName ? (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{formData.companyName}</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ) : (
                  <span className="text-gray-500">기업을 선택해주세요</span>
                )}
              </button>
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company}</p>
              )}
            </div>
          )}

          {/* 이메일 입력 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              이메일
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="이메일을 입력하세요"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="비밀번호를 입력하세요 (6자 이상)"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 확인 입력 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              비밀번호 확인
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="비밀번호를 다시 입력하세요"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={isLoading || registerSuccess}
            className={`w-full py-3 rounded-lg transition-colors duration-200 font-medium text-lg ${
              isLoading || registerSuccess
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                회원가입 중...
              </div>
            ) : registerSuccess ? (
              '회원가입 완료!'
            ) : (
              '회원가입'
            )}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button 
              onClick={handleLoginClick}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              로그인
            </button>
          </p>
        </div>

        {/* 약관 동의 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            회원가입 시{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              이용약관
            </a>
            {' '}및{' '}
            <a href="#" className="text-blue-600 hover:text-blue-500">
              개인정보처리방침
            </a>
            에 동의하는 것으로 간주됩니다.
          </p>
        </div>
      </div>

      {/* 기업 선택 모달 */}
      <CompanySelectionModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onSelectCompany={handleSelectCompany}
      />
    </div>
  );
};

export default RegisterModal;
