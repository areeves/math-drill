import { useState } from 'react';
import type { StudentProfile, Session, Screen, Operation } from './types';
import {
  loadProfile,
  loadSessions,
  saveProfile,
  saveSessions,
  adjustDifficultyLevels,
} from './utils';
import HomeScreen from './components/HomeScreen';
import ProfileCreateScreen from './components/ProfileCreateScreen';
import DrillScreen from './components/DrillScreen';
import SummaryScreen from './components/SummaryScreen';
import DashboardScreen from './components/DashboardScreen';
import SettingsScreen from './components/SettingsScreen';
import './App.css';

function App() {
  const loadedProfile = loadProfile();
  const [screen, setScreen] = useState<Screen>('home');
  const [profile, setProfile] = useState<StudentProfile | null>(loadedProfile);
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [numProblems, setNumProblems] = useState<number>(loadedProfile?.settings.problemsPerSession ?? 10);
  const [lastSession, setLastSession] = useState<Session | null>(null);
  const [increasedOps, setIncreasedOps] = useState<Operation[]>([]);

  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
    setNumProblems(newProfile.settings.problemsPerSession);
  };

  const clearProfileData = () => {
    if (!profile) return;

    const resetProfile: StudentProfile = {
      ...profile,
      difficultyLevels: { add: 1, sub: 1, mul: 1, div: 1 },
      settings: {
        problemsPerSession: 10,
        includedOperations: ['add', 'sub', 'mul', 'div'],
      },
    };

    setProfile(resetProfile);
    saveProfile(resetProfile);
    setSessions([]);
    saveSessions([]);
    setNumProblems(resetProfile.settings.problemsPerSession);
  };

  const addSession = (session: Session) => {
    const newSessions = [...sessions, session];
    setSessions(newSessions);
    saveSessions(newSessions);
    setLastSession(session);

    // Adjust difficulty levels
    if (profile) {
      const { newLevels, increasedOps: incOps } = adjustDifficultyLevels(profile.difficultyLevels, newSessions);
      const updatedProfile = { ...profile, difficultyLevels: newLevels };
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
      setIncreasedOps(incOps);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen
            profile={profile}
            setScreen={setScreen}
          />
        );
      case 'profile-create':
        return <ProfileCreateScreen setProfile={updateProfile} setScreen={setScreen} />;
      case 'drill':
        return profile ? (
          <DrillScreen
            profile={profile}
            numProblems={numProblems}
            sessions={sessions}
            addSession={addSession}
            setScreen={setScreen}
          />
        ) : null;
      case 'summary':
        return <SummaryScreen session={lastSession} increasedOps={increasedOps} setScreen={setScreen} />;
      case 'dashboard':
        return <DashboardScreen profile={profile} sessions={sessions} setScreen={setScreen} />;
      case 'settings':
        return (
          <SettingsScreen
            profile={profile}
            sessions={sessions}
            updateProfile={updateProfile}
            clearProfileData={clearProfileData}
            setScreen={setScreen}
          />
        );
      default:
        return (
          <HomeScreen
            profile={profile}
            setScreen={setScreen}
          />
        );
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
