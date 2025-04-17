import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const themes = {
  happy:     ['#FFDEE9', '#B5FFFC'],
  sad:       ['#cfd9df', '#e2ebf0'],
  chill:     ['#d4fc79', '#96e6a1'],
  angry:     ['#f093fb', '#f5576c'],
  love:      ['#ffa1c9', '#ff758c'],
  energetic: ['#fddb92', '#d1fdff'],
  default:   ['#ffffff', '#e0e0e0'],
};

export default function App() {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState(themes.default);
  const [tracks, setTracks] = useState([]);
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef();

  // Update gradient theme on mood
  useEffect(() => {
    setTheme(themes[mood.toLowerCase()] || themes.default);
  }, [mood]);

  // Fetch tracks
  const handleSubmit = async e => {
    e.preventDefault();
    if (!mood) return;
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=20`
    );
    const data = await res.json();
    setTracks(data.results.slice(0,6));
    setPlaying(null);
    audioRef.current?.pause();
  };

  // Play/pause preview
  const togglePlay = idx => {
    if (playing === idx) {
      audioRef.current.pause();
      setPlaying(null);
    } else {
      audioRef.current.src = tracks[idx].previewUrl;
      audioRef.current.play();
      setPlaying(idx);
    }
  };

  const isHome = tracks.length === 0;

  return (
    <div
      className="app"
      style={{
        background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})`,
      }}
    >
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo">Adaptive Mood Playlist Generator</div>
        </div>
      </nav>

      {/* Main Area */}
      <main className={isHome ? 'hero-area' : 'content-area'}>
        {isHome ? (
          <div className="hero-card">
            <h1>Find Your Mood → Hear The Music</h1>
            <form onSubmit={handleSubmit} className="search-form">
              <input
                type="text"
                placeholder="Type a mood (happy, sad, chill...)"
                value={mood}
                onChange={e => setMood(e.target.value)}
                required
              />
              <button type="submit">Generate</button>
            </form>
          </div>
        ) : (
          <>
            <div className="search-bar-wrapper">
              <form onSubmit={handleSubmit} className="search-form">
                <input
                  type="text"
                  placeholder="Search another mood..."
                  value={mood}
                  onChange={e => setMood(e.target.value)}
                  required
                />
                <button type="submit">Go</button>
              </form>
            </div>
            <div className="playlist-grid">
              {tracks.map((t, i) => (
                <div className="track-card" key={t.trackId}>
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
                      {playing === i ? '⏸ Pause' : '▶ Play'}
                    </button>
                    <a href={t.trackViewUrl} target="_blank" rel="noreferrer">
                      Listen
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <audio ref={audioRef} />

      {!isHome && (
        <footer className="footer">
          <p>© 2025 Adaptive Mood Playlist Generator</p>
        </footer>
      )}
    </div>
  );
}
