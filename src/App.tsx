import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UserInfoScreen } from './components/UserInfoScreen';
import { AboutScreen } from './components/AboutScreen';

type View = 'welcome' | 'user-info' | 'about' | 'main' | 'tab-selector';

function App() {
  const [view, setView] = useState<View>('welcome');
  const [previousView, setPreviousView] = useState<View>('welcome');

  const handleInfoClick = () => {
    setPreviousView(view);
    setView('about');
  };

  const handleAboutBack = () => {
    setView(previousView);
  };

  const handleGetStarted = () => {
    setView('user-info');
  };

  const handleUserInfoComplete = async (data: {
    nickname: string;
    email?: string;
    job?: string;
  }) => {
    setView('main');
  };

  const handleUserInfoSkip = async () => {
    setView('main');
  };

  // Render screens
  if (view === 'welcome') {
    return (
      <WelcomeScreen
        onGetStarted={handleGetStarted}
        onInfoClick={handleInfoClick}
      />
    );
  }

  if (view === 'user-info') {
    return (
      <UserInfoScreen
        onComplete={handleUserInfoComplete}
        onSkip={handleUserInfoSkip}
        onInfoClick={handleInfoClick}
      />
    );
  }

  if (view === 'about') {
    return <AboutScreen onBack={handleAboutBack} />;
  }
}

export default App;
