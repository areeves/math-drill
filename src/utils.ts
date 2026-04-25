import { Operation, DifficultyLevel, Problem, StudentProfile, Session } from './types';

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