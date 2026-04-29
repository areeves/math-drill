import { useState, type FormEvent } from 'react';
import type { StudentProfile, Screen, Operation, DifficultyLevel } from '../types';

interface ProfileCreateScreenProps {
  setProfile: (profile: StudentProfile) => void;
  setScreen: (screen: Screen) => void;
}

const avatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
const defaultDifficultyLevels: Record<Operation, DifficultyLevel> = { add: 1, sub: 1, mul: 1, div: 1 };
const defaultSettings = {
  problemsPerSession: 10 as const,
  includedOperations: ['add', 'sub', 'mul', 'div'] as Operation[],
};

export default function ProfileCreateScreen({ setProfile, setScreen }: ProfileCreateScreenProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      const profile: StudentProfile = {
        name: trimmedName,
        avatar: selectedAvatar,
        difficultyLevels: defaultDifficultyLevels,
        settings: defaultSettings,
        xp: 0,
        level: 1,
        achievements: [],
      };
      setProfile(profile);
      setScreen('home');
    }
  };

  return (
    <div className="profile-create-screen">
      <div className="profile-header">
        <div className="avatar-preview" aria-hidden="true">{selectedAvatar}</div>
        <div>
          <h1>Create Student Profile</h1>
          <p>
            Set up your student with a name and avatar. The profile starts all operations at Beginner difficulty so practice begins where it should.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <label className="field-label">
          Student Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter student name"
          />
        </label>

        <div className="field-label">
          Choose Avatar:
          <div className="avatar-selection" role="group" aria-label="Avatar selection">
            {avatars.map((avatar) => (
              <button
                key={avatar}
                type="button"
                className={selectedAvatar === avatar ? 'selected' : ''}
                onClick={() => setSelectedAvatar(avatar)}
              >
                {avatar}
              </button>
            ))}
          </div>
        </div>

        <div className="difficulty-preview">
          <h2>Starting Difficulty</h2>
          <div className="difficulty-grid">
            <div>Addition: Beginner</div>
            <div>Subtraction: Beginner</div>
            <div>Multiplication: Beginner</div>
            <div>Division: Beginner</div>
          </div>
        </div>

        <button type="submit" disabled={!name.trim()}>
          {name.trim() ? 'Create Profile' : 'Enter a name'}
        </button>
      </form>
    </div>
  );
}