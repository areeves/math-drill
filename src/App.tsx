import { useState, useEffect } from 'react';
import { StudentProfile, Session, Screen } from './types';
import { loadProfile, loadSessions, saveProfile, saveSessions } from './utils';
import HomeScreen from './components/HomeScreen';
import ProfileCreateScreen from './components/ProfileCreateScreen';
import DrillScreen from './components/DrillScreen';
import SummaryScreen from './components/SummaryScreen';
import DashboardScreen from './components/DashboardScreen';
import './App.css';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadedProfile = loadProfile();
    const loadedSessions = loadSessions();
    setProfile(loadedProfile);
    setSessions(loadedSessions);
  }, []);

  const updateProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    saveProfile(newProfile);
  };

  const addSession = (session: Session) => {
    const newSessions = [...sessions, session];
    setSessions(newSessions);
    saveSessions(newSessions);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen profile={profile} setScreen={setScreen} />;
      case 'profile-create':
        return <ProfileCreateScreen setProfile={updateProfile} setScreen={setScreen} />;
      case 'drill':
        return profile ? <DrillScreen profile={profile} addSession={addSession} setScreen={setScreen} /> : null;
      case 'summary':
        return <SummaryScreen setScreen={setScreen} />;
      case 'dashboard':
        return <DashboardScreen profile={profile} sessions={sessions} setScreen={setScreen} />;
      default:
        return <HomeScreen profile={profile} setScreen={setScreen} />;
    }
  };

  return (
    <div className="app">
      {renderScreen()}
    </div>
  );
}

export default App;
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
