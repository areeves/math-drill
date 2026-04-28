import { useEffect, useReducer, type FormEvent } from 'react';
import type { StudentProfile, Screen, Problem, Attempt, Session, Operation } from '../types';
import { generateWeightedProblems, getOperationSymbol } from '../utils';

interface DrillScreenProps {
  profile: StudentProfile;
  selectedOperations: Operation[];
  numProblems: number;
  sessions: Session[];
  addSession: (session: Session) => void;
  setScreen: (screen: Screen) => void;
}

type DrillState = {
  problems: Problem[];
  currentIndex: number;
  userAnswer: string;
  attempts: Attempt[];
  startTime: number;
  feedback: string;
};

type DrillAction =
  | { type: 'reset'; problems: Problem[]; startTime: number }
  | { type: 'setUserAnswer'; userAnswer: string }
  | { type: 'recordAttempt'; attempt: Attempt; feedback: string }
  | { type: 'advanceProblem' };

const initialState: DrillState = {
  problems: [],
  currentIndex: 0,
  userAnswer: '',
  attempts: [],
  startTime: Date.now(),
  feedback: '',
};

function drillReducer(state: DrillState, action: DrillAction): DrillState {
  switch (action.type) {
    case 'reset':
      return {
        problems: action.problems,
        currentIndex: 0,
        userAnswer: '',
        attempts: [],
        feedback: '',
        startTime: action.startTime,
      };
    case 'setUserAnswer':
      return { ...state, userAnswer: action.userAnswer };
    case 'recordAttempt':
      return {
        ...state,
        attempts: [...state.attempts, action.attempt],
        feedback: action.feedback,
      };
    case 'advanceProblem':
      return { ...state, currentIndex: state.currentIndex + 1, userAnswer: '', feedback: '' };
    default:
      return state;
  }
}

export default function DrillScreen({ profile, selectedOperations, numProblems, sessions, addSession, setScreen }: DrillScreenProps) {
  const [state, dispatch] = useReducer(drillReducer, initialState);
  const { problems, currentIndex, userAnswer, attempts, startTime, feedback } = state;

  useEffect(() => {
    const newProblems = generateWeightedProblems(selectedOperations, profile, sessions, numProblems);
    dispatch({ type: 'reset', problems: newProblems, startTime: Date.now() });
  }, [profile, selectedOperations, sessions, numProblems]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    const problem = problems[currentIndex];
    const correct = answer === problem.answer;
    const attempt: Attempt = { problem, userAnswer: answer, correct };
    const newAttempts = [...attempts, attempt];
    dispatch({ type: 'recordAttempt', attempt, feedback: correct ? 'Correct!' : `Incorrect. The answer is ${problem.answer}` });

    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        dispatch({ type: 'advanceProblem' });
      } else {
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        const session: Session = {
          timestamp: endTime,
          attempts: newAttempts,
          timeTaken,
          operations: selectedOperations,
        };
        addSession(session);
        setScreen('summary');
      }
    }, 2000);
  };

  if (selectedOperations.length === 0) {
    return (
      <div className="drill-screen">
        <div className="warning">No operations selected. Return to the home screen to choose at least one.</div>
        <button onClick={() => setScreen('home')}>Back to Home</button>
      </div>
    );
  }

  if (problems.length === 0) return <div>Loading problems...</div>;

  const currentProblem = problems[currentIndex];
  const totalProblems = problems.length;

  return (
    <div className="drill-screen">
      <div className="progress">Problem {currentIndex + 1} of {totalProblems}</div>
      <div className="problem">
        <span className="operand">{currentProblem.operand1}</span>
        <span className="operation">{getOperationSymbol(currentProblem.operation)}</span>
        <span className="operand">{currentProblem.operand2}</span>
        <span>=</span>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => dispatch({ type: 'setUserAnswer', userAnswer: e.target.value })}
            autoFocus
            disabled={!!feedback}
          />
          <button type="submit" disabled={!!feedback}>Submit</button>
        </form>
      </div>
      {feedback && <div className={`feedback ${feedback.startsWith('Correct') ? 'correct' : 'incorrect'}`}>{feedback}</div>}
    </div>
  );
}
