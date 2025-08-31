import React, { useState, useEffect } from 'react';

const HeartIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-1.383-.597 15.185 15.185 0 0 1-2.043-1.34c-1.606-1.34-3.063-2.912-3.84-4.516C2.35 12.45 2 10.634 2 8.773c0-2.66 1.62-5.043 4.09-5.992C7.999 2.24 9.697 2.5 11.23 3.515c.42.31.8.693 1.156 1.137L12.41 4.79l.062.062.062.062 1.059-1.156c.352-.444.736-.827 1.156-1.137 1.533-1.015 3.231-1.275 4.636-.782C20.38 3.73 22 6.112 22 8.773c0 1.862-.35 3.678-1.002 5.283-.777 1.604-2.234 3.176-3.84 4.516a15.185 15.185 0 0 1-2.043 1.34 15.247 15.247 0 0 1-1.383.597l-.022.012-.007.003-.001.001a.752.752 0 0 1-.693 0l-.003-.001Z" />
    </svg>
);


const LikeButton: React.FC = () => {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [floatingHearts, setFloatingHearts] = useState<number[]>([]);

    useEffect(() => {
        try {
            const storedLikes = sessionStorage.getItem('ticTacToeLikes');
            setLikes(storedLikes ? JSON.parse(storedLikes) : 0);
        } catch (error) {
            console.error("Could not parse likes from sessionStorage", error);
            setLikes(0);
        }
    }, []);

    const handleLikeClick = () => {
        const newLikes = likes + 1;
        setLikes(newLikes);
        setIsLiked(true);

        const newKey = Date.now();
        setFloatingHearts(prev => [...prev, newKey]);
        setTimeout(() => {
            setFloatingHearts(prev => prev.filter(key => key !== newKey));
        }, 2000); // Animation duration

        try {
            sessionStorage.setItem('ticTacToeLikes', JSON.stringify(newLikes));
        } catch (error) {
            console.error("Could not save likes to sessionStorage", error);
        }

        setTimeout(() => setIsLiked(false), 500);
    };

    return (
        <div className="mt-8 relative">
            <button
                onClick={handleLikeClick}
                className="relative flex items-center gap-2 bg-pink-500/20 hover:bg-pink-500/40 text-pink-300 font-semibold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-pink-500/20 backdrop-blur-sm border border-pink-400/30 focus:outline-none focus:ring-2 focus:ring-pink-400"
                aria-label={`Like the game. Current likes: ${likes}`}
            >
                <HeartIcon className={`w-6 h-6 transition-transform duration-500 ${isLiked ? 'animate-heartbeat text-pink-400' : 'text-pink-300'}`} />
                <span>{likes}</span>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-48 pointer-events-none">
                {floatingHearts.map((key) => (
                    <div key={key} className="absolute bottom-0 animate-float-heart" style={{ left: `${Math.random() * 80 + 10}%` }}>
                        <HeartIcon className="w-5 h-5 text-pink-400" />
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes heartbeat {
                    0% { transform: scale(1); } 25% { transform: scale(1.3); } 50% { transform: scale(1); }
                    75% { transform: scale(1.2); } 100% { transform: scale(1); }
                }
                .animate-heartbeat { animation: heartbeat 0.5s ease-in-out; }
                
                @keyframes float-heart {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-150px) scale(0); opacity: 0; }
                }
                .animate-float-heart { animation: float-heart 2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default LikeButton;