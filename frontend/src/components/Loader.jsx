const Loader = () => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Outer ring pulse */}
                <div className="absolute w-full h-full rounded-full border-4 border-pink-300 animate-ping"></div>

                {/* Bouncing dots inside ring */}
                <div className="flex space-x-2">
                    <span className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-4 h-4 bg-pink-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-4 h-4 bg-pink-500 rounded-full animate-bounce"></span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
