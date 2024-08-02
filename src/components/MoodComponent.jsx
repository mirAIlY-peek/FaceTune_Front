import { useEffect, useRef, useState } from "react";
import "./componentCSS/moodComponent.css"

const MoodComponent = () => {
    const grid = useRef(undefined);
    const pin_wrap = useRef(undefined);
    const pin = useRef(undefined);
    const [gridN, setGridN] = useState(98);
    const [affects98, setAffects98] = useState({});
    const crtDisableTimeout = useRef(undefined);

    // Move this function outside of useEffect
    const findHighestAffect = (affects) => {
        return Object.entries(affects).reduce((max, [affect, value]) =>
                value > max.value ? {affect, value} : max
            , {affect: '', value: -Infinity});
    };

    // Move this function outside of useEffect
    const getAffectPosition = (affect) => {
        // This is a simplified example. You'll need to map all 98 affects to their positions.
        const positions = {
            'Adventurous': { x: 75, y: 75 },
            'Afraid': { x: 25, y: 75 },
            // ... map all 98 affects
        };
        return positions[affect] || { x: 50, y: 50 }; // Default to center if not found
    };

    useEffect(() => {
        grid.current = document.querySelector("#grid");
        pin_wrap.current = document.querySelector(".pin_wrap");
        pin.current = document.querySelector(".pin");
        if(grid.current && pin_wrap.current){
            bindEvent();
        }

        function resetTimeout() {
            let to = crtDisableTimeout.current;
            clearTimeout(to);
            to = setTimeout(() => {
                hidePin()
            }, 3000)

            crtDisableTimeout.current = to;
        }

        function bindEvent(){
            resetTimeout();
            window.addEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", fn);
            window.addEventListener("resize", fn2);
        }

        function fn (evt) {
            showPin();
            setEmotion(evt.detail.output);
            setAffects98(evt.detail.output.affects98);
            resetTimeout();
        };

        function fn2 () {
            setDim();
        };

        function setDim (){
            if (!grid.current || grid.current.clientWidth === 0) {
                setTimeout(() => {
                    setDim();
                }, 10);
            } else {
                pin_wrap.current.style.width = grid.current.clientWidth + "px";
                pin_wrap.current.style.height = grid.current.clientHeight + "px";
            }
        }

        function setEmotion (output) {
            const { affect } = findHighestAffect(output.affects98);
            const { x, y } = getAffectPosition(affect);
            setPinPosition(x, y);
        }

        function setPinPosition(x, y) {
            pin.current.style.left = `${x}%`;
            pin.current.style.bottom = `${y}%`;
        }

        function showPin() {
            pin.current.style.opacity = 0.7;
        }

        function hidePin() {
            pin.current.style.opacity = 0;
        }

        return () => {
            window.removeEventListener("CY_FACE_AROUSAL_VALENCE_RESULT", fn);
            window.removeEventListener("resize", fn2);
        };

    }, []);

    const currentAffect = findHighestAffect(affects98).affect;

    return (
        <>
            <p style={{fontSize:"20px"}}>Mood Component:</p>
            <div style={{position:"relative", height:"550px", width:"600px"}}>
                <div className="wrapper" id="grid">
                    {(gridN === 98) && <img alt="" src="/advancedGraph.png" style={{width: "100%", height: "100%"}} />}
                    <div className="pin_wrap">
                        <div className="pin"></div>
                    </div>
                </div>
            </div>
            <div>
                <button onClick={()=>{setGridN(98)}} disabled={gridN === 98}>98 Affects</button>
            </div>
            <p>Current Affect: {currentAffect}</p>
        </>
    );
};

export default MoodComponent;
