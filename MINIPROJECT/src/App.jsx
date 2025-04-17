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

  // Update gradient theme on mood change
  useEffect(() => {
    setTheme(themes[mood.toLowerCase()] || themes.default);
  }, [mood]);

  // Fetch & display 6 songs
  const handleSubmit = async e => {
    e.preventDefault();
    if (!mood) return;
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=20`
    );
    const data = await res.json();
    setTracks(data.results.slice(0, 6));
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

  return (
    <div
      className="app"
      style={{
        background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})`,
      }}
    >
      {/* Navbar with persistent search */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="logo">Adaptive Mood Playlist Generator</div>
          <form onSubmit={handleSubmit} className="navbar-form">
            <input
              type="text"
              placeholder="Enter mood…"
              value={mood}
              onChange={e => setMood(e.target.value)}
              required
            />
            <button type="submit">Generate</button>
          </form>
        </div>
      </header>

      {/* Main content area */}
      <main className="main">
        {tracks.length === 0 ? (
          <div className="hero">
            <h1>Discover Music by Mood</h1>
            <p>Type a mood above & hit “Generate”</p>
          </div>
        ) : (
          <div className="playlist-grid">
            {tracks.map((track, i) => (
              <div className="track-card" key={track.trackId}>
                <img
                  src={track.artworkUrl100.replace('100x100','300x300')}
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

      <audio ref={audioRef} />

      {/* Footer */}
      {tracks.length > 0 && (
        <footer className="footer">
          <p>© 2025 Adaptive Mood Playlist Generator</p>
        </footer>
      )}
    </div>
  );
}
