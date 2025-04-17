import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const moodThemes = {
  happy:     { gradient: ['#FFDEE9', '#B5FFFC'], text: '#333' },
  sad:       { gradient: ['#cfd9df', '#e2ebf0'], text: '#333' },
  chill:     { gradient: ['#d4fc79', '#96e6a1'], text: '#333' },
  angry:     { gradient: ['#f093fb', '#f5576c'], text: '#fff' },
  love:      { gradient: ['#ffa1c9', '#ff758c'], text: '#fff' },
  energetic: { gradient: ['#fddb92', '#d1fdff'], text: '#333' },
};

export default function App() {
  const [mood, setMood] = useState('');
  const [theme, setTheme] = useState({ gradient: ['#fff', '#eee'], text: '#333' });
  const [tracks, setTracks] = useState([]);
  const [playing, setPlaying] = useState(null);
  const audioRef = useRef();

  // Update theme whenever mood changes
  useEffect(() => {
    const key = mood.toLowerCase().trim();
    setTheme(moodThemes[key] || { gradient: ['#fff', '#eee'], text: '#333' });
  }, [mood]);

  // Fetch & shuffle tracks from iTunes
  const handleSubmit = async e => {
    e.preventDefault();
    if (!mood) return;
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(mood)}&media=music&limit=20`
      );
      const data = await res.json();
      const shuffled = data.results.sort(() => 0.5 - Math.random()).slice(0, 6);
      setTracks(shuffled);
      setPlaying(null);
      audioRef.current?.pause();
    } catch (err) {
      console.error(err);
      setTracks([]);
    }
  };

  // Play/pause preview
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
      className="app-container"
      style={{
        background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
        color: theme.text,
      }}
    >
      <div className="card">
        <h1>Mood Playlist Generator</h1>

        <form onSubmit={handleSubmit} className="mood-form">
          <input
            type="text"
            placeholder="Type a mood (happy, sad, chill...)"
            value={mood}
            onChange={e => setMood(e.target.value)}
          />
          <button type="submit">Generate</button>
        </form>

        <div className="playlist">
          {tracks.length > 0 ? (
            tracks.map((t, i) => (
              <div className="track-card" key={t.trackId}>
                <img src={t.artworkUrl100.replace('100x100','300x300')} alt={t.trackName} />
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
            ))
          ) : (
            <p className="no-track">Enter a mood and press “Generate” to see tracks.</p>
          )}
        </div>
      </div>

      <audio ref={audioRef} />

      <footer>
        <p>© 2025 Mood Playlist Generator</p>
      </footer>
    </div>
  );
}
