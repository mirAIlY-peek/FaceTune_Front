import { useState, useEffect, useRef } from "react";

const musicMap = {
  Happy: "/music/One.mp3",
  Sad: "/music/XXXTENTACION - sad.mp3",
  Surprise: "/music/Weekend-Happy.mp3",
  Neutral: "/music/idea10-neutral.mp3",
  Angry: "/music/MeadnDevil-Fear.mp3",
  Disgust: "/music/Eminem - Mockingbird.mp3"
};

const GenderComponent = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [emotionBuffer, setEmotionBuffer] = useState("");
  const [audioSource, setAudioSource] = useState("");
  const [isPlaying, setIsPlaying] = useState(false); // Состояние для отслеживания воспроизведения
  const [isPaused, setIsPaused] = useState(false); // Состояние для отслеживания паузы

  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      bindEvents();
      intervalRef.current = setInterval(() => {
        // console.log("Updating dominantEmotion and audioSource");
        // Обновляем только если emotionBuffer отличается от текущей dominantEmotion
        if (dominantEmotion !== emotionBuffer) {
          setDominantEmotion(emotionBuffer);
          setAudioSource(musicMap[emotionBuffer] || musicMap["Neutral"]);
        }
      }, 3000);
    }

    return () => {
      clearInterval(intervalRef.current);
      window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
    };
  }, [emotionBuffer, dominantEmotion, isPaused]);

  const handleEmotionEvent = (evt) => {
    if (!isPaused) {
      setEmotionBuffer(evt.detail.output.dominantEmotion || "Neutral");
    }
  };

  function bindEvents() {
    window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
  }

  useEffect(() => {
    if (audioSource) {
      const audio = document.getElementById("backgroundAudio");
      audio.load();
      audio.play();
      setIsPlaying(true);
    }
  }, [audioSource]);

  const handlePlayPause = () => {
    const audio = document.getElementById("backgroundAudio");
    if (isPlaying) {
      audio.pause();
      setIsPaused(true);
    } else {
      audio.play();
      setIsPaused(false);
    }
    setIsPlaying(!isPlaying);
  };

  return (
      <div>
        <p style={{ fontSize: "20px" }}>DominantEmotion Component:</p>
        <p>{dominantEmotion}</p>
        <button onClick={handlePlayPause}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <audio id="backgroundAudio" loop>
          <source src={audioSource} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
  );
};

export default GenderComponent;
