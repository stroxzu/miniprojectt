import { useState } from "react";
import "./App.css";

const defaultPlaylists = {
  happy: [
    {
      title: "Sunshine Vibes",
      artist: "The Brights",
      cover: "happy1.jpg",
      audio: "song1.mp3"
    },
    {
      title: "Feel Good Flow",
      artist: "Joy Ride",
      cover: "happy2.jpg",
      audio: "song2.mp3"
    },
  ],
  sad: [
    {
      title: "Blue Rain",
      artist: "Mellow Tones",
      cover: "sad1.jpg",
      audio: "song3.mp3"
    },
    {
      title: "Echoes of Silence",
      artist: "Lonely Strings",
      cover: "sad2.jpg",
      audio: "song4.mp3"
    },
  ],
  chill: [
    {
      title: "Night Drive",
      artist: "LoFi Wave",
      cover: "chill1.jpg",
      audio: "song5.mp3"
    },
    {
      title: "Cloud Surfing",
      artist: "Dreamstate",
      cover: "chill2.jpg",
      audio: "song6.mp3"
    },
  ],
};

function App() {
  // State for mood and playlist display
  const [mood, setMood] = useState("");
  const [playlist, setPlaylist] = useState([]);
  
  // State for custom playlists (each mood can have custom songs)
  const [customPlaylists, setCustomPlaylists] = useState({});
  
  // Modal state for custom playlist creation
  const [showModal, setShowModal] = useState(false);
  
  // Custom playlist form states
  const [customMood, setCustomMood] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songCover, setSongCover] = useState("");
  const [songAudio, setSongAudio] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const lowerMood = mood.toLowerCase();
    // Check for custom songs first; if none, use default
    const custom = customPlaylists[lowerMood] || [];
    const def = defaultPlaylists[lowerMood] || [];
    const combined = custom.length ? custom : def;
    setPlaylist(combined);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const lowerMood = customMood.toLowerCase();
    const newSong = {
      title: songTitle,
      artist: songArtist,
      cover: songCover,
      audio: songAudio,
    };

    setCustomPlaylists((prev) => {
      const prevSongs = prev[lowerMood] || [];
      return { ...prev, [lowerMood]: [...prevSongs, newSong] };
    });
    
    // Reset custom playlist form states
    setCustomMood("");
    setSongTitle("");
    setSongArtist("");
    setSongCover("");
    setSongAudio("");
    setShowModal(false);
  };

  return (
    <div className="app">
      {/* Fixed Header */}
      <header className="header">
        <h2>Mood Maestro</h2>
      </header>

      <main className="container">
        <h1>Mood Playlist Generator 🎶</h1>
        <form onSubmit={handleSubmit} className="mood-form">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Type your mood..."
          />
          <button type="submit">Generate</button>
        </form>

        <button className="custom-btn" onClick={() => setShowModal(true)}>
          Create Custom Playlist
        </button>

        {playlist.length > 0 ? (
          <div className="playlist">
            {playlist.map((song, index) => (
              <div className="song-card" key={index}>
                <img src={song.cover} alt={song.title} />
                <h3>{song.title}</h3>
                <p>{song.artist}</p>
                {song.audio && (
                  <audio controls>
                    <source src={song.audio} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">
            No playlist found for this mood. Try another mood or create one!
          </p>
        )}
      </main>

      {/* Custom Playlist Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create Custom Playlist</h2>
            <form onSubmit={handleCustomSubmit} className="custom-form">
              <input
                type="text"
                value={customMood}
                onChange={(e) => setCustomMood(e.target.value)}
                placeholder="Enter mood..."
                required
              />
              <input
                type="text"
                value={songTitle}
                onChange={(e) => setSongTitle(e.target.value)}
                placeholder="Song Title"
                required
              />
              <input
                type="text"
                value={songArtist}
                onChange={(e) => setSongArtist(e.target.value)}
                placeholder="Artist Name"
                required
              />
              <input
                type="text"
                value={songCover}
                onChange={(e) => setSongCover(e.target.value)}
                placeholder="Cover Image Filename (e.g., sorrow.jpeg)"
                required
              />
              <input
                type="text"
                value={songAudio}
                onChange={(e) => setSongAudio(e.target.value)}
                placeholder="Audio Filename (e.g., song7.mp3)"
                required
              />
              <button type="submit">Add Song</button>
            </form>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Mood Maestro. Built by Taronaldo.</p>
      </footer>
    </div>
  );
}

export default App;
