import React, { useState, useEffect, useMemo } from "react";
import "./PlayerCSS.css";
import axios from "axios";
import ben1 from "./PlayerFiles/ben1.mp3";
import ben2 from "./PlayerFiles/ben2.mp3";
import ben3 from "./PlayerFiles/ben3.mp3";
import pic from "./PlayerFiles/pic.JPG";

const songs = [ben1, ben2, ben3];

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [songIndex, setSongIndex] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [songbook] = useState(() => songs.map((item) => new Audio(item)));
  //Metadata vars
  const [metadata, setMetadata] = useState(null);
  const [albumArt, setAlbumArt] = useState(null);
  const [time, setTime] = useState(0);
  const songsTitles = [
    "Sa Susunod Na Habang Buhay",
    "Pasalubong",
    "Paninindigan Kita",
  ];
  let track = encodeURIComponent(songsTitles[songIndex]);
  let link = `https://ws.audioscrobbler.com/2.0/?method=album.search&album=${track}&api_key=bccc26978623f3244fbf922ec76f8117&format=json`;
  let song = songbook[songIndex];
  let duration = song.duration;

  function togglePlay(index) {
    songbook[index].paused ? songbook[index].play() : songbook[index].pause();
    setIsPlaying(!songbook[index].paused);
  }

  function playPause() {
    let idx = songIndex;
    togglePlay(idx);
  }

  function nextSong() {
    let idx = songIndex;
    let playing = isPlaying;
    let currentSong = songbook[idx];
    if (playing) {
      currentSong.fastSeek(0);
      currentSong.pause();
    }
    if (idx < songs.length - 1) {
      idx++;
    } else {
      idx = 0;
    }
    setSongIndex(idx);
    togglePlay(idx);
  }

  function prevSong() {
    let idx = songIndex;
    let currentSong = songbook[songIndex];
    let paused = currentSong.paused;
    if (!paused && currentSong.currentTime > 5) {
      currentSong.fastSeek(0);
    } else if (!paused && currentSong.currentTime < 5) {
      currentSong.fastSeek(0);
      currentSong.pause();
      if (idx > 0) {
        idx--;
        togglePlay(idx);
      } else if (idx === 0) {
        idx = 2;
        togglePlay(idx);
      }
    } else if (paused) {
      if (idx > 0) {
        idx--;
        togglePlay(idx);
      } else if (idx === 0) {
        idx = 2;
        togglePlay(idx);
      }
    }
    setSongIndex(idx);
  }

  function SongDuration() {
    setTimeout(() => {
      song.ontimeupdate = () => {
        setTime(song.currentTime);
        setProgressValue((song.currentTime / duration) * 100 + "%");
      };
    }, 900);
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time % 60);
    let secondsStr = seconds < 10 ? "0" + seconds : seconds;

    if (isNaN(duration)) {
      return "";
    }
    let durationMinutes = Math.floor(duration / 60);
    let durationSeconds = Math.floor(duration % 60);
    let durationSecondsStr =
      durationSeconds < 10 ? "0" + durationSeconds : durationSeconds;
    return (
      <div className="duration-wrapper">
        <span id="current-time">{minutes + ":" + secondsStr}</span>
        <span id="duration">{durationMinutes + ":" + durationSecondsStr}</span>
      </div>
    );
  }

  function progressClick(e) {
    const clickedPosition = e.clientX - e.target.getBoundingClientRect().left;
    const totalWidth = e.target.offsetWidth;
    const clickedPercentage = clickedPosition / totalWidth;
    const newTime = clickedPercentage * duration;
    console.log(newTime);
    song.fastSeek(newTime);
    setProgressValue((newTime / duration) * 100 + "%");
  }

  //Metadata hook
  useEffect(() => {
    axios
      .get(link)
      .then((response) => {
        const trackData = response.data.results.albummatches.album[0];
        //Set Metadata
        setMetadata(trackData);
        const formattedAlbumArt = {};
        Object.keys(trackData.image[3]).forEach((key) => {
          const formattedKey = key.replace(/#text/g, "text");
          formattedAlbumArt[formattedKey] = trackData.image[3][key];
        });
        //Set Album Art Data
        setAlbumArt(formattedAlbumArt.text);
        console.log("got metadata");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [songIndex]);

  // Album Art Flipper
  let albumArts = [albumArt, pic];
  const [albumArtIndex, setAlbumArtIndex] = useState(0);
  useEffect(() => {
    const switchArt = () => {
      setAlbumArtIndex((albumArtIndex) => (albumArtIndex + 1) % 2);
    };
    if (isPlaying) {
      const intervalId = setInterval(switchArt, 5000);

      return () => clearInterval(intervalId);
    }
  }, [isPlaying]);

  const AlbumArtComponent = React.memo(({ imageSrc }) => {
    return (
      <div className="img-container">
        <img src={imageSrc} alt="Album Art" />
      </div>
    );
  });

  function GetMetadata() {
    console.log("GetMetadata");
    if (!metadata) {
      return (
        <div className="song-info">
          <div className="img-container">
            <img src={pic} alt="Album Art" />
          </div>
          <h3 id="title">
            <i class="fa-solid fa-spinner"></i>
          </h3>
          <h4 id="artist">
            <i class="fa-solid fa-spinner"></i>
          </h4>
        </div>
      );
    }
    return (
      <div className="song-info">
        <AlbumArtComponent imageSrc={albumArts[albumArtIndex]} />
        <h3 id="title">{metadata.name}</h3>
        <h4 id="artist">{metadata.artist}</h4>
      </div>
    );
  }
  return (
    <div className="player-container">
      <GetMetadata />
      <div className="song-controls">
        <div
          className="progress-container"
          id="progress-container"
          onClick={progressClick}>
          <div
            style={{ width: progressValue }}
            className="progress"
            id="progress"></div>
          <SongDuration />
        </div>
        <div className="player-controls">
          <i
            className="fas fa-backward"
            id="prev"
            title="Previous"
            onClick={prevSong}></i>
          {isPlaying ? (
            <i
              className="fas fa-pause main-button"
              id="play"
              title="Play"
              onClick={playPause}></i>
          ) : (
            <i
              className="fas fa-play main-button"
              id="play"
              title="Play"
              onClick={playPause}></i>
          )}
          <i
            className="fas fa-forward"
            id="next"
            title="Next"
            onClick={nextSong}></i>
        </div>
      </div>
    </div>
  );
}
