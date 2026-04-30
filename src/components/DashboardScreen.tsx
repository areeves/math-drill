import type { StudentProfile, Session, Screen, Operation, DifficultyLevel } from '../types';
import { deriveAchievementsFromSessions, getOperationSymbol, getAchievementDescription } from '../utils';

interface DashboardScreenProps {
  profile: StudentProfile | null;
  sessions: Session[];
  setScreen: (screen: Screen) => void;
}

export default function DashboardScreen({ profile, sessions, setScreen }: DashboardScreenProps) {
  if (!profile) return <div>No profile found.</div>;

  const entries = Object.entries(profile.difficultyLevels) as Array<[Operation, DifficultyLevel]>;
  const achievements = deriveAchievementsFromSessions(sessions);

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
      
      <h2>Achievements</h2>
      {achievements.length === 0 ? (
        <p>No achievements yet. Keep practicing!</p>
      ) : (
        <div className="achievements-grid">
          {achievements.map((achievement) => {
            const desc = getAchievementDescription(achievement.type);
            return (
              <div key={achievement.id} className="achievement-card">
                <div className="achievement-emoji">{desc.emoji}</div>
                <div className="achievement-name">{desc.title}</div>
                <div className="achievement-description">{desc.description}</div>
              </div>
            );
          })}
        </div>
      )}
      
      <button onClick={() => setScreen('home')}>Back to Home</button>
    </div>
  );
}