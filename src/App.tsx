import { useState } from 'react';
import type { StudentProfile, Session, Screen, Operation } from './types';
import {
  loadProfile,
  loadSessions,
  saveProfile,
  saveSessions,
  adjustDifficultyLevels,
  calculateXpGain,
  calculateLevelFromXp,
  checkAchievements,
} from './utils';
import HomeScreen from './components/HomeScreen';
import ProfileCreateScreen from './components/ProfileCreateScreen';
import DrillScreen from './components/DrillScreen';
import SummaryScreen from './components/SummaryScreen';
import DashboardScreen from './components/DashboardScreen';
import SettingsScreen from './components/SettingsScreen';
import './App.css';
import type { Achievement } from './types';

function App() {
  const loadedProfile = loadProfile();
  const [screen, setScreen] = useState<Screen>('home');
  const [profile, setProfile] = useState<StudentProfile | null>(loadedProfile);
  const [sessions, setSessions] = useState<Session[]>(loadSessions);
  const [numProblems, setNumProblems] = useState<number>(loadedProfile?.settings.problemsPerSession ?? 10);
  const [lastSession, setLastSession] = useState<Session | null>(null);
  const [increasedOps, setIncreasedOps] = useState<Operation[]>([]);
  const [xpGain, setXpGain] = useState<number>(0);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

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
      xp: 0,
      level: 1,
      achievements: [],
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
      
      // FR-7.1: Calculate XP from session score
      const correctCount = session.attempts.filter(a => a.correct).length;
      const scorePercentage = (correctCount / session.attempts.length) * 100;
      const xpEarned = calculateXpGain(scorePercentage, session.attempts.length);
      
      // FR-7.2: Update level based on new XP
      const newXp = profile.xp + xpEarned;
      const newLevel = calculateLevelFromXp(newXp);
      
      // FR-7.3: Check for achievements
      const achievements = checkAchievements(
        { ...profile, xp: newXp, level: newLevel },
        session,
        newSessions,
        incOps
      );
      
      const updatedProfile: StudentProfile = {
        ...profile,
        difficultyLevels: newLevels,
        xp: newXp,
        level: newLevel,
        achievements: [...profile.achievements, ...achievements],
      };
      
      setProfile(updatedProfile);
      saveProfile(updatedProfile);
      setIncreasedOps(incOps);
      setXpGain(xpEarned);
      setNewAchievements(achievements);
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
        return <SummaryScreen session={lastSession} increasedOps={increasedOps} xpGain={xpGain} newAchievements={newAchievements} setScreen={setScreen} />;
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
