import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const themes = {
  happy: ['#FFDEE9', '#B5FFFC'],
  sad: ['#cfd9df', '#e2ebf0'],
  chill: ['#d4fc79', '#96e6a1'],
  angry: ['#f093fb', '#f5576c'],
  love: ['#ffa1c9', '#ff758c'],
  energetic: ['#fddb92', '#d1fdff'],
  default: ['#ffffff', '#e0e0e0'],
};

export default function App() {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState(themes.default);
  const [tracks, setTracks] = useState([]);
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef();

  useEffect(() => {
    const lowerMood = mood.toLowerCase();
    setTheme(themes[lowerMood] || themes.default);
  }, [mood]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=10`
    );
    const data = await res.json();
    setTracks(data.results);
    setPlaying(null);
    audioRef.current?.pause();
  };

  const playPreview = (track, index) => {
    if (playing === index) {
      audioRef.current.pause();
      setPlaying(null);
    } else {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play();
      setPlaying(index);
    }
  };

  return (
    <div
      className="app"
      style={{
        background: `linear-gradient(135deg, ${theme[0]}, ${theme[1]})`,
        minHeight: '100vh',
      }}
    >
      <header className="header">
        <h1>Adaptive Mood Playlist Generator</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your mood (e.g. happy, chill)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            required
          />
          <button type="submit">Generate</button>
        </form>
      </header>

      <main className="playlist">
        {tracks.map((track, i) => (
          <div className="card" key={track.trackId}>
            <img src={track.artworkUrl100} alt={track.trackName} />
            <h3>{track.trackName}</h3>
            <p>{track.artistName}</p>
            <div className="actions">
              <button onClick={() => playPreview(track, i)}>
                {playing === i ? '⏸ Pause' : '▶ Play'}
              </button>
              <a href={track.trackViewUrl} target="_blank" rel="noopener noreferrer">
                Listen on Apple Music
              </a>
            </div>
          </div>
        ))}
        <audio ref={audioRef} />
      </main>

      <footer className="footer">
        <p>🎧 Made with ❤️ - Adaptive Mood Playlist Generator © 2025</p>
      </footer>
    </div>
  );
}
