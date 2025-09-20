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
