import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useExternalScript } from '../helpers/ai-sdk/externalScriptsLoader.js';
import SingleBarComponent from './SingleBarComponent';
import "./componentCSS/emotionBarsComponent.css";

const PhotoTrackerAnalyzer = () => {

    const licenseKey = "sk1d0602bbf0cce12056bc1224fcb450d6f96cd9261207";
    const [emotionResults, setEmotionResults] = useState({
        Angry: 0,
        Disgust: 0,
        Fear: 0,
        Happy: 0,
        Sad: 0,
        Surprise: 0,
        Neutral: 0
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const sdkStatus = useExternalScript("https://ai-sdk.morphcast.com/v1.16/ai-sdk.js");
    const sourceRef = useRef(null);
    const sdkRef = useRef(null);

    const customSource = useCallback(() => {
        let crtImgData;
        let resolver;
        return {
            analyzeFrame(imageData) {
                if (resolver) {
                    resolver(imageData);
                    resolver = null;
                } else {
                    crtImgData = imageData;
                }
            },
            getFrame() {
                if (crtImgData) {
                    const p = Promise.resolve(crtImgData);
                    crtImgData = null;
                    return p;
                } else {
                    return new Promise(res => resolver = res);
                }
            },
            start() { },
            stop() { },
            get stopped() { return false; }
        };
    }, []);

    useEffect(() => {
        if (sdkStatus === 'ready' && licenseKey) {
            const initSdk = async () => {
                sourceRef.current = customSource();

                try {
                    sdkRef.current = await window.CY.loader()
                        .licenseKey(licenseKey)
                        .addModule(window.CY.modules().FACE_DETECTOR.name, { smoothness: 0 })
                        .addModule(window.CY.modules().FACE_EMOTION.name, { smoothness: 0 })
                        .source(sourceRef.current)
                        .load();

                    sdkRef.current.start();

                    window.addEventListener(window.CY.modules().FACE_EMOTION.eventName, handleEmotionEvent);

                } catch (err) {
                    console.error("Error initializing SDK:", err);
                }
            };

            initSdk();

            return () => {
                if (sdkRef.current) {
                    sdkRef.current.stop();
                }
                window.removeEventListener(window.CY.modules().FACE_EMOTION.eventName, handleEmotionEvent);
            };
        }
    }, [sdkStatus, customSource, licenseKey]);

    const handleEmotionEvent = useCallback((evt) => {
        const emotions = evt.detail.output.emotion;
        setEmotionResults(Object.fromEntries(
            Object.entries(emotions).map(([key, value]) => [key, value * 100])
        ));
        setIsAnalyzing(false);
    }, []);

    useEffect(() => {
        if (currentImage && sourceRef.current) {
            setIsAnalyzing(true);
            getImageData(currentImage).then(imgData => {
                sourceRef.current.analyzeFrame(imgData);
            });
        }
    }, [currentImage]);

    const getImageData = (file) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const context = canvas.getContext('2d', { willReadFrequently: true });
                context.drawImage(img, 0, 0);
                resolve(context.getImageData(0, 0, img.width, img.height));
            };
            img.onerror = (err) => reject(err);
            img.src = URL.createObjectURL(file);
        });
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setCurrentImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
            <div className="bg-emo -xl w-full">
                <h2 className="text-2xl font-bold mb-6 text-center text-white">Upload Image</h2>
                <div className="mb-6">
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        {previewUrl ? (
                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        )}
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </label>
                </div>
                {currentImage && (
                    <div className="mt-4 text-center text-white">
                        <p>Uploaded: {currentImage.name}</p>
                    </div>
                )}
            </div>

            {isAnalyzing ? (
                <p className="mt-4 text-white">Analyzing image...</p>
            ) : (
                <div id="emotionsContainer" className="mt-6 bg-emo p-4 rounded-xl">
                    <SingleBarComponent name="Angry" color1="#E21919" color2="#984E4E" value={emotionResults.Angry} />
                    <SingleBarComponent name="Disgust" color1="#37D042" color2="#1A6420" value={emotionResults.Disgust} />
                    <SingleBarComponent name="Fear" color1="#FF007A" color2="#906490" value={emotionResults.Fear} />
                    <SingleBarComponent name="Happy" color1="#FFEA00" color2="#8F8A57" value={emotionResults.Happy} />
                    <SingleBarComponent name="Sad" color1="#6CB4DF" color2="#4E8698" value={emotionResults.Sad} />
                    <SingleBarComponent name="Surprise" color1="#F5B9C3" color2="#664E98" value={emotionResults.Surprise} />
                    <SingleBarComponent name="Neutral" color1="#A9A9A9" color2="#737373" value={emotionResults.Neutral} />
                </div>
            )}
        </div>
    );
};

export default PhotoTrackerAnalyzer;
