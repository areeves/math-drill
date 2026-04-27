import type { Operation, DifficultyLevel, Problem, StudentProfile, Session, Attempt } from './types';

export function generateProblem(operation: Operation, level: DifficultyLevel): Problem {
  let operand1: number, operand2: number, answer: number;

  const getRange = (level: DifficultyLevel): [number, number] => {
    switch (level) {
      case 1: return [0, 9];
      case 2: return [0, 99];
      case 3: return [10, 99];
      case 4: return [100, 999];
      default: return [0, 9];
    }
  };

  const [min, max] = getRange(level);

  switch (operation) {
    case 'add':
      operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
      operand2 = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = operand1 + operand2;
      break;
    case 'sub':
      operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
      operand2 = Math.floor(Math.random() * (max - min + 1)) + min;
      if (operand1 < operand2) [operand1, operand2] = [operand2, operand1];
      answer = operand1 - operand2;
      break;
    case 'mul':
      operand1 = Math.floor(Math.random() * (max - min + 1)) + min;
      operand2 = Math.floor(Math.random() * (max - min + 1)) + min;
      answer = operand1 * operand2;
      break;
    case 'div':
      // Generate from answer outward
      answer = Math.floor(Math.random() * (max - min + 1)) + min;
      operand2 = Math.floor(Math.random() * 9) + 1; // divisor 1-9 to keep simple
      operand1 = answer * operand2;
      break;
  }

  return { operation, operand1, operand2, answer };
}

export function getOperationSymbol(op: Operation): string {
  switch (op) {
    case 'add': return '+';
    case 'sub': return '−';
    case 'mul': return '×';
    case 'div': return '÷';
  }
}

// Local storage keys
const PROFILE_KEY = 'math-drill-profile';
const SESSIONS_KEY = 'math-drill-sessions';

export function saveProfile(profile: StudentProfile): void {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfile(): StudentProfile | null {
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveSessions(sessions: Session[]): void {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function loadSessions(): Session[] {
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function getRecentAttempts(sessions: Session[], operation: Operation, n: number = 20): Attempt[] {
  const attempts: Attempt[] = [];
  for (let i = sessions.length - 1; i >= 0 && attempts.length < n; i--) {
    const session = sessions[i];
    for (let j = session.attempts.length - 1; j >= 0 && attempts.length < n; j--) {
      const attempt = session.attempts[j];
      if (attempt.problem.operation === operation) {
        attempts.push(attempt);
      }
    }
  }
  return attempts;
}

export function calculateAccuracy(attempts: Attempt[]): number {
  if (attempts.length === 0) return 0;
  const correct = attempts.filter(a => a.correct).length;
  return correct / attempts.length;
}

export function adjustDifficultyLevels(
  currentLevels: Record<Operation, DifficultyLevel>,
  sessions: Session[]
): { newLevels: Record<Operation, DifficultyLevel>; increasedOps: Operation[] } {
  const newLevels = { ...currentLevels };
  const increasedOps: Operation[] = [];
  const operations: Operation[] = ['add', 'sub', 'mul', 'div'];

  operations.forEach(op => {
    const attempts = getRecentAttempts(sessions, op);
    const accuracy = calculateAccuracy(attempts);
    if (attempts.length >= 5) { // Only adjust if we have enough data
      if (accuracy > 0.85 && newLevels[op] < 4) {
        newLevels[op]++;
        increasedOps.push(op);
      } else if (accuracy < 0.5 && newLevels[op] > 1) {
        newLevels[op]--;
      }
    }
  });

  return { newLevels, increasedOps };
}

export function generateWeightedProblems(
  selectedOperations: Operation[],
  profile: StudentProfile,
  sessions: Session[],
  numProblems: number
): Problem[] {
  if (selectedOperations.length === 0) return [];

  // Calculate error rates (1 - accuracy) for weighting
  const errorRates: Record<Operation, number> = { add: 0, sub: 0, mul: 0, div: 0 };
  selectedOperations.forEach(op => {
    const attempts = getRecentAttempts(sessions, op, 20);
    const accuracy = calculateAccuracy(attempts);
    errorRates[op] = 1 - accuracy;
  });

  // Normalize error rates to weights (higher error rate = higher weight)
  const totalError = Object.values(errorRates).reduce((sum, rate) => sum + rate, 0);
  const weights: Record<Operation, number> = { add: 0, sub: 0, mul: 0, div: 0 };
  if (totalError === 0) {
    // If no errors, equal weights
    selectedOperations.forEach(op => weights[op] = 1 / selectedOperations.length);
  } else {
    selectedOperations.forEach(op => weights[op] = errorRates[op] / totalError);
  }

  // Generate problems based on weights
  const problems: Problem[] = [];
  for (let i = 0; i < numProblems; i++) {
    const rand = Math.random();
    let cumulative = 0;
    let selectedOp: Operation = selectedOperations[0];
    for (const op of selectedOperations) {
      cumulative += weights[op];
      if (rand <= cumulative) {
        selectedOp = op;
        break;
      }
    }
    const level = profile.difficultyLevels[selectedOp];
    problems.push(generateProblem(selectedOp, level));
  }

  return problems;
}