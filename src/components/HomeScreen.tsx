import { useEffect } from 'react';
import type { StudentProfile, Screen } from '../types';
import { getXpProgress } from '../utils';

interface HomeScreenProps {
  profile: StudentProfile | null;
  setScreen: (screen: Screen) => void;
}

export default function HomeScreen({ profile, setScreen }: HomeScreenProps) {
  useEffect(() => {
    if (!profile) {
      setScreen('profile-create');
    }
  }, [profile, setScreen]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const canStart = profile.settings.includedOperations.length > 0;
  const { currentLevel, xpInLevel, xpForLevel } = getXpProgress(profile.xp);
  const xpProgressPercent = (xpInLevel / xpForLevel) * 100;

  return (
    <div className="home-screen">
      <h1>Welcome, {profile.name}!</h1>
      <div className="avatar">
        {profile.avatar}
      </div>
      
      <div className="level-display">
        <div className="level">Level {currentLevel}</div>
        <div className="xp-bar">
          <div className="xp-progress" style={{ width: `${xpProgressPercent}%` }}></div>
        </div>
        <div className="xp-text">{xpInLevel} / {xpForLevel} XP</div>
      </div>

      <button disabled={!canStart} onClick={() => setScreen('drill')}>Start Math Drill</button>
      {!canStart && <div className="warning">No operations selected in settings. Go to settings to choose at least one.</div>}
      <button onClick={() => setScreen('dashboard')}>View Progress</button>
      <button onClick={() => setScreen('settings')}>Settings</button>
      
      {profile.achievements.length > 0 && (
        <div className="achievements-preview">
          <h3>Achievements ({profile.achievements.length})</h3>
          <p>You've earned {profile.achievements.length} achievement{profile.achievements.length !== 1 ? 's' : ''}!</p>
        </div>
      )}
    </div>
  );
}
