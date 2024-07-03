import React, { useEffect, useRef, useState } from "react";
import { logo } from "../assets/index.js";
import { HiPlay, HiPause, HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import './MusicPlayer.css';
import { useExternalScript } from "../helpers/ai-sdk/externalScriptsLoader.js";
import { getAiSdkControls } from "../helpers/ai-sdk/loader.js";
import FaceTrackerComponent from "../components/FaceTrackerComponent.jsx";
import EmotionBarsComponent from "../components/EmotionBarsComponent.jsx";

const EmoAI = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [accessWebcam, setAccessWebcam] = useState(false); // State to track webcam access
    const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
    const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
    const videoContainerRef = useRef(null);
    const videoEl = useRef(null);

    const [generatedAudio, setGeneratedAudio] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [waitAudio, setWaitAudio] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState(null); // State to track current detected emotion

    const handleEmotionUpdate = (emotion) => {
        // Logic to determine the most expressed emotion
        const maxEmotion = Object.keys(emotion).reduce((a, b) => emotion[a] > emotion[b] ? a : b);
        setCurrentEmotion(maxEmotion);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`http://localhost:3000/api/generate?timestamp=${Date.now()}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prompt, wait_audio: waitAudio })
            });

            if (!response.ok) {
                throw new Error('Failed to generate audio');
            }

            const data = await response.json();
            console.log('Previous audio data:', generatedAudio);
            console.log('Received new data:', data);
            setGeneratedAudio(data);
        } catch (error) {
            console.error('Error generating audio:', error);
        }
    };

    const handleChange = (event) => {
        setPrompt(event.target.value);
    };

    const handleWaitAudioChange = (event) => {
        setWaitAudio(event.target.checked);
    };

    useEffect(() => {
        videoEl.current = document.getElementById("videoEl");
        async function getAiSdk() {
            if (aiSdkState === "ready" && mphToolsState === "ready" && accessWebcam) {
                const { source, start } = await getAiSdkControls();
                await source.useCamera({
                    toVideoElement: videoEl.current,
                });
                await start();
            }
        }
        getAiSdk();
    }, [aiSdkState, mphToolsState, accessWebcam]);

    useEffect(() => {
        const emotionUpdateHandler = (evt) => {
            // Extract emotions from event detail
            const emotions = evt.detail.output.emotion;
            handleEmotionUpdate(emotions);
        };

        if (accessWebcam) {
            window.addEventListener("CY_FACE_EMOTION_RESULT", emotionUpdateHandler);
        }

        return () => {
            window.removeEventListener("CY_FACE_EMOTION_RESULT", emotionUpdateHandler);
        };
    }, [accessWebcam]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleAccessWebcam = () => {
        setAccessWebcam(true);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen bg-emoR text-white">
            {/* Left static part */}
            <div className={`fixed lg:relative bg-emo p-4 flex flex-col space-y-8 transition-transform transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <a className="block w-[12rem] xl:mr-28" href="#">
                    <img src={logo} width={190} height={40} alt="FaceTune.ai" />
                </a>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Current Emotion</h2>
                    <div className="bg-EmoButton p-4 rounded-lg">
                        <h3 className="text-yellow-500 text-2xl font-bold">{currentEmotion}</h3>
                        <p>Your emotions is currently detected as {currentEmotion}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Recommended Music</h2>
                    <div className="bg-EmoButton p-4 rounded-lg">
                        <h3 className="text-purple-500 text-2xl font-bold">Upbeat Pop</h3>
                        <p>Energetic and cheerful music to match your happy mood</p>
                    </div>
                </div>
                <div className="space-y-2 mt-auto">
                    <h2 className="text-xl font-bold">Music Controls</h2>
                    <div className="music-player">
                        {/* Waveform */}
                        <div className="waveform"></div>
                        {/* Slider */}
                        <input type="range" className="slider" />
                        <div className="controls">
                            <button onClick={togglePlay}>
                                {isPlaying ? <HiPause /> : <HiPlay />}
                            </button>
                            <button onClick={toggleMute}>
                                {isMuted ? <HiVolumeOff /> : <HiVolumeUp />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Button to open the menu on mobile devices */}
            <button className="fixed top-4 left-4 lg:hidden bg-gray-700 p-2 rounded-lg z-20" onClick={toggleMenu}>
                {isMenuOpen ? "Close" : "Menu"}
            </button>

            {/* Right dynamic part */}
            <div className={`transition-all duration-300 lg:col-span-3 p-4 flex flex-col items-center justify-center ${isMenuOpen ? "ml-0" : "ml-auto"} ${isMenuOpen ? "w-full" : "lg:w-3/4"} ${!isMenuOpen && "lg:ml-0 lg:w-full"}`}>
                <h2 className="text-3xl font-bold mb-4">Emotion Analysis</h2>
                <p className="mb-4">
                    Allow access to your webcam to capture your face and analyze your emotions in real-time
                </p>
                <div className="relative flex items-center justify-center w-full max-w-sm md:max-w-md lg:max-w-lg p-8 rounded-lg">
                    {accessWebcam ? (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                            <div ref={videoContainerRef} style={{ position: "relative", overflow: "hidden", width: "100%", paddingTop: "100%" }}>
                                <video id="videoEl" autoPlay style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0 }}></video>
                                <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
                            </div>
                            {/*<EmotionBarsComponent currentEmotion={currentEmotion}></EmotionBarsComponent>*/}
                            {/*<hr className="solid" style={{ width: "100%" }}></hr>*/}

                            {/*<form onSubmit={handleSubmit} className="form-container">*/}
                            {/*    <textarea*/}
                            {/*        value={prompt}*/}
                            {/*        onChange={handleChange}*/}
                            {/*        placeholder="Enter your music prompt..."*/}
                            {/*        rows={4}*/}
                            {/*        className="border p-2 w-full"*/}
                            {/*    />*/}
                            {/*    <label className="block mt-4">*/}
                            {/*        <input*/}
                            {/*            type="checkbox"*/}
                            {/*            checked={waitAudio}*/}
                            {/*            onChange={handleWaitAudioChange}*/}
                            {/*            className="mr-2"*/}
                            {/*        />*/}
                            {/*        Wait for audio*/}
                            {/*    </label>*/}
                            {/*    <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">*/}
                            {/*        Generate Music*/}
                            {/*    </button>*/}

                            {/*    {generatedAudio.length > 0 && (*/}
                            {/*        <div className="mt-4">*/}
                            {/*            <h2>Generated Audio:</h2>*/}
                            {/*            <ul>*/}
                            {/*                {generatedAudio.map((audio, index) => (*/}
                            {/*                    <li key={audio.id || index}>*/}
                            {/*                        <p>Title: {audio.title}</p>*/}
                            {/*                        <audio controls>*/}
                            {/*                            <source key={audio.audio_url} src={audio.audio_url} type="audio/mpeg" />*/}
                            {/*                            Your browser does not support the audio element.*/}
                            {/*                        </audio>*/}
                            {/*                    </li>*/}
                            {/*                ))}*/}
                            {/*            </ul>*/}
                            {/*        </div>*/}
                            {/*    )}*/}
                            {/*</form>*/}
                        </div>
                    ) : (
                        <>
                            {/* Conditional rendering for FaceToEmo image */}
                            {!isMenuOpen && (
                                <img src="/faceToEmo.png" alt="Face Outline" className="w-full h-auto relative z-0" />
                            )}
                            {/* Conditional rendering for Access WebCam button */}
                            {!isMenuOpen && (
                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <button className="bg-EmoButton p-2 rounded-lg" onClick={handleAccessWebcam}>Access WebCam</button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmoAI;
