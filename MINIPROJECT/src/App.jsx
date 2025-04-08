import { useState } from "react";
import "./App.css";

const playlists = {
  happy: [
    { title: "Sunshine Vibes", artist: "The Brights", cover: "/happy1.jpg" },
    { title: "Feel Good Flow", artist: "Joy Ride", cover: "/happy2.jpg" },
  ],
  sad: [
    { title: "Blue Rain", artist: "Mellow Tones", cover: "/sad1.jpg" },
    { title: "Echoes of Silence", artist: "Lonely Strings", cover: "/sad2.jpg" },
  ],
  chill: [
    { title: "Night Drive", artist: "LoFi Wave", cover: "/chill1.jpg" },
    { title: "Cloud Surfing", artist: "Dreamstate", cover: "/chill2.jpg" },
  ],
};

function App() {
  const [mood, setMood] = useState("");
  const [playlist, setPlaylist] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = playlists[mood.toLowerCase()];
    setPlaylist(found || []);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Mood Playlist Generator 🎵</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Enter your mood..."
          />
          <button type="submit">Generate</button>
        </form>

        {playlist.length > 0 ? (
          <div className="playlist">
            {playlist.map((song, index) => (
              <div className="song-card" key={index}>
                <img src={song.cover} alt={song.title} />
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No playlist found for this mood.</p>
        )}
      </div>
    </div>
  );
}

export default App;
