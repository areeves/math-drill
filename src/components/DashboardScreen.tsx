import { StudentProfile, Session, Screen } from '../types';
import { getOperationSymbol } from '../utils';

interface DashboardScreenProps {
  profile: StudentProfile | null;
  sessions: Session[];
  setScreen: (screen: Screen) => void;
}

export default function DashboardScreen({ profile, sessions, setScreen }: DashboardScreenProps) {
  if (!profile) return <div>No profile found.</div>;

  const getAccuracy = (op: keyof typeof profile.difficultyLevels) => {
    const relevantAttempts = sessions.flatMap(s => s.attempts.filter(a => a.problem.operation === op));
    if (relevantAttempts.length === 0) return 0;
    const correct = relevantAttempts.filter(a => a.correct).length;
    return Math.round((correct / relevantAttempts.length) * 100);
  };

  return (
    <div className="dashboard-screen">
      <h1>Progress Dashboard</h1>
      <h2>Difficulty Levels</h2>
      <ul>
        {Object.entries(profile.difficultyLevels).map(([op, level]) => (
          <li key={op}>
            {getOperationSymbol(op as any)}: Level {level} (Accuracy: {getAccuracy(op as any)}%)
          </li>
        ))}
      </ul>
      <h2>Recent Sessions</h2>
      <p>Total sessions: {sessions.length}</p>
      {/* TODO: More detailed stats */}
      <button onClick={() => setScreen('home')}>Back to Home</button>
    </div>
  );
}