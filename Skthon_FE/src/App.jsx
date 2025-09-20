import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import WelcomeScreen from "./components/WelcomeScreen";
import MainCommunity from "./components/MainCommunity";
import MyPage from "./components/MyPage";
import { AuthProvider } from "./contexts/AuthContext";
import { AssignmentProvider } from "./contexts/AssignmentContext";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleTransitionComplete = () => {
    setShowWelcome(false);
  };

  return (
    <AuthProvider>
      <AssignmentProvider>
        <Router>
          <div className="App">
            {showWelcome && <WelcomeScreen onTransitionComplete={handleTransitionComplete} />}
            {!showWelcome && (
              <Routes>
                <Route path="/" element={<MainCommunity />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </div>
        </Router>
      </AssignmentProvider>
    </AuthProvider>
  );
}

export default App;
