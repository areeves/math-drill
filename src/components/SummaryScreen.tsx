import type { Screen, Session } from '../types';

interface SummaryScreenProps {
  session: Session | null;
  setScreen: (screen: Screen) => void;
}

function getPerformanceMessage(percentage: number): string {
  if (percentage === 100) return "Perfect! You got them all correct! 🎉";
  if (percentage >= 85) return "Excellent work! Keep it up! 🌟";
  if (percentage >= 70) return "Good job! You're making progress! 👍";
  if (percentage >= 50) return "Nice effort! Practice makes perfect! 💪";
  return "Keep trying! You'll improve with practice! 🚀";
}

export default function SummaryScreen({ session, setScreen }: SummaryScreenProps) {
  if (!session) {
    return (
      <div className="summary-screen">
        <h1>Session Complete!</h1>
        <p>Great job! You finished the drill.</p>
        <button onClick={() => setScreen('home')}>Back to Home</button>
      </div>
    );
  }

  const correctCount = session.attempts.filter((a) => a.correct).length;
  const totalCount = session.attempts.length;
  const percentage = Math.round((correctCount / totalCount) * 100);
  const minutes = Math.floor(session.timeTaken / 60);
  const seconds = session.timeTaken % 60;

  return (
    <div className="summary-screen">
      <h1>Session Complete!</h1>
      <div className="score-display">
        <div className="score">{percentage}%</div>
        <div className="score-detail">{correctCount} out of {totalCount} correct</div>
      </div>
      <div className="time-display">
        Time: {minutes}m {seconds}s
      </div>
      <p className="performance-message">{getPerformanceMessage(percentage)}</p>
      <button onClick={() => setScreen('home')}>Back to Home</button>
    </div>
  );
}