import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const themes = {
  happy: ['#FFD700', '#FFA500'],
  sad: ['#87CEEB', '#4682B4'],
  chill: ['#32CD32', '#00FA9A'],
  angry: ['#FF4500', '#8B0000'],
  love: ['#FF69B4', '#FF1493'],
  energetic: ['#9400D3', '#4B0082'],
  default: ['#4a90e2', '#50e3c2'],
};

export default function App() {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState(themes.default);
  const [tracks, setTracks] = useState([]);
  const [playing, setPlaying] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(new Audio());

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
      setError('Failed to fetch tracks. Please try again.');
    } finally {
      setLoading(false);
      setPlaying(null);
      audioRef.current?.pause();
    }
  };

  const togglePlay = (idx) => {
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
            {tracks.map((track, i) => (
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
                  <button onClick={() => togglePlay(i)}>
                    {playing === i ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <a href={track.trackViewUrl} target="_blank" rel="noreferrer">
                    Listen
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {tracks.length > 0 && (
        <footer className="footer">
          <p>© 2025 Adaptive Mood Playlist</p>
        </footer>
      )}
    </div>
  );
}