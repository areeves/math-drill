import { useState } from 'react';
import type { StudentProfile, Session, Screen, Operation } from './types';
import { loadProfile, loadSessions, saveProfile, saveSessions, adjustDifficultyLevels } from './utils';
import HomeScreen from './components/HomeScreen';
import ProfileCreateScreen from './components/ProfileCreateScreen';
import DrillScreen from './components/DrillScreen';
import SummaryScreen from './components/SummaryScreen';
import DashboardScreen from './components/DashboardScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [profile, setProfile] = useState<StudentProfile | null>(loadProfile);
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [selectedOperations, setSelectedOperations] = useState<Operation[]>(['add', 'sub', 'mul', 'div']);
  const [lastSession, setLastSession] = useState<Session | null>(null);
  const [increasedOps, setIncreasedOps] = useState<Operation[]>([]);

  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
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
            selectedOperations={selectedOperations}
            setSelectedOperations={setSelectedOperations}
            setScreen={setScreen}
          />
        );
      case 'profile-create':
        return <ProfileCreateScreen setProfile={updateProfile} setScreen={setScreen} />;
      case 'drill':
        return profile ? (
          <DrillScreen
            profile={profile}
            selectedOperations={selectedOperations}
            sessions={sessions}
            addSession={addSession}
            setScreen={setScreen}
          />
        ) : null;
      case 'summary':
        return <SummaryScreen session={lastSession} increasedOps={increasedOps} setScreen={setScreen} />;
      case 'dashboard':
        return <DashboardScreen profile={profile} sessions={sessions} setScreen={setScreen} />;
      default:
        return (
          <HomeScreen
            profile={profile}
            selectedOperations={selectedOperations}
            setSelectedOperations={setSelectedOperations}
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
