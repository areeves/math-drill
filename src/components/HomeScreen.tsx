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

  return (
    <div className="home-screen">
      <h1>Welcome, {profile.name}!</h1>
      <div className="avatar">
        <img src={profile.avatar} alt="Avatar" />
      </div>
      <button onClick={() => setScreen('drill')}>Start Math Drill</button>
      <button onClick={() => setScreen('dashboard')}>View Progress</button>
    </div>
  );
}