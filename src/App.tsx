import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UserInfoScreen } from './components/UserInfoScreen';
import { AboutScreen } from './components/AboutScreen';
import { MainScreen } from './components/MainScreen';

type View = 'welcome' | 'user-info' | 'about' | 'main' | 'tab-selector';

interface UserProfile {
  nickname: string;
  email?: string;
  job?: string;
  createdAt: number;
  hasCompletedOnboarding: boolean;
}

function App() {
  const [view, setView] = useState<View>('welcome');
  const [previousView, setPreviousView] = useState<View>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const result = await chrome.storage.local.get(['userProfile', 'hasSeenWelcome']);
        
        if (result.hasSeenWelcome && result.userProfile) {
          // Type assertion to ensure correct type
          const profile = result.userProfile as UserProfile;
          setUserProfile(profile);
          setView('main');
        } else {
          setView('welcome');
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setView('welcome');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboarding();
  }, []);

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
    const profile: UserProfile = {
      nickname: data.nickname,
      email: data.email,
      job: data.job,
      createdAt: Date.now(),
      hasCompletedOnboarding: true,
    };

    // Save to Chrome storage
    await chrome.storage.local.set({
      userProfile: profile,
      hasSeenWelcome: true,
    });

    setUserProfile(profile);
    setView('main');
  };

  const handleUserInfoSkip = async () => {
    const profile: UserProfile = {
      nickname: 'there',
      createdAt: Date.now(),
      hasCompletedOnboarding: true,
    };

    await chrome.storage.local.set({
      userProfile: profile,
      hasSeenWelcome: true,
    });

    setUserProfile(profile);
    setView('main');
  };

  const handleOpenTabSelector = () => {
    setView('tab-selector');
    // You'll implement TabSelector component next
  };

  // Show loading state
  if (isLoading) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          color: '#5a5a5c',
        }}
      >
        Loading...
      </div>
    );
  }

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

  if (view === 'main') {
    return (
      <MainScreen
        onInfoClick={handleInfoClick}
        onAddNew={handleOpenTabSelector}
        userNickname={userProfile?.nickname || 'there'}
      />
    );
  }

  if (view === 'tab-selector') {
    // Placeholder for now
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          gap: '16px',
        }}
      >
        <p style={{ fontSize: '16px', color: '#18181b' }}>Tab Selector (Coming next)</p>
        <button
          onClick={() => setView('main')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#18181b',
            color: '#efeded',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
          }}
        >
          Back to Main
        </button>
      </div>
    );
  }

  return null;
}

export default App;