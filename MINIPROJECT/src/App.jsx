import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const moodThemes = {
  happy:     { gradient: ['#FFDEE9','#B5FFFC'], text: '#333' },
  sad:       { gradient: ['#cfd9df','#e2ebf0'], text: '#333' },
  chill:     { gradient: ['#d4fc79','#96e6a1'], text: '#333' },
  angry:     { gradient: ['#f093fb','#f5576c'], text: '#fff' },
  love:      { gradient: ['#ffa1c9','#ff758c'], text: '#fff' },
  energetic: { gradient: ['#fddb92','#d1fdff'], text: '#333' },
};

const vibeGradients = [
  'linear-gradient(135deg, #f6d365, #fda085)',
  'linear-gradient(135deg, #ff9a9e, #fad0c4)',
  'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(135deg, #84fab0, #8fd3f4)',
  'linear-gradient(135deg, #fccb90, #d57eeb)',
  'linear-gradient(135deg, #cfd9df, #e2ebf0)',
];

export default function App() {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState({ gradient: ['#fff','#eee'], text: '#333' });
  const [tracks, setTracks] = useState([]);
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef();

  // Update theme on mood change
  useEffect(() => {
    const key = mood.toLowerCase().trim();
    setTheme(moodThemes[key] || { gradient: ['#fff','#eee'], text: '#333' });
  }, [mood]);

  // Fetch & shuffle from iTunes
  const handleSubmit = async e => {
    e.preventDefault();
    if (!mood) return;
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=20`
    );
    const data = await res.json();
    const shuffled = data.results.sort(() => 0.5 - Math.random()).slice(0, 6);
    setTracks(shuffled);
    setPlaying(null);
    audioRef.current?.pause();
  };

  // Play/pause
  const togglePlay = idx => {
    if (!audioRef.current) return;
    if (playing === idx) {
      audioRef.current.pause();
      setPlaying(null);
    } else {
      audioRef.current.src = tracks[idx].previewUrl;
      audioRef.current.play();
      setPlaying(idx);
    }
  };

  const isHome = tracks.length === 0 && !mood;

  return (
    <div
      className={`app-container ${isHome ? 'hero' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
        color: theme.text,
      }}
    >
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="logo">MoodGenius</div>
          {/* Dark mode, if you want */}
        </div>
      </nav>

      {/* Main Content */}
      <main className={`main-content ${isHome ? 'home-content' : ''}`}>
        <div className={`card ${isHome ? 'card-hero' : ''}`}>
          <h1 className="title">Mood Playlist Generator</h1>

          <form onSubmit={handleSubmit} className="mood-form">
            <input
              type="text"
              placeholder="Type a mood (happy, sad, chill...)"
              value={mood}
              onChange={e => setMood(e.target.value)}
            />
            <button type="submit">Generate</button>
          </form>

          {!isHome && (
            <div className="playlist">
              {tracks.map((t, i) => (
                <div
                  className="track-card"
                  key={t.trackId}
                  style={{ background: vibeGradients[i % vibeGradients.length] }}
                >
                  <img
                    src={t.artworkUrl100.replace('100x100','300x300')}
                    alt={t.trackName}
                    className="track-img"
                  />
                  <div className="track-info">
                    <h3>{t.trackName}</h3>
                    <p>{t.artistName}</p>
                  </div>
                  <div className="track-actions">
                    <button onClick={() => togglePlay(i)}>
                      {playing === i ? '⏸️' : '▶️'}
                    </button>
                    <a href={t.trackViewUrl} target="_blank" rel="noreferrer">
                      Listen
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Audio Player */}
      <audio ref={audioRef} />

      {/* Footer */}
      {!isHome && (
        <footer className="footer">
          <p>© 2025 MoodGenius. All rights reserved.</p>
        </footer>
      )}
    </div>
  );
}
