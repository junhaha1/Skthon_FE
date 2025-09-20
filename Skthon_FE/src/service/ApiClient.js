class ApiClient {
  static baseURL = 'https://skthonbe-production.up.railway.app';

  // 스트리밍 답변 요청
  static async streamAnswer(question, preContent = null, assignmentContent = null) {
    const requestBody = {
      question: question,
      preContent: preContent,
      assignmentContent: assignmentContent
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

  // 과제 전체 조회 API
  static async getAllAssignments() {
    const response = await fetch(`${this.baseURL}/assignments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 과제 단건 조회 API
  static async getAssignmentById(id) {
    const response = await fetch(`${this.baseURL}/assignments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 대화 내용 요약 API
static async summaryChat(assignmentId, totalContent) {
  const requestBody = {
    assignmentId: assignmentId,
    totalContent: totalContent
  };

  const response = await fetch(`${this.baseURL}/answer/summaryChat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer dummy-token' // ✅ 아무 값이나 추가
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    // 서버 응답이 text/plain 이라면 json() 쓰면 터집니다 → text()로 바꿔야 안전
    const errorText = await response.text();
    throw new Error(errorText || `HTTP error! status: ${response.status}`);
  }

  return response.text(); // 응답은 텍스트
}


  // 제안서 전체 조회 API
  static async getAllProposals() {
    const response = await fetch(`${this.baseURL}/proposals`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 제안서 제출 여부 확인 API
  static async checkProposal(userId, assignId) {
    const response = await fetch(`${this.baseURL}/proposals/check?userId=${userId}&assignId=${assignId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message;
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("제안서 제출 여부 확인 결과:", result);
    return result.data;  // true or false 만 넘겨줌
  }

  // 제안서 제출 API
  static async submitProposal(proposalData) {
    const response = await fetch(`${this.baseURL}/proposals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(proposalData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 관리자 로그인 API
  static async loginAdmin(email, password) {
    const response = await fetch(`${this.baseURL}/login/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 기업용 제안서 조회 API (특정 기업의 공고에 제출된 제안서들)
  static async getProposalsByCompany(companyId) {
    const response = await fetch(`${this.baseURL}/proposals/company/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 기업용 공고 조회 API (특정 기업이 올린 공고들)
  static async getAssignmentsByCompany(companyId) {
    const response = await fetch(`${this.baseURL}/assignments/company/${companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 관리자별 공고 조회 API (특정 관리자가 올린 공고들)
  static async getAssignmentsByAdminId(adminId) {
    const response = await fetch(`${this.baseURL}/assignments/admin/${adminId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 특정 과제의 제안서 목록 조회
  static async getProposalsByAssignId(assignId) {
    const response = await fetch(`${this.baseURL}/proposals/assignment/${assignId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 공고 등록
  static async createAssignment(assignmentData) {
    const response = await fetch(`${this.baseURL}/register/assignments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(assignmentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 제안서 채택 여부 수정
  static async updateProposalSelected(proposalId, selected) {
    const response = await fetch(`${this.baseURL}/proposals/${proposalId}/selected?selected=${selected}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 전체 기업 목록 조회
  static async getAllCompanies() {
    const response = await fetch(`${this.baseURL}/companies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // 기업 회원가입
  static async registerAdmin(adminData) {
    const response = await fetch(`${this.baseURL}/register/admin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(adminData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
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
