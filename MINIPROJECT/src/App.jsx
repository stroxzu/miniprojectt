import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [mood, setMood] = useState("");
  const [tracks, setTracks] = useState([]);
  const audioRef = useRef(null);
  const [playingIndex, setPlayingIndex] = useState(null);

  const fetchSongs = async () => {
    if (!mood) return;
    const response = await fetch(`https://api.deezer.com/search?q=${mood}&output=jsonp`, {
      method: "GET",
      mode: "no-cors"
    });
    // JSONP doesn't work directly in fetch; we'll use a workaround in a moment
  };

  // Using JSONP because Deezer doesn't support CORS — workaround below

  useEffect(() => {
    if (mood) {
      const script = document.createElement("script");
      script.src = `https://api.deezer.com/search?q=${mood}&output=jsonp&callback=handleResult`;
      document.body.appendChild(script);

      window.handleResult = function (data) {
        setTracks(data.data.slice(0, 6));
      };
    }
  }, [mood]);

  const playPauseTrack = (index) => {
    if (audioRef.current) {
      if (playingIndex === index) {
        audioRef.current.pause();
        setPlayingIndex(null);
      } else {
        audioRef.current.src = tracks[index].preview;
        audioRef.current.play();
        setPlayingIndex(index);
      }
    }
  };

  return (
    <div className="App">
      <h1>Mood-Based Playlist 🎧</h1>
      <input
        type="text"
        placeholder="Enter your mood (e.g. happy, sad, romantic)"
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") setMood(e.target.value);
        }}
      />
      <div className="playlist">
        {tracks.map((track, index) => (
          <div className="track" key={track.id}>
            <img src={track.album.cover_medium} alt="Album" />
            <div className="info">
              <h3>{track.title}</h3>
              <p>{track.artist.name}</p>
            </div>
            <button onClick={() => playPauseTrack(index)}>
              {playingIndex === index ? "⏸️" : "▶️"}
            </button>
          </div>
        ))}
      </div>
      <audio ref={audioRef} />
    </div>
  );
}

export default App;
