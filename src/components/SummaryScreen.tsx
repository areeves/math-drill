import type { Screen } from '../types';

interface SummaryScreenProps {
  setScreen: (screen: Screen) => void;
}

export default function SummaryScreen({ setScreen }: SummaryScreenProps) {
  // For now, assume last session is available, but since state is in App, need to pass it.
  // Actually, since we just added it, but to keep simple, hardcode or pass from App.
  // For MVP, just show a message.

  return (
    <div className="summary-screen">
      <h1>Session Complete!</h1>
      <p>Great job! You finished the drill.</p>
      {/* TODO: Show actual score and time */}
      <button onClick={() => setScreen('home')}>Back to Home</button>
    </div>
  );
}