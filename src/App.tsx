import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { UserInfoScreen } from './components/UserInfoScreen';
import { AboutScreen } from './components/AboutScreen';
import { MainScreen } from './components/MainScreen';

type View = 'welcome' | 'user-info' | 'about' | 'main';

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
        const result = await chrome.storage.local.get([
          'userProfile',
          'hasSeenWelcome',
        ]);

        // ONLY go to main if BOTH exist
        if (result.hasSeenWelcome === true && result.userProfile) {
          const profile = result.userProfile as UserProfile;
          setUserProfile(profile);
          setView('main');
        } else {
          // Start fresh - show welcome
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

    console.log('User profile saved:', profile); // Debug

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

    console.log('User profile saved (skipped):', profile); // Debug

    setUserProfile(profile);
    setView('main');
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

  // Render screens based on view
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
        userNickname={userProfile?.nickname || 'there'}
      />
    );
  }

  // Fallback (should never reach here)
  return null;
}

export default App;
