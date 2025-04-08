import { useState } from "react";
import "./App.css";

const defaultPlaylists = {
  happy: [
    { title: "Sunshine Vibes", artist: "The Brights", cover: "happy1.jpg" },
    { title: "Feel Good Flow", artist: "Joy Ride", cover: "happy2.jpg" },
  ],
  sad: [
    { title: "Blue Rain", artist: "Mellow Tones", cover: "sad1.jpg" },
    { title: "Echoes of Silence", artist: "Lonely Strings", cover: "sad2.jpg" },
  ],
  chill: [
    { title: "Night Drive", artist: "LoFi Wave", cover: "chill1.jpg" },
    { title: "Cloud Surfing", artist: "Dreamstate", cover: "chill2.jpg" },
  ],
};

function App() {
  // State for mood input and playlist to display
  const [mood, setMood] = useState("");
  const [playlist, setPlaylist] = useState([]);
  // State to hold custom playlists (each mood maps to an array of songs)
  const [customPlaylists, setCustomPlaylists] = useState({});
  // Toggle for the custom playlist modal
  const [showModal, setShowModal] = useState(false);
  // State for custom playlist form inputs
  const [customMood, setCustomMood] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songCover, setSongCover] = useState("");

  // Handle mood submission to generate playlist (custom takes precedence)
  const handleSubmit = (e) => {
    e.preventDefault();
    const lowerMood = mood.toLowerCase();
    const custom = customPlaylists[lowerMood] || [];
    const def = defaultPlaylists[lowerMood] || [];
    // Combine custom and default playlists (custom first if available)
    const combined = custom.length ? custom : def;
    setPlaylist(combined);
  };

  // Handle custom playlist submission
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const lowerMood = customMood.toLowerCase();
    // Create a new song object from the form values
    const newSong = {
      title: songTitle,
      artist: songArtist,
      cover: songCover,
    };
    // Merge with any existing custom songs for that mood
    setCustomPlaylists((prev) => {
      const prevSongs = prev[lowerMood] || [];
      return { ...prev, [lowerMood]: [...prevSongs, newSong] };
    });
    // Reset custom form state and close modal
    setCustomMood("");
    setSongTitle("");
    setSongArtist("");
    setSongCover("");
    setShowModal(false);
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Mood Playlist Generator 🎵</h1>
        <form onSubmit={handleSubmit} className="mood-form">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Enter your mood..."
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
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">
            No playlist found for this mood. Try another mood or create a custom
            one.
          </p>
        )}
      </div>

      {/* Modal for Custom Playlist */}
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
                placeholder="Cover Image URL (in public folder)"
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
    </div>
  );
}

export default App;
