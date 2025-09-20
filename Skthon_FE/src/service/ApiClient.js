class ApiClient {
  static baseURL = 'https://skthonbe-production.up.railway.app';

  // 스트리밍 답변 요청
  static async streamAnswer(question, preContent = null) {
    const requestBody = {
      question: question,
      preContent: preContent
    };

    const response = await fetch(`${this.baseURL}/answer/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dummy-token' // 구색용 더미 토큰
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  }

  // 로그인 API
  static async login(email, password) {
    const requestBody = {
      email: email,
      password: password
    };

    const response = await fetch(`${this.baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 회원가입 API
  static async register(email, password, name) {
    const requestBody = {
      email: email,
      password: password,
      name: name
    };

    const response = await fetch(`${this.baseURL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 기업 등록 API
  static async registerCompany(category, name, logo) {
    const requestBody = {
      category: category,
      name: name,
      logo: logo // base64 인코딩된 문자열 또는 null
    };

    console.log("기업 등록 요청:", requestBody);

    const response = await fetch(`${this.baseURL}/register/company`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log("응답 상태:", response.status, response.statusText);
    console.log("응답 헤더:", response.headers);

    if (!response.ok) {
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } catch (parseError) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    // 응답 텍스트를 먼저 확인
    const responseText = await response.text();
    console.log("응답 텍스트:", responseText);

    if (!responseText || responseText.trim() === '') {
      // 빈 응답인 경우 성공으로 간주
      console.log("빈 응답, 기본 성공 응답 반환");
      return {
        message: "기업 등록이 완료되었습니다.",
        data: null
      };
    }

    try {
      const jsonData = JSON.parse(responseText);
      console.log("파싱된 JSON:", jsonData);
      return jsonData;
    } catch (parseError) {
      console.warn("JSON 파싱 실패:", parseError);
      // JSON 파싱 실패 시 성공으로 간주
      return {
        message: "기업 등록이 완료되었습니다.",
        data: null
      };
    }
  }

  // 테스트 API
  static async test() {
    const response = await fetch(`${this.baseURL}/test`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
  }
}

export default ApiClient;
