import { useEffect } from 'react';
import type { StudentProfile, Screen, Session } from '../types';
import { deriveAchievementsFromSessions, getXpProgressFromSessions } from '../utils';

interface HomeScreenProps {
  profile: StudentProfile | null;
  sessions: Session[];
  setScreen: (screen: Screen) => void;
}

export default function HomeScreen({ profile, sessions, setScreen }: HomeScreenProps) {
  useEffect(() => {
    if (!profile) {
      setScreen('profile-create');
    }
  }, [profile, setScreen]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const canStart = profile.settings.includedOperations.length > 0;
  const { totalXp, currentLevel, xpInLevel, xpForLevel, xpToNextLevel } = getXpProgressFromSessions(sessions);
  const xpProgressPercent = xpForLevel === 0 ? 0 : (xpInLevel / xpForLevel) * 100;
  const achievements = deriveAchievementsFromSessions(sessions);

  return (
    <div className="home-screen">
      <h1>Welcome, {profile.name}!</h1>
      <div className="avatar">
        {profile.avatar}
      </div>
      
      <div className="level-display">
        <div className="level">Level {currentLevel}</div>
        <div className="xp-summary">
          <div>Total XP: {totalXp}</div>
          <div>Earn {xpToNextLevel} XP to Level {currentLevel + 1}</div>
        </div>
        <div className="xp-bar">
          <div className="xp-progress" style={{ width: `${xpProgressPercent}%` }}></div>
        </div>
        <div className="xp-text">{xpInLevel} / {xpForLevel} XP toward next level</div>
      </div>

      <button disabled={!canStart} onClick={() => setScreen('drill')}>Start Math Drill</button>
      {!canStart && <div className="warning">No operations selected in settings. Go to settings to choose at least one.</div>}
      <button onClick={() => setScreen('dashboard')}>View Progress</button>
      <button onClick={() => setScreen('settings')}>Settings</button>
      
      {achievements.length > 0 && (
        <div className="achievements-preview">
          <h3>Achievements ({achievements.length})</h3>
          <p>You've earned {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}!</p>
        </div>
      )}
    </div>
  );
}
