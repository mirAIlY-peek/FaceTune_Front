import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { playEmotionSong } from '../store/actions/playerActions.js';

const GenderComponent = ({ playEmotionSong }) => {
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [emotionBuffer, setEmotionBuffer] = useState("");
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      bindEvents();
      intervalRef.current = setInterval(() => {
        if (dominantEmotion !== emotionBuffer) {
          setDominantEmotion(emotionBuffer);
          playEmotionSong(emotionBuffer);
        }
      }, 3000);
    }

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    };
  }, [emotionBuffer, dominantEmotion, isPaused, playEmotionSong]);

  const handleEmotionEvent = (evt) => {
    if (!isPaused) {
      setEmotionBuffer(evt.detail.output.dominantEmotion || "Neutral");
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
        <p>{dominantEmotion}</p>
        <button onClick={handlePauseResume}>
          {isPaused ? "Resume" : "Pause"} Emotion Detection
        </button>
      </div>
  );
};

const mapDispatchToProps = {
  playEmotionSong
};

export default connect(null, mapDispatchToProps)(GenderComponent);
