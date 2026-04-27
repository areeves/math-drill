# Math Drills — Functional Requirements

## Overview

Math Drills is a web-based arithmetic practice application for early learners. It presents problems adaptively based on the student's demonstrated performance, tracks progress over time, and provides a parent/guardian dashboard for monitoring results. The application is designed to replace printed worksheets with an engaging, data-informed experience.

---

## Goals

- Give children a self-directed way to practice basic arithmetic
- Surface weak areas automatically so practice time is spent where it matters most
- Give parents visibility into progress without requiring them to be present for every session
- Be simple enough for a young child to use independently after initial setup

---

## Users

| Role | Description |
|---|---|
| **Student** | The child completing math drills. Interacts with the drill interface. |
| **Parent/Guardian** | Sets up the student profile and reviews the progress dashboard. |

For MVP, the application assumes a single student per device. Multi-student support is a future consideration.

---

## Functional Requirements

### 1. Student Profiles

- **FR-1.1** A parent can create a student profile with a name and avatar (selected from a preset set).
- **FR-1.2** The profile stores the student's current difficulty level per operation type (see §3).
- **FR-1.3** A parent can reset a student's progress from the settings screen.

---

### 2. Drill Sessions

- **FR-2.1** A student can start a drill session from the home screen.
- **FR-2.2** Each session presents a configurable number of problems (default: 10).
- **FR-2.3** Problems are presented one at a time. The student enters a numeric answer and submits.
- **FR-2.4** Immediate feedback is shown after each answer (correct / incorrect + the correct answer if wrong).
- **FR-2.5** The student cannot advance without submitting an answer.
- **FR-2.6** At the end of a session, a summary screen shows the score, time taken, and a simple performance message.
- **FR-2.7** Sessions are timestamped and stored locally for use by the progress dashboard.

---

### 3. Operation Types & Difficulty

The application supports four operation types:

| Operation | Symbol |
|---|---|
| Addition | + |
| Subtraction | − |
| Multiplication | × |
| Division | ÷ |

Each operation type has an independent difficulty level tracked separately.

**Difficulty levels:**

| Level | Description | Example Range |
|---|---|---|
| 1 — Beginner | Single-digit operands | 3 + 4, 9 − 2 |
| 2 — Developing | Mixed single/double-digit | 7 + 13, 15 − 8 |
| 3 — Proficient | Double-digit operands | 24 + 37, 56 − 19 |
| 4 — Advanced | Multi-digit, larger numbers | 124 + 278, 345 − 167 |

- **FR-3.1** Problems for a session are drawn from the student's current difficulty level for each operation.
- **FR-3.2** Division problems are always generated from the answer outward (e.g., pick quotient first) to guarantee whole-number answers.
- **FR-3.3** Subtraction problems are always generated to produce non-negative answers.

---

### 4. Adaptive Difficulty (Spaced Repetition)

The application tracks per-operation performance and adjusts difficulty using a simplified spaced repetition model.

- **FR-4.1** Each operation type has an independent accuracy score calculated from the last N attempts (default N = 20).
- **FR-4.2** If accuracy for an operation exceeds **85%** across the last N attempts, the difficulty level for that operation increases by 1 (up to the maximum).
- **FR-4.3** If accuracy for an operation falls below **50%** across the last N attempts, the difficulty level for that operation decreases by 1 (down to the minimum).
- **FR-4.4** Difficulty adjustments are evaluated at the end of each session, not mid-session.
- **FR-4.5** The student is shown a celebratory message when a difficulty level increases.
- **FR-4.6** Problem selection within a session weights weaker operation types more heavily, proportional to their recent error rate.

---

### 5. Progress Dashboard

The dashboard is accessible from the home screen and intended for parent review.

- **FR-5.1** The dashboard displays the student's current difficulty level for each operation type.
- **FR-5.2** The dashboard displays accuracy per operation type over the last 7 days, 30 days, and all time.
- **FR-5.3** The dashboard displays a daily streak count (consecutive days with at least one completed session).
- **FR-5.4** The dashboard displays a line chart of session scores over time.
- **FR-5.5** The dashboard highlights the operation type with the lowest recent accuracy as an area to focus on.
- **FR-5.6** Individual session history is viewable in a scrollable log showing date, score, and duration.

---

### 6. Settings

- **FR-6.1** A parent can configure the number of problems per session (options: 5, 10, 20).
- **FR-6.2** A parent can toggle which operation types are included in sessions.
- **FR-6.3** A parent can manually override the difficulty level for any operation type.
- **FR-6.4** A parent can export session history as a CSV file.
- **FR-6.5** A parent can clear all stored data for the current student profile.

---

### 7. Gamification

- **FR-7.1** The student earns XP for each completed session, scaled by score percentage.
- **FR-7.2** XP accumulates toward levels displayed on the student's home screen.
- **FR-7.3** Milestone achievements are awarded for events such as: first session completed, 7-day streak, first difficulty level-up, 100% session score.
- **FR-7.4** Earned achievements are visible on the student's profile screen.

---

## Non-Functional Requirements

- **NFR-1** The application must function fully offline after initial load.
- **NFR-2** All data is stored in the browser (`localStorage` / `IndexedDB`). No account creation or server-side storage is required.
- **NFR-3** The application must be usable on both desktop and mobile (tablet-friendly layouts preferred).
- **NFR-4** The drill interface must be operable by a young child without reading ability beyond single digits (icons and color cues supplement text).
- **NFR-5** The application must be deployable as a static site (e.g., GitHub Pages).

---

## Out of Scope (v1)

- Multiple student profiles on a single device
- Parent authentication / PIN protection for settings
- Server-side storage or syncing across devices
- Timed drill mode (speed-based scoring)
- Fractions, decimals, or other non-integer arithmetic
- Curriculum alignment or grade-level tagging

---

## Data Model (Conceptual)

```
StudentProfile
  id, name, avatar, createdAt

OperationState
  studentId, operation (add|sub|mul|div), difficultyLevel, attemptHistory[]

Session
  id, studentId, startedAt, completedAt, problems[]

Problem
  operation, operand1, operand2, correctAnswer, studentAnswer, isCorrect, responseTimeMs

Achievement
  studentId, type, earnedAt
```

---

## Open Questions

| # | Question | Owner |
|---|---|---|
| 1 | Should difficulty levels be shared across operation types, or always tracked independently? | Design |
| 2 | What is the right window size (N) for the spaced repetition accuracy calculation? | Design |
| 3 | Is a PIN or simple password needed to gate the parent dashboard / settings from the student? | Product |
| 4 | Should XP and achievements persist if session history is cleared, or reset together? | Product |
