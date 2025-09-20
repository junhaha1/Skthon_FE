import React, { useState } from "react";
import WelcomeScreen from "./components/WelcomeScreen";
import MainCommunity from "./components/MainCommunity";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleTransitionComplete = () => {
    setShowWelcome(false);
  };

  return (
    <AuthProvider>
      <div className="App">
        {showWelcome && <WelcomeScreen onTransitionComplete={handleTransitionComplete} />}
        {!showWelcome && <MainCommunity />}
      </div>
    </AuthProvider>
  );
}

export default App;
