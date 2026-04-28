import type { StudentProfile, Session, Screen, Operation, DifficultyLevel } from '../types';
import { getOperationSymbol } from '../utils';

interface DashboardScreenProps {
  profile: StudentProfile | null;
  sessions: Session[];
  setScreen: (screen: Screen) => void;
}

export default function DashboardScreen({ profile, sessions, setScreen }: DashboardScreenProps) {
  if (!profile) return <div>No profile found.</div>;

  const entries = Object.entries(profile.difficultyLevels) as Array<[Operation, DifficultyLevel]>;

  const getAccuracy = (op: Operation) => {
    const relevantAttempts = sessions.flatMap((s) => s.attempts.filter((a) => a.problem.operation === op));
    if (relevantAttempts.length === 0) return 0;
    const correct = relevantAttempts.filter((a) => a.correct).length;
    return Math.round((correct / relevantAttempts.length) * 100);
  };

  return (
    <div className="dashboard-screen">
      <h1>Progress Dashboard</h1>
      <button onClick={() => setScreen('settings')}>Settings</button>
      <h2>Difficulty Levels</h2>
      <ul>
        {entries.map(([op, level]) => (
          <li key={op}>
            {getOperationSymbol(op)}: Level {level} (Accuracy: {getAccuracy(op)}%)
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