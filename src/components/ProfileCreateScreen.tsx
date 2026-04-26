import { useState } from 'react';
import type { StudentProfile, Screen } from '../types';

interface ProfileCreateScreenProps {
  setProfile: (profile: StudentProfile) => void;
  setScreen: (screen: Screen) => void;
}

const avatars = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

export default function ProfileCreateScreen({ setProfile, setScreen }: ProfileCreateScreenProps) {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(avatars[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const profile: StudentProfile = {
        name: name.trim(),
        avatar: selectedAvatar,
        difficultyLevels: { add: 1, sub: 1, mul: 1, div: 1 }
      };
      setProfile(profile);
      setScreen('home');
    }
  };

  return (
    <div className="profile-create-screen">
      <h1>Create Your Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Choose Avatar:
          <div className="avatar-selection">
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
        </label>
        <button type="submit">Create Profile</button>
      </form>
    </div>
  );
}