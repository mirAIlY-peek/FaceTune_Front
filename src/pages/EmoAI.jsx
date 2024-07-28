import React, {useEffect, useRef, useState} from "react";
import Loader from '../components/Loader.jsx';
import {logo} from "../assets/index.js";
import {HiPlay, HiPause, HiVolumeUp, HiVolumeOff} from "react-icons/hi";
import './MusicPlayer.css';
import {useExternalScript} from "../helpers/ai-sdk/externalScriptsLoader.js";
import {getAiSdkControls} from "../helpers/ai-sdk/loader.js";
import FaceTrackerComponent from "../components/FaceTrackerComponent.jsx";
import EmotionBarsComponent from "../components/EmotionBarsComponent.jsx";
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import {connect} from 'react-redux';
import {setToken} from '../store/actions/sessionActions';
import {fetchUser} from '../store/actions/userActions';
import Login from '../spotify/login';
import WebPlaybackReact from '../spotify/webPlayback';
import LeftSection from '../containers/leftSection/leftSection';
import MainSection from '../containers/mainSection/mainSection';
import TrackCover from "../component/trackCover/trackCover.jsx";
import { FaSmileBeam, FaMusic } from 'react-icons/fa';

import Joyride, {ACTIONS, EVENTS, STATUS} from 'react-joyride';

import SongsPlayer from '../component/songsPlayer/songsPlayer.jsx';
import Header from "../component/header/header.jsx";
import PhotoTrackerAnalyzer from "../components/PhotoEmotionAnalyzer.jsx"

// import Tooltips from "../components/Tooltips.jsx";

