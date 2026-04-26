import { useState, useEffect } from 'react';
import type { StudentProfile, Screen, Problem, Attempt, Session, Operation } from '../types';
import { generateProblem, getOperationSymbol } from '../utils';

interface DrillScreenProps {
  profile: StudentProfile;
  addSession: (session: Session) => void;
  setScreen: (screen: Screen) => void;
}

const NUM_PROBLEMS = 10;

export default function DrillScreen({ profile, addSession, setScreen }: DrillScreenProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    // Generate problems
    const ops: Operation[] = ['add', 'sub', 'mul', 'div'];
    const newProblems: Problem[] = [];
    for (let i = 0; i < NUM_PROBLEMS; i++) {
      const op = ops[i % ops.length];
      const level = profile.difficultyLevels[op];
      newProblems.push(generateProblem(op, level));
    }
    setProblems(newProblems);
    setStartTime(Date.now());
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const answer = parseInt(userAnswer);
    if (isNaN(answer)) return;

    const problem = problems[currentIndex];
    const correct = answer === problem.answer;
    const attempt: Attempt = { problem, userAnswer: answer, correct };
    const newAttempts = [...attempts, attempt];
    setAttempts(newAttempts);

    setFeedback(correct ? 'Correct!' : `Incorrect. The answer is ${problem.answer}`);

    setTimeout(() => {
      if (currentIndex < problems.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setUserAnswer('');
        setFeedback('');
      } else {
        // End session
        const endTime = Date.now();
        const timeTaken = Math.floor((endTime - startTime) / 1000);
        const session: Session = {
          timestamp: endTime,
          attempts: newAttempts,
          timeTaken
        };
        addSession(session);
        setScreen('summary');
      }
    }, 2000); // Show feedback for 2 seconds
  };

  if (problems.length === 0) return <div>Loading problems...</div>;

  const currentProblem = problems[currentIndex];

  return (
    <div className="drill-screen">
      <div className="progress">Problem {currentIndex + 1} of {NUM_PROBLEMS}</div>
      <div className="problem">
        <span className="operand">{currentProblem.operand1}</span>
        <span className="operation">{getOperationSymbol(currentProblem.operation)}</span>
        <span className="operand">{currentProblem.operand2}</span>
        <span>=</span>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
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