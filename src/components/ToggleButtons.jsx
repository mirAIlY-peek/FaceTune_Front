
const ToggleButtons = ({ selectedOption, setSelectedOption }) => {
    return (
        <div className="flex justify-center mb-4">
            <button
                className={`px-4 py-2 rounded-l-lg ${
                    selectedOption === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedOption('upload')}
            >
                Upload Photo
            </button>
            <button
                className={`px-4 py-2 rounded-r-lg ${
                    selectedOption === 'webcam' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setSelectedOption('webcam')}
            >
                Use Webcam
            </button>
        </div>
    );
};

export default ToggleButtons;
