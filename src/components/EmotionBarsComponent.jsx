import React, { useState, useEffect, useRef } from "react";
import "./componentCSS/emotionBarsComponent.css";
import SingleBarComponent from "./SingleBarComponent.jsx";

const EmotionBarsComponent = ({ onUpdateEmotion }) => {
    const [angry, setAngry] = useState(0);
    const [disgust, setDisgust] = useState(0);
    const [fear, setFear] = useState(0);
    const [happy, setHappy] = useState(0);
    const [sad, setSad] = useState(0);
    const [surprise, setSurprise] = useState(0);
    const [neutral, setNeutral] = useState(0);

    const [mostExpressedEmotion, setMostExpressedEmotion] = useState(null);

    const timeoutRef = useRef(null);

    useEffect(() => {
        function handleEmotionEvent(evt) {
            clearTimeout(timeoutRef.current);

            setAngry(evt.detail.output.emotion.Angry * 100);
            setDisgust(evt.detail.output.emotion.Disgust * 100);
            setFear(evt.detail.output.emotion.Fear * 100);
            setHappy(evt.detail.output.emotion.Happy * 100);
            setSad(evt.detail.output.emotion.Sad * 100);
            setSurprise(evt.detail.output.emotion.Surprise * 100);
            setNeutral(evt.detail.output.emotion.Neutral * 100);

            timeoutRef.current = setTimeout(() => {
                const emotions = {
                    Angry: angry,
                    Disgust: disgust,
                    Fear: fear,
                    Happy: happy,
                    Sad: sad,
                    Surprise: surprise,
                    Neutral: neutral,
                };

                let maxEmotion = null;
                let maxPercentage = 0;

                Object.entries(emotions).forEach(([emotion, percentage]) => {
                    if (percentage > maxPercentage) {
                        maxEmotion = emotion;
                        maxPercentage = percentage;
                    }
                });

                setMostExpressedEmotion(maxEmotion);

                if (onUpdateEmotion) {
                    onUpdateEmotion(maxEmotion);
                }

                // Reset all emotion values
                setAngry(0);
                setDisgust(0);
                setFear(0);
                setHappy(0);
                setSad(0);
                setSurprise(0);
                setNeutral(0);
            }, 5000);
        }

        window.addEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);

        return () => {
            clearTimeout(timeoutRef.current);
            window.removeEventListener("CY_FACE_EMOTION_RESULT", handleEmotionEvent);
        };
    }, []);

    return (
        <>
            <p style={{ fontSize: "20px" }}>EmotionBars Component:</p>
            <div id="emotionsContainer">
                <SingleBarComponent
                    name="Angry"
                    color1="#E21919"
                    color2="#984E4E"
                    value={angry}
                />
                <SingleBarComponent
                    name="Disgust"
                    color1="#37D042"
                    color2="#1A6420"
                    value={disgust}
                />
                <SingleBarComponent
                    name="Fear"
                    color1="#FF007A"
                    color2="#906490"
                    value={fear}
                />
                <SingleBarComponent
                    name="Happy"
                    color1="#FFEA00"
                    color2="#8F8A57"
                    value={happy}
                />
                <SingleBarComponent
                    name="Sad"
                    color1="#6CB4DF"
                    color2="#4E8698"
                    value={sad}
                />
                <SingleBarComponent
                    name="Surprise"
                    color1="#F5B9C3"
                    color2="#664E98"
                    value={surprise}
                />
                <SingleBarComponent
                    name="Neutral"
                    color1="#A9A9A9"
                    color2="#737373"
                    value={neutral}
                />
            </div>
        </>
    );
};

export default EmotionBarsComponent;
