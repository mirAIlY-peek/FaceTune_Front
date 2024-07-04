import { useState, useEffect } from "react";

const musicMap = {
  Happy: "/music/Weekend-Happy.mp3",
  Sad: "/music/XXXTENTACION-sad.mp3",
  Surprise: "/music/MeadnDevil-Fear.mp3",
  Neutral: "/music/idea10-neutral.mp3",
};

const GenderComponent = () => {
  const [dominantEmotion, setDominantEmotion] = useState("");
  const [emotionBuffer, setEmotionBuffer] = useState("");
  const [audioSource, setAudioSource] = useState("");
  const [reloadAudio, setReloadAudio] = useState(false); // Новое состояние для перезагрузки аудио

  useEffect(() => {
    bindEvents();
    const interval = setInterval(() => {
      console.log("Updating dominantEmotion and audioSource");
      console.log("Current emotionBuffer:", emotionBuffer);

      // Обновляем только если emotionBuffer отличается от текущей dominantEmotion
      if (dominantEmotion !== emotionBuffer) {
        setDominantEmotion(emotionBuffer);
        setAudioSource(musicMap[emotionBuffer] || musicMap["Neutral"]);
        setReloadAudio(prev => !prev); // Переключаем состояние для перезагрузки аудио
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [emotionBuffer, dominantEmotion]);

  function bindEvents() {
    window.addEventListener("CY_FACE_EMOTION_RESULT", (evt) => {
      console.log("CY_FACE_EMOTION_RESULT event:", evt.detail.output.dominantEmotion);
      setEmotionBuffer(evt.detail.output.dominantEmotion || "Neutral");
    });
  }

  useEffect(() => {
    if (audioSource) {
      const audio = document.getElementById("backgroundAudio");
      console.log("Playing audioSource:", audioSource);
      audio.load();
      audio.play();
    }
  }, [audioSource, reloadAudio]); // Добавляем reloadAudio как зависимость

  return (
      <div>
        <p style={{ fontSize: "20px" }}>DominantEmotion Component:</p>
        <p>{dominantEmotion}</p>
        <audio id="backgroundAudio" loop>
          <source src={audioSource} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
  );
};

export default GenderComponent;
