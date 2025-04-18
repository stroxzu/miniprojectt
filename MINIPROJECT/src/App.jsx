import React, { useState, useEffect } from 'react';
import './App.css';

const themes = {
  happy: ['#FFD700', '#FFA500'],
  default: ['#4a90e2', '#50e3c2'],
};

export default function App() {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState(themes.default);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTheme(themes[mood.toLowerCase()] || themes.default);
  }, [mood]);

  const handleGenerate = async () => {
    if (!mood) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=20`
      );
      const data = await res.json();
      if (data.results.length === 0) {
        setError('No tracks found for this mood.');
      } else {
        setTracks(data.results.slice(0, 6));
      }
    } catch (err) {
      setError('Failed to fetch tracks.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" style={{ '--theme-color1': theme[0], '--theme-color2': theme[1] }}>
      <header className="navbar">
        <div className="logo">Adaptive Mood Playlist</div>
        <div className="navbar-form">
          <input
            type="text"
            placeholder="Enter mood…"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
          />
          <button onClick={handleGenerate}>Generate</button>
        </div>
      </header>

      <main className="main">
        {loading ? (
          <div className="loader">Loading...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : tracks.length === 0 ? (
          <div className="hero">
            <h1>Discover Music by Mood</h1>
            <p>Type a mood above & hit “Generate”</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {tracks.map((track) => (
              <div className="track-card" key={track.trackId}>
                <img
                  src={track.artworkUrl100.replace('100x100', '300x300')}
                  alt={track.trackName}
                  className="track-img"
                />
                <div className="track-info">
                  <h3>{track.trackName}</h3>
                  <p>{track.artistName}</p>
                </div>
                <div className="track-actions">
                  <button>Play</button>
                  <a href={track.trackViewUrl} target="_blank" rel="noreferrer">
                    Listen
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}