import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import {
  playEmotionSong,
  songEnded,
  setCurrentEmotion,
  updateCurrentEmotion,
  playSong,
  pauseSong,
  resumeSong
} from '../store/actions/playerActions.js';

const GenderComponent = ({
                           playEmotionSong,
                           songEnded,
                           setCurrentEmotion,
                           playing,
                           currentEmotion,
                           updateCurrentEmotion,
                           isPaused,
                           pauseSong,
                           resumeSong
                         }) => {
  const [emotionBuffer, setEmotionBuffer] = useState("");
  const [lastEmotionChangeTime, setLastEmotionChangeTime] = useState(Date.now());

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused && !playing) {
      bindEvents();
      intervalRef.current = setInterval(() => {
        if (emotionBuffer && emotionBuffer !== currentEmotion) {
          setCurrentEmotion(emotionBuffer);
          playEmotionSong(emotionBuffer);
        }
      }, 1000); // Check every second
    } else {
      clearInterval(intervalRef.current);
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    }

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    };
  }, [emotionBuffer, currentEmotion, isPaused, playing, playEmotionSong, setCurrentEmotion]);

  useEffect(() => {
    if (!playing && !isPaused) {
      songEnded();
    }
  }, [playing, isPaused, songEnded]);

  const handleEmotionEvent = (evt) => {
    if (!isPaused && !playing) {
      const newEmotion = evt.detail.output.dominantEmotion || "Neutral";
      const currentTime = Date.now();
      if (currentTime - lastEmotionChangeTime > 30000) { // 30 seconds cooldown
        setEmotionBuffer(newEmotion);
        setLastEmotionChangeTime(currentTime);
      }
    }
  };

  function bindEvents() {
    window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
  }

  const handlePauseResume = () => {
    if (playing) {
      pauseSong();
    } else {
      resumeSong();
    }
  };

  return (
      <div>
        <p style={{ fontSize: "20px" }}>DominantEmotion Component:</p>
        <p>Current Emotion: {emotionBuffer}</p>
        <p>Dominant Emotion (used for music): {currentEmotion}</p>
        <p>Emotion Detection: {isPaused || playing ? "Frozen" : "Active"}</p>
        <p>Music Playing: {playing ? "Yes" : "No"}</p>
        <button onClick={handlePauseResume}>
          {playing ? "Pause" : "Resume"} Music and Emotion Detection
        </button>
      </div>
  );
};

const mapStateToProps = (state) => ({
  playing: state.playerReducer.playing,
  currentEmotion: state.playerReducer.currentEmotion,
  isPaused: state.playerReducer.isPaused,
});

const mapDispatchToProps = (dispatch) => ({
  playEmotionSong: (emotion) => dispatch(playEmotionSong(emotion)),
  songEnded: () => dispatch(songEnded()),
  setCurrentEmotion: (emotion) => dispatch(setCurrentEmotion(emotion)),
  updateCurrentEmotion: (emotion) => dispatch(updateCurrentEmotion(emotion)),
  pauseSong: () => dispatch(pauseSong()),
  resumeSong: () => dispatch(resumeSong()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GenderComponent);
