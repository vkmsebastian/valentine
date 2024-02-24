import { useState, useEffect} from 'react';
import './PlayerCSS.css'
import ben1 from './ben1.mp3';
import ben2 from './ben2.mp3';
import ben3 from './ben3.flac';


const songs = [
    {
      name: 'ben-1',
      displayName: 'Sa Susunod Na Habang Buhay',
      artist: 'Ben&Ben',
      src: ben1
    },
    {
      name: 'ben-2',
      displayName: 'Lifetime',
      artist: 'Ben&Ben',
      src: ben2
    },
    {
      name: 'ben-3',
      displayName: 'Doors',
      artist: 'Ben&Ben',
      src: ben3
    },
  ]
  
  export default function Player() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [songIndex, setSongIndex] = useState(0);
    const [songbook] = useState(() => 
    songs.map(item => new Audio(item.src)));

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

    function getDuration() {
      let duration = songbook[songIndex].duration;
      if (isNaN(duration)) {
        return '';
      }
      
      let minutes = Math.floor(duration / 60);
      let seconds = Math.floor(duration % 60);
      
      let secondsStr = seconds < 10 ? '0' + seconds : seconds;
    
      return minutes + ':' + secondsStr;
    }

    function GetCurrentTime(){
      const [time, setTime] = useState(0);
      useEffect(() => {
        setTimeout(() =>
        setTime(songbook[songIndex].currentTime),100);
      })
      let minutes = Math.floor(time/60);
      let seconds = Math.floor(time%60);
      let secondsStr = seconds < 10 ? '0' + seconds : seconds;
      return minutes + ':' + secondsStr;
    }

      return (
        <div className="player-container">
          <div class="song-info">
            <div className="img-container">
                <img src="https://i1.sndcdn.com/artworks-cPfzaZ5r2hsdE65A-BxhYWg-t500x500.jpg" alt="Album Art"/>
            </div>
            <h2 id="title">{songs[songIndex].displayName}</h2>
            <h3 id="artist">{songs[songIndex].artist}</h3>
          </div>
          <div className="progress-container" id="progress-container">
              <div className="progress" id="progress"></div>
              <div className="duration-wrapper">
                  <span id="current-time">{GetCurrentTime()}</span>
                  <span id="duration">{getDuration()}</span>
              </div>
          </div>
          
          <div class="player-controls">
                <i className="fas fa-backward" id="prev" title="Previous" onClick={prevSong}></i>  
               {isPlaying ? <i className="fas fa-pause main-button" id="play" title="Play" onClick={playPause}></i> : <i className="fas fa-play main-button" id="play" title="Play" onClick={playPause}></i>}
                <i className="fas fa-forward" id="next" title="Next" onClick={nextSong}></i>
          </div>
      </div>
      );

  }
  