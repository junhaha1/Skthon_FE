import React, { useState } from "react";

function App() {
  const [testResult, setTestResult] = useState("");

  const handleTestButton = async () => {
    try {
      const response = await fetch("https://skthonbe-production.up.railway.app/test");
      const data = await response.text();
      setTestResult(data);
    } catch (error) {
      console.error("API 호출 오류:", error);
      setTestResult("오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">API 테스트</h1>
        
        <button
          onClick={handleTestButton}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          테스트 버튼
        </button>
        
        {testResult && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">API 응답:</h3>
            <p className="text-lg">{testResult}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
