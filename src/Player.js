import { useState, useEffect} from 'react';
import './PlayerCSS.css';
import axios from 'axios';
import ben1 from './PlayerFiles/ben1.mp3';
import ben2 from './PlayerFiles/ben2.mp3';
import ben3 from './PlayerFiles/ben3.mp3';
import pic from './PlayerFiles/pic.JPG';



const songs = [ben1,ben2,ben3];
  
  export default function Player() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songIndex, setSongIndex] = useState(0);
    const [progressValue, setProgressValue] = useState(0);
    const [songbook] = useState(() => 
      songs.map(item => new Audio(item)));
    //Metadata vars
    const [metadata,setMetadata] = useState(null);
    const [albumArt, setAlbumArt] = useState(null);
    const songsTitles = ['Sa Susunod Na Habang Buhay', 'Pasalubong', 'Paninindigan Kita'];
    let track= encodeURIComponent(songsTitles[songIndex]);
    let link = "https://ws.audioscrobbler.com/2.0/?method=album.search&album="+track+"&api_key=bccc26978623f3244fbf922ec76f8117&format=json";


    function togglePlay(index) {
      songbook[index].paused ? songbook[index].play() : songbook[index].pause();
      setIsPlaying(!songbook[index].paused);
      }

    function playPause(){
      let idx = songIndex;
      togglePlay(idx);
    }
    
    function nextSong() {
      let idx = songIndex;
      let playing = isPlaying;
      let currentSong = songbook[idx];
      if (playing){
        currentSong.fastSeek(0);
        currentSong.pause();
      }
      if (idx < songs.length - 1) {
        idx++;
      }
      else{
        idx = 0;
      }
      setSongIndex(idx);
      togglePlay(idx);
    }
    
    function prevSong() {
      let idx = songIndex;
      let currentSong = songbook[songIndex];
      let paused = currentSong.paused;
      if (!paused && currentSong.currentTime > 5){
        currentSong.fastSeek(0);
      }
      else if (!paused && currentSong.currentTime < 5){
        currentSong.fastSeek(0);
        currentSong.pause();
        if (idx > 0){
          idx--;
          togglePlay(idx);
        }
        else if (idx === 0){
          idx = 2;
          togglePlay(idx)
        }
      }
      else if (paused){
        if (idx > 0){
          idx--;
          togglePlay(idx);
        }
        else if (idx === 0){
          idx = 2;
          togglePlay(idx)
        }
      }
      setSongIndex(idx);
    }

    //Song Duration hook
    let song = songbook[songIndex];
    const [time, setTime] = useState(0);
    useEffect(() => {
      setTimeout(() =>
      setTime(song.currentTime),500);
      setProgressValue((song.currentTime/song.duration)*100+'%');
    })

    function SongDuration() {
      let minutes = Math.floor(time/60);
      let seconds = Math.floor(time%60);
      let secondsStr = seconds < 10 ? '0' + seconds : seconds;
      let duration = song.duration;

      if (isNaN(duration)) {return ''}
      let durationMinutes = Math.floor(duration / 60);
      let durationSeconds = Math.floor(duration % 60);
      let durationSecondsStr = durationSeconds < 10 ? '0' + durationSeconds : durationSeconds;

      return(
        <div className="duration-wrapper">
          <span id="current-time">{minutes +':'+ secondsStr}</span>
          <span id="duration">{durationMinutes + ':' + durationSecondsStr}</span>
        </div>
      );
    }

    function progressClick(e){
      let song = songbook[songIndex];
      let duration = song.duration;
      const clickedPosition = e.clientX - e.target.getBoundingClientRect().left;
      const totalWidth = e.target.offsetWidth;
      const clickedPercentage = clickedPosition / totalWidth;
      const newTime = clickedPercentage * duration;
      console.log(newTime);
      song.fastSeek(newTime);
      setProgressValue((newTime/duration)*100+'%');
    }

    //Metadata hook
    useEffect(() => {
      axios.get(link)
        .then(response => {
          const trackData = response.data.results.albummatches.album[0];
          setMetadata(trackData);
          const formattedAlbumArt = {};
          Object.keys(trackData.image[3]).forEach(key => {
            const formattedKey = key.replace(/#text/g, 'text');
            formattedAlbumArt[formattedKey] = trackData.image[3][key];
          });
          setAlbumArt(formattedAlbumArt.text);
          console.log("got metadata");
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    }, [songIndex]);

    function GetMetadata(){
      // console.log(metadata);
      // console.log(albumArt);
      if (!metadata){
        return(
          <div className="song-info">
          <div className="img-container">
              <img 
              // src='https://i.discogs.com/LlZf8xLqkKFcSYOqJ3hlEVF-OoPXQijxJsYq7mh4K_A/rs:fit/g:sm/q:90/h:600/w:600/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTIwMDM0/OTY3LTE2MzAyMjI2/MzItNzY0Ni5qcGVn.jpeg' 
              src={pic}
              alt="Album Art"/>
          </div>
          <h3 id="title"><i class="fa-solid fa-spinner"></i></h3>
          <h4 id="artist"><i class="fa-solid fa-spinner"></i></h4>
        </div>
        );
      }
      return(
        <div className="song-info">
          <div className="img-container">
              <img src={albumArt} alt="Album Art"/>
          </div>
          <h3 id="title">{metadata.name}</h3>
          <h4 id="artist">{metadata.artist}</h4>
        </div>
      );
    }

      return (
        <div className="player-container">
          <GetMetadata />
          <div className="song-controls">
            <div className="progress-container" id="progress-container" onClick={progressClick}>
                <div style={{width: progressValue}} className="progress" id="progress"></div>
                <SongDuration />
            </div>
            <div className="player-controls">
                  <i className="fas fa-backward" id="prev" title="Previous" onClick={prevSong}></i>
                 {isPlaying ? <i className="fas fa-pause main-button" id="play" title="Play" onClick={playPause}></i> : <i className="fas fa-play main-button" id="play" title="Play" onClick={playPause}></i>}
                  <i className="fas fa-forward" id="next" title="Next" onClick={nextSong}></i>
            </div>
          </div>
      </div>
      );

  }
  