// App.jsx
import React, { useState } from "react";
import { moodData } from "./moods";
import "./App.css";

function App() {
  const [mood, setMood] = useState("");
  const [activeMood, setActiveMood] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = mood.toLowerCase().trim();
    setActiveMood(moodData[key] || null);
  };

  const backgroundStyle = activeMood
    ? {
        backgroundImage: `url(${activeMood.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {};

  return (
    <div className="app-container" style={backgroundStyle}>
      <div className="card">
        <h1>Mood Playlist Generator 🎶</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Type your mood (happy, sad, chill...)"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
          <button type="submit">Generate</button>
        </form>

        {activeMood && (
          <div className="playlist">
            <h2>🎧 Playlist for "{mood}"</h2>
            {activeMood.playlist.map((song, index) => (
              <a
                key={index}
                href={song.link}
                className="song-link"
                target="_blank"
                rel="noreferrer"
              >
                {song.title}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
