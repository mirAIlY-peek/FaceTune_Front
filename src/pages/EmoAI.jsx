import React, { useEffect, useRef, useState } from "react";
import Loader from '../components/Loader.jsx'; // Import the loader component
import { logo } from "../assets/index.js";
import { HiPlay, HiPause, HiVolumeUp, HiVolumeOff } from "react-icons/hi";
import './MusicPlayer.css';
import { useExternalScript } from "../helpers/ai-sdk/externalScriptsLoader.js";
import { getAiSdkControls } from "../helpers/ai-sdk/loader.js";
import FaceTrackerComponent from "../components/FaceTrackerComponent.jsx";
import EmotionBarsComponent from "../components/EmotionBarsComponent.jsx";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const EmoAI = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [accessWebcam, setAccessWebcam] = useState(false);
    const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
    const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
    const videoContainerRef = useRef(null);
    const videoEl = useRef(null);

    const [generatedAudio, setGeneratedAudio] = useState([]);
    const [prompt, setPrompt] = useState('');
    // const [waitAudio, setWaitAudio] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State for loading indicator

    const handleEmotionUpdate = (emotion) => {
        const maxEmotion = Object.keys(emotion).reduce((a, b) => emotion[a] > emotion[b] ? a : b);
        setCurrentEmotion(maxEmotion);
    };
    let navigate = useNavigate();

    const handlePricingClick = () => {
        navigate("/spotify");
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent the default form submission behavior

        try {
            setIsLoading(true); // Set loading state to true

            // Step 2: Send the processed prompt to SunoApi for audio generation
            const sunoApiResponse = await axios.post('http://localhost:3005/api/generate', {
                prompt: "I feel surprised",
                wait_audio: true
            });

            const data = sunoApiResponse.data;
            console.log('SunoApi Response:', data);
            setGeneratedAudio(data);

            // Play the generated audio
            if (data.length > 0) {
                const audioElement = new Audio(data[0].audio_url); // Example: select the first element
                audioElement.play();
            }
        } catch (error) {
            console.error('Error processing prompt:', error);
        } finally {
            setIsLoading(false); // Set loading state to false after API call completes
        }
    };

    // const handleChange = (event) => {
    //     setPrompt(event.target.value);
    // };

    // const handleWaitAudioChange = (event) => {
    //     setWaitAudio(event.target.checked);
    //     console.log(event.target.checked)
    // };

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen bg-emoR text-white p-4 rounded-3xl">
            <div className={`fixed lg:relative bg-emo p-4 flex flex-col space-y-8 transition-transform transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
                <a className="block w-[12rem] xl:mr-28" href="#">
                    <img src={logo} width={190} height={40} alt="FaceTune.ai" />
                </a>
                {!isLoading && (
                    <form onSubmit={handleSubmit} className="form-container">
                        {/*<label className="block mt-4">*/}
                        {/*    <input*/}
                        {/*        type="checkbox"*/}
                        {/*        checked={waitAudio}*/}
                        {/*        onChange={handleWaitAudioChange}*/}
                        {/*        className="mr-2"*/}
                        {/*    />*/}
                        {/*    Wait for audio*/}
                        {/*</label>*/}
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                            Generate Music
                        </button>
                    </form>
                )}

                <form  className="form-container">
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 mt-2 rounded">
                        Connect Spotify
                    </button>
                </form>

                <a className="framer-button ghost-button button-animate" onClick={handlePricingClick}>
                    <div className="label-wrap">
                        <p className="button-text" data-text="Join Community">Join Community</p>
                    </div>
                </a>



                {/* Загрузчик, отображаемый во время загрузки */}
                {isLoading && <Loader />}


                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Current Emotion</h2>
                    <div className="bg-EmoButton p-4 rounded-lg">
                        <h3 className="text-yellow-500 text-2xl font-bold">{currentEmotion}</h3>
                        <p>Your emotion is currently detected as {currentEmotion}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-bold">Recommended Music</h2>
                    <div className="bg-EmoButton p-4 rounded-lg">
                        {generatedAudio.length > 0 && (
                            <ul>
                                <li key={generatedAudio[0].id || 0} className="music-item flex items-center space-x-4">
                                    {generatedAudio[0].image_url && (
                                        <img src={generatedAudio[0].image_url} alt={`Cover art for ${generatedAudio[0].title}`} className="w-16 h-16 object-cover" />
                                    )}
                                    <div>
                                        <h3 className="text-purple-500 text-xl font-bold">{generatedAudio[0].title}</h3>
                                        <p>Tags: {generatedAudio[0].tags}</p>
                                    </div>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="space-y-2 mt-auto">
                    <h2 className="text-xl font-bold">Music Controls</h2>
                    <div className="music-player">
                        <div className="waveform"></div>
                        {generatedAudio.length > 0 && (
                            <div className="mt-4">
                                <h2>Generated Audio:</h2>
                                <ul>
                                    <li key={generatedAudio[0].id || 0}>
                                        <p>Title: {generatedAudio[0].title}</p>
                                        <audio controls>
                                            <source key={generatedAudio[0].audio_url} src={generatedAudio[0].audio_url} type="audio/mpeg" />
                                            Your browser does not support the audio element.
                                        </audio>
                                    </li>
                                </ul>
                            </div>
                        )}
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

            <button className="fixed top-4 left-4 lg:hidden bg-gray-700 p-2 rounded-lg z-20" onClick={toggleMenu}>
                {isMenuOpen ? "Close" : "Menu"}
            </button>

            <div className={`transition-all duration-300 lg:col-span-3 flex flex-col items-center justify-center ${isMenuOpen ? "ml-0" : "ml-auto"} ${isMenuOpen ? "w-full" : "lg:w-3/4"} ${!isMenuOpen && "lg:ml-0 lg:w-full"}`}>
                <h2 className="text-3xl font-bold mb-4">Emotion Analysis</h2>
                <p className="mb-4">
                    Allow access to your webcam to capture your face and analyze your emotions in real-time
                </p>
                <div className="relative flex items-center justify-center w-full max-w-sm md:max-w-md lg:max-w-lg  rounded-lg">
                    {accessWebcam ? (
                        <>
                            <div className={`video-container ${isMenuOpen ? 'hidden' : 'block'}`}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                                    <div ref={videoContainerRef} style={{ position: "relative", overflow: "hidden", width: "100%", paddingTop: "100%" }}>
                                        <video id="videoEl" autoPlay style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, transform: "scaleX(-1)" }} playsInline></video>
                                        <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
                                    </div>
                                    <EmotionBarsComponent currentEmotion={currentEmotion}></EmotionBarsComponent>
                                    <hr className="solid" style={{ width: "100%" }}></hr>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {!isMenuOpen && (
                                <img src="/faceToEmo.png" alt="Face Outline" className="w-full h-auto relative z-0" />
                            )}
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
