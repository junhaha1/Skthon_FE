import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import MainCommunity from "./components/MainCommunity";
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
        <div className="App">
          {showWelcome && <WelcomeScreen onTransitionComplete={handleTransitionComplete} />}
          {!showWelcome && <MainCommunity />}
        </div>
      </AssignmentProvider>
    </AuthProvider>
  );
}

export default App;
