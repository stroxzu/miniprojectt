import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const moodThemes = {
  happy:   { gradient: ['#ff9a9e','#fad0c4'], text: '#333' },
  sad:     { gradient: ['#a1c4fd','#c2e9fb'], text: '#333' },
  chill:   { gradient: ['#d4fc79','#96e6a1'], text: '#333' },
  angry:   { gradient: ['#f77062','#fe5196'], text: '#fff' },
  love:    { gradient: ['#ffafbd','#ffc3a0'], text: '#333' },
  energetic:{gradient: ['#f6d365','#fda085'], text: '#333' },
};

export default function App() {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState({ gradient: ['#fff','#eee'], text: '#333' });
  const [tracks, setTracks] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [dark, setDark] = useState(false);
  const audioRef = useRef();

  // Update theme when mood or dark mode changes
  useEffect(() => {
    const key = mood.toLowerCase().trim();
    if (moodThemes[key]) {
      setTheme(moodThemes[key]);
    } else {
      setTheme({ gradient: ['#fff','#eee'], text: dark ? '#fff' : '#333' });
    }
  }, [mood, dark]);

  // Fetch random set of songs from iTunes
  const handleSubmit = async e => {
    e.preventDefault();
    if (!mood) return;
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=10`
    );
    const { results } = await res.json();
    // shuffle & pick 6
    const shuffled = results.sort(() => 0.5 - Math.random()).slice(0,6);
    setTracks(shuffled);
    setPlaying(null);
    audioRef.current?.pause();
  };

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

  return (
    <div
      className={`app-container ${dark ? 'dark' : ''}`}
      style={{
        background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
        color: theme.text,
      }}
    >
      <header className="header">
        <h1>Mood Based Playlist</h1>
        <button onClick={() => setDark(!dark)} className="darkmode-btn">
          {dark ? '🌞 Light' : '🌙 Dark'}
        </button>
      </header>

      <form onSubmit={handleSubmit} className="mood-form">
        <input
          value={mood}
          onChange={e => setMood(e.target.value)}
          placeholder="Enter your mood..."
        />
        <button type="submit">Generate</button>
      </form>

      <div className="playlist">
        {tracks.length ? tracks.map((t, i) => (
          <div className="track-card" key={i}>
            <img
              src={t.artworkUrl100.replace('100x100','300x300')}
              alt={t.trackName}
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
        )) : (
          <p className="no-track">No songs yet—try a mood above.</p>
        )}
      </div>

      <audio ref={audioRef} />

      <footer>
        <p>© 2025 Mood Based Playlist</p>
      </footer>
    </div>
  );
}
