import { useEffect } from 'react';
import type { StudentProfile, Screen, Operation } from '../types';

const OPERATION_LABELS: Record<Operation, string> = {
  add: 'Addition',
  sub: 'Subtraction',
  mul: 'Multiplication',
  div: 'Division',
};

interface HomeScreenProps {
  profile: StudentProfile | null;
  selectedOperations: Operation[];
  setSelectedOperations: (operations: Operation[]) => void;
  setScreen: (screen: Screen) => void;
}

export default function HomeScreen({ profile, selectedOperations, setSelectedOperations, setScreen }: HomeScreenProps) {
  useEffect(() => {
    if (!profile) {
      setScreen('profile-create');
    }
  }, [profile, setScreen]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  const toggleOperation = (operation: Operation) => {
    if (selectedOperations.includes(operation)) {
      setSelectedOperations(selectedOperations.filter((op) => op !== operation));
    } else {
      setSelectedOperations([...selectedOperations, operation]);
    }
  };

  const canStart = selectedOperations.length > 0;

  return (
    <div className="home-screen">
      <h1>Welcome, {profile.name}!</h1>
      <div className="avatar">
        {profile.avatar}
      </div>
      <div className="operation-selector">
        <p>Select operations to practice:</p>
        <div className="operations-list">
          {(['add', 'sub', 'mul', 'div'] as Operation[]).map((operation) => (
            <label key={operation} className="operation-option">
              <input
                type="checkbox"
                checked={selectedOperations.includes(operation)}
                onChange={() => toggleOperation(operation)}
              />
              {OPERATION_LABELS[operation]}
            </label>
          ))}
        </div>
      </div>
      <button disabled={!canStart} onClick={() => setScreen('drill')}>Start Math Drill</button>
      {!canStart && <div className="warning">Select at least one operation to start the drill.</div>}
      <button onClick={() => setScreen('dashboard')}>View Progress</button>
    </div>
  );
}