const EmoAI = ({setToken, fetchUser }) => {
    const [user, setUser] = useState({ display_name: '', images: [] });



    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [accessWebcam, setAccessWebcam] = useState(false);
    const mphToolsState = useExternalScript("https://sdk.morphcast.com/mphtools/v1.0/mphtools.js");
    const aiSdkState = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
    const videoContainerRef = useRef(null);
    const videoEl = useRef(null);

    const [generatedAudio, setGeneratedAudio] = useState([]);
    const [currentEmotion, setCurrentEmotion] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [playerLoaded, setPlayerLoaded] = useState(false);
    const [spotifyToken, setSpotifyToken] = useState(null);
    const [showSpotifyComponents, setShowSpotifyComponents] = useState(false);

    const [runJoyride, setRunJoyride] = useState(false);

    const [selectedMode, setSelectedMode] = useState('photo');

    const toggleMode = (mode) => {
        setSelectedMode(mode);
    };

    const steps = [
        {
            target: '.current-emotion-section',
            content: 'Current detected emotion',
            placement: 'right',
        },
        {
            target: '.recommended-music-section',
            content: 'Recommended music based on emotion',
            placement: 'right',
        },
        // Добавьте другие шаги по необходимости
    ];

    useEffect(() => {
        const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
        if (!hasSeenTutorial) {
            setRunJoyride(true);
        }
    }, []);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRunJoyride(false);
            localStorage.setItem('hasSeenTutorial', 'true');
        }
    };

    let navigate = useNavigate();

    useEffect(() => {
        const checkAndSetToken = async () => {
            const token = await Login.getToken();
            if (token) {
                setSpotifyToken(token);
                setToken(token);
                const userData = await fetchUser();
                setUser(userData);
            }
        };

        checkAndSetToken();
    }, [setToken, fetchUser]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            Login.exchangeCodeForTokens(code).then(token => {
                if (token) {
                    setSpotifyToken(token);
                    setToken(token);
                    fetchUser();
                    navigate('/pricing', {replace: true});
                }
            });
        }
    }, [setToken, fetchUser, navigate]);

    const handleConnectSpotify = () => {
        if (!spotifyToken) {
            Login.logInWithSpotify();
        } else {
            setShowSpotifyComponents(true);
        }
    };

    const webPlaybackSdkProps = {
        playerName: 'Spotify React Player',
        playerInitialVolume: 1.0,
        playerRefreshRateMs: 1000,
        playerAutoConnect: true,
        onPlayerRequestAccessToken: () => spotifyToken,
        onPlayerLoading: () => {
        },
        onPlayerWaitingForDevice: () => {
            setPlayerLoaded(true);
        },
        onPlayerError: (e) => {
            console.log('Player error:', e);
        },
        onPlayerDeviceSelected: () => {
            setPlayerLoaded(true);
        },
    };

    const handleEmotionUpdate = (emotion) => {
        const maxEmotion = Object.keys(emotion).reduce((a, b) => emotion[a] > emotion[b] ? a : b);
        setCurrentEmotion(maxEmotion);
    };

    const handlePricingClick = () => {
        navigate("/spotify");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setIsLoading(true);
            const sunoApiResponse = await axios.post('http://localhost:3000/api/generate', {
                prompt: "Create super sad music capturing the pain and sadness of a breakup. Slow tempo, melancholic melody, piano, strings, soft vocals. Mood: loneliness, sorrow, reflection.\n",
                wait_audio: true
            });
            const data = sunoApiResponse.data;
            console.log('SunoApi Response:', data);
            setGeneratedAudio(data);
            if (data.length > 0) {
                const audioElement = new Audio(data[0].audio_url);
                audioElement.play();
            }
        } catch (error) {
            console.error('Error processing prompt:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        videoEl.current = document.getElementById("videoEl");

        async function getAiSdk() {
            if (aiSdkState === "ready" && mphToolsState === "ready" && accessWebcam) {
                const {source, start} = await getAiSdkControls();
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
        <>
            <Joyride
                steps={steps}
                run={runJoyride}
                continuous={true}
                showSkipButton={true}
                showProgress={false}
                styles={{
                    options: {
                        arrowColor: '#fff',
                        backgroundColor: '#fff',
                        overlayColor: 'rgba(0, 0, 0, 0.5)',
                        primaryColor: '#000',
                        textColor: '#000',
                        width: 200,
                        zIndex: 1000,
                    },
                    tooltip: {
                        fontSize: '12px',
                    },
                    buttonNext: {
                        backgroundColor: '#000',
                        fontSize: '12px',
                    },
                    buttonBack: {
                        color: '#000',
                        fontSize: '12px',
                    },
                    buttonSkip: {
                        color: '#000',
                        fontSize: '12px',
                    },
                }}
                callback={handleJoyrideCallback}
            />


            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-screen bg-emoR text-white  p-4">



                <div className={`fixed inset-0 bg-emo p-4 flex flex-col transition-transform transform ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 rounded-xl overflow-hidden z-50`}>
                    {/* Close button for mobile */}
                    <button className="lg:hidden absolute top-8 right-8 text-xl" onClick={toggleMenu}>
                        close
                    </button>
                    <div className="flex-grow overflow-y-auto">
                        <div className="flex flex-col space-y-6 mb-8">
                            <a className="block w-[12rem] xl:mr-28" href="/">
                                <img src={logo} alt="FaceTune.ai" className="logo-size"/>
                            </a>
                        </div>

                        {isLoading && <Loader/>}

                        <div className="space-y-6">
                            <div className="bg-EmoButton p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    {/*<FaSmileBeam className="text-yellow-500 text-2xl mr-2" />*/}
                                    <h2 className="text-lg font-bold">Current Emotion</h2>
                                </div>
                                {currentEmotion ? (
                                    <h3 className="text-yellow-500 text-xl font-bold">{currentEmotion}</h3>
                                ) : (
                                    <p className="text-gray-400 text-x">Your emotion will appear here</p>
                                )}
                            </div>
                            <div className="bg-EmoButton p-4 rounded-lg">
                                <div className="flex items-center mb-2">
                                    {/*<FaMusic className="text-purple-500 text-2xl mr-2" />*/}
                                    <h2 className="text-lg font-bold">Recommended Music</h2>
                                </div>
                                {generatedAudio.length > 0 ? (
                                    <div className="flex items-center space-x-2">
                                        {generatedAudio[0].image_url && (
                                            <img src={generatedAudio[0].image_url}
                                                 alt={`Cover art for ${generatedAudio[0].title}`}
                                                 className="w-12 h-12 object-cover rounded"/>
                                        )}
                                        <div>
                                            <h3 className="text-purple-500 text-base font-bold">{generatedAudio[0].title}</h3>
                                            <p className="text-xs text-gray-300">{generatedAudio[0].tags}</p>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-base">Recommended music will appear here</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto pt-6">
                        <h2 className="text-lg font-bold mb-2">Music Controls</h2>
                        <div className="music-player bg-EmoButton p-4 rounded-lg">
                            <SongsPlayer />
                        </div>
                    </div>
                </div>

                {/*<button className="fixed top-4 left-4 lg:hidden bg-gray-700 p-2 rounded-lg z-20" onClick={toggleMenu}>*/}
                {/*    {isMenuOpen ? "Close" : "Menu"}*/}
                {/*</button>*/}




                <div className={`transition-all duration-300 lg:col-span-3 flex flex-col ${isMenuOpen ? "ml-0" : "ml-auto"} ${isMenuOpen ? "w-full" : "lg:w-3/4"} ${!isMenuOpen && "lg:ml-0 lg:w-full"}`}>
                    <Header
                        username={user.display_name || 'User'}
                        img={user.images[0]?.url || '/Spotify_Icon_RGB_Green.png'}
                        handleSubmit={handleSubmit}
                        handleConnectSpotify={handleConnectSpotify}
                        isLoading={isLoading}
                        toggleMenu={toggleMenu}
                    />




                    <div className="flex-grow flex flex-col items-center overflow-hidden bg-emo rounded-xl p-4">
                        {/*<h2 className="text-2xl font-bold mb-2 text-center">Emotion Analysis</h2>*/}
                        {/*<p className="mb-4 text-sm text-center">*/}
                        {/*    Allow access to your webcam to capture your face and analyze your emotions in real-time.*/}
                        {/*</p>*/}

                        {/*<PhotoTrackerAnalyzer/>*/}

                        <div className="flex flex-col items-center overflow-hidden bg-emo rounded-xl p-4">
                            <h2 className="text-2xl font-bold mb-2 text-center">Emotion Analysis</h2>
                            <p className="mb-4 text-sm text-center">
                                Choose to upload a photo or use your webcam for real-time emotion analysis.
                            </p>

                            <div className="flex space-x-4 mb-6">
                                <button
                                    className={`bg-EmoButton px-6 py-2 rounded-full transition-colors ${selectedMode === 'photo' ? 'bg-purple-600' : ''}`}
                                    onClick={() => toggleMode('photo')}
                                >
                                    Upload Photo
                                </button>
                                <button
                                    className={`bg-EmoButton px-6 py-2 rounded-full transition-colors ${selectedMode === 'webcam' ? 'bg-purple-600' : ''}`}
                                    onClick={() => toggleMode('webcam')}
                                >
                                    Use Camera
                                </button>
                            </div>

                            {selectedMode === 'photo' ? (
                                <PhotoTrackerAnalyzer />
                            ) : (
                                <div className="flex flex-col items-center justify-start w-full max-w-4xl">
                                    <div className="relative w-full max-w-md h-64 mb-4">
                                        {accessWebcam ? (
                                            <div className="video-container w-full h-full rounded-lg overflow-hidden">
                                                <div style={{
                                                    position: "relative",
                                                    width: "100%",
                                                    height: "100%",
                                                    overflow: "hidden"
                                                }}>
                                                    <video id="videoEl" autoPlay style={{
                                                        position: "absolute",
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        transform: "scaleX(-1)"
                                                    }} playsInline></video>
                                                    <FaceTrackerComponent videoEl={videoEl}></FaceTrackerComponent>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <img src="/faceToEmo1.png" alt="Face Outline" className="w-full h-full object-contain"/>
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <button className="bg-EmoButton p-2 rounded-lg" onClick={handleAccessWebcam}>
                                                        Access WebCam
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {accessWebcam && (
                                        <div className="w-full max-w-md mt-4">
                                            <EmotionBarsComponent currentEmotion={currentEmotion}></EmotionBarsComponent>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {showSpotifyComponents && (
                    <WebPlaybackReact {...webPlaybackSdkProps}>
                        {playerLoaded ? (
                            <>
                                <LeftSection/>
                                <MainSection/>
                            </>
                        ) : (
                            <Loader/>
                        )}
                    </WebPlaybackReact>
                )}
            </div>
        </>
    );
};
const mapStateToProps = (state) => ({
    token: state.sessionReducer.token,
});

const mapDispatchToProps = (dispatch) => ({
    setToken: (token) => dispatch(setToken(token)),
    fetchUser: () => dispatch(fetchUser()),
});
export default connect(mapStateToProps, mapDispatchToProps)(EmoAI);
