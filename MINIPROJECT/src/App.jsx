import React, { useState, useRef } from "react";
import "./App.css";

const defaultPlaylists = {
  happy: [
    {
      title: "Sunshine Vibes",
      artist: "The Brights",
      cover: "happy1.jpg",
      audio: "song1.mp3",
    },
    {
      title: "Feel Good Flow",
      artist: "Joy ",
      cover: "happy2.jpg",
      audio: "song2.mp3",
    },
  ],
  sad: [
    {
      title: "Blue Rain",
      artist: "Mellow Tones",
      cover: "sad1.jpg",
      audio: "song3.mp3",
    },
    {
      title: "Echoes of Silence",
      artist: "Lonely Strings",
      cover: "sad2.jpg",
      audio: "song4.mp3",
    },
  ],
  chill: [
    {
      title: "Night Drive",
      artist: "LoFi Wave",
      cover: "chill1.jpeg",
      audio: "song5.mp3",
    },
    {
      title: "Cloud Surfing",
      artist: "Dreamstate",
      cover: "chill2.jpeg",
      audio: "song6.mp3",
    },
  ],
  calm:[
    {
      title:"lofi beat",
      artist:"jason",
      cover:"calm1.jpg",
      audio:"testingsong.mp3",
    }
  ]
};

function App() {
  const [mood, setMood] = useState("");
  const [playlist, setPlaylist] = useState([]);
  const [customPlaylists, setCustomPlaylists] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [customMood, setCustomMood] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songCover, setSongCover] = useState("");
  const [songAudio, setSongAudio] = useState("");

  // Audio player setup
  const audioRef = useRef(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  // Generate the playlist: custom songs override defaults if present
  const handleSubmit = (e) => {
    e.preventDefault();
    const lowerMood = mood.toLowerCase().trim();
    if (!lowerMood) return;

    const custom = customPlaylists[lowerMood] || [];
    const def = defaultPlaylists[lowerMood] || [];
    const combined = custom.length ? custom : def;
    setPlaylist(combined);
    // Stop any currently playing track
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayingIndex(null);
    }
  };

  // Toggle custom playlist modal submission
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const lowerMood = customMood.toLowerCase().trim();
    if (!lowerMood) return;
    
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

    // Reset form
    setCustomMood("");
    setSongTitle("");
    setSongArtist("");
    setSongCover("");
    setSongAudio("");
    setShowModal(false);
  };

  // Handle playing and pausing songs on card
  const playPauseTrack = (index) => {
    if (audioRef.current) {
      if (playingIndex === index) {
        audioRef.current.pause();
        setPlayingIndex(null);
      } else {
        // Change audio source and play
        audioRef.current.src = playlist[index].audio;
        audioRef.current.play();
        setPlayingIndex(index);
      }
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <h2>Mood Based Playlist</h2>
      </header>

      <main className="container">
        <h1>Mood Playlist Generator 🎶</h1>
        <form onSubmit={handleSubmit} className="mood-form">
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="Enter your mood (happy, sad, chill)..."
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
                <button onClick={() => playPauseTrack(index)}>
                  {playingIndex === index ? "⏸️ Pause" : "▶️ Play"}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">
            No playlist found for this mood. Try a different mood or create one!
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

      {/* Hidden audio element */}
      <audio ref={audioRef} />

      
    </div>
  );
}

export default App;
