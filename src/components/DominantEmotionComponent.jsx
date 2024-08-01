import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import {
  playEmotionSong,
  songEnded,
  setCurrentEmotion,
  updateCurrentEmotion,
  playSong, pauseSong
} from '../store/actions/playerActions.js';
import {bindActionCreators} from "redux";
import {fetchMoreSongs, fetchRecentSongs, fetchSongs} from "../store/actions/libraryActions.js";

const GenderComponent = ({ playEmotionSong, songEnded, setCurrentEmotion, playing, currentEmotion, updateCurrentEmotion }) => {
  const [emotionBuffer, setEmotionBuffer] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [isEmotionFrozen, setIsEmotionFrozen] = useState(false);
  const [lastEmotionChangeTime, setLastEmotionChangeTime] = useState(Date.now());

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      bindEvents();
      intervalRef.current = setInterval(() => {
        if (emotionBuffer && emotionBuffer !== currentEmotion) {
          setCurrentEmotion(emotionBuffer);
          if (!playing) {
            playEmotionSong(emotionBuffer);
          }
        }
      }, 1000); // Check every second
    }

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    };
  }, [emotionBuffer, currentEmotion, isPaused, playing, playEmotionSong, setCurrentEmotion]);

  useEffect(() => {
    const emotionUpdateInterval = setInterval(() => {
      if (emotionBuffer && emotionBuffer !== currentEmotion) {
        updateCurrentEmotion(emotionBuffer);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(emotionUpdateInterval);
  }, [emotionBuffer, currentEmotion, updateCurrentEmotion]);

  useEffect(() => {
    if (playing) {
      setIsEmotionFrozen(true);
    } else {

        setIsEmotionFrozen(false);
        songEnded();


    }
  }, [playing, songEnded]);

  useEffect(() => {
    if (!isEmotionFrozen) {
      // Re-enable emotion detection
      bindEvents();
    }
  }, [isEmotionFrozen]);

  const handleEmotionEvent = (evt) => {
    if (!isPaused) {
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
    setIsPaused(!isPaused);
  };

  return (
      <div>
        <p style={{ fontSize: "20px" }}>DominantEmotion Component:</p>
        <p>Current Emotion: {emotionBuffer}</p>
        <p>Dominant Emotion (used for music): {currentEmotion}</p>
        <p>Emotion Detection: {isEmotionFrozen ? "Frozen" : "Active"}</p>
        <p>Music Playing: {playing ? "Yes" : "No"}</p>
        <button onClick={handlePauseResume}>
          {isPaused ? "Resume" : "Pause"} Emotion Detection
        </button>
      </div>
  );
};

const mapStateToProps = (state) => ({
  playing: state.playerReducer.playing,
  currentEmotion: state.playerReducer.currentEmotion,
});

const mapDispatchToProps = (dispatch) => ({
  playEmotionSong: (emotion) => dispatch(playEmotionSong(emotion)),
  songEnded: () => dispatch(songEnded()),
  setCurrentEmotion: (emotion) => dispatch(setCurrentEmotion(emotion)),
  updateCurrentEmotion: (emotion) => dispatch(updateCurrentEmotion(emotion)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GenderComponent);
