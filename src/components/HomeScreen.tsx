import { useEffect } from 'react';
import type { StudentProfile, Screen } from '../types';

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

  return (
    <div className="home-screen">
      <h1>Welcome, {profile.name}!</h1>
      <div className="avatar">
        {profile.avatar}
      </div>
      <button disabled={!canStart} onClick={() => setScreen('drill')}>Start Math Drill</button>
      {!canStart && <div className="warning">No operations selected in settings. Go to settings to choose at least one.</div>}
      <button onClick={() => setScreen('dashboard')}>View Progress</button>
      <button onClick={() => setScreen('settings')}>Settings</button>
    </div>
  );
}
