// src/App.jsx
import React, { useState } from "react";
import { moodData } from "./moods";
import "./App.css";

function App() {
  const [mood, setMood] = useState("");
  const [activeMood, setActiveMood] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const key = mood.toLowerCase().trim();
    if (moodData[key]) {
      setActiveMood(moodData[key]);
    } else {
      setActiveMood(null);
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: activeMood
          ? `url(${activeMood.backgroundImage})`
          : "linear-gradient(to right, #fff, #eee)",
        backgroundColor: activeMood?.theme || "#fff",
        color: activeMood?.text || "#333",
      }}
    >
      <h1>Mood-Based Playlist 🎧</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter your mood (happy, sad, chill, angry)..."
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />
        <br />
        <button type="submit">Generate Playlist</button>
      </form>

      {activeMood ? (
        <div className="playlist">
          <h2>Playlist for "{mood}" mood</h2>
          {activeMood.playlist.map((song, index) => (
            <a key={index} href={song.link} target="_blank" rel="noreferrer">
              🎵 {song.title}
            </a>
          ))}
        </div>
      ) : (
        <p style={{ marginTop: "2rem" }}>
          Enter a mood like <strong>happy</strong>, <strong>sad</strong>, <strong>chill</strong>, or <strong>angry</strong>.
        </p>
      )}
    </div>
  );
}

export default App;
