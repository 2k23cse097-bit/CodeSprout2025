import React from 'react';

interface DrawAnimationProps {
    isVisible: boolean;
}

const DrawAnimation: React.FC<DrawAnimationProps> = ({ isVisible }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" aria-hidden="true">
            {Array.from({ length: 15 }).map((_, i) => (
                <div 
                    key={i} 
                    className="absolute text-4xl animate-float-up"
                    style={{
                        left: `${Math.random() * 90}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        animationDuration: `${3 + Math.random() * 3}s`,
                    }}
                >
                    {Math.random() > 0.5 ? '🤝' : '🎆'}
                </div>
            ))}
            <style>{`
                @keyframes float-up {
                    0% {
                        bottom: -10%;
                        opacity: 1;
                        transform: scale(0.5) translateX(0);
                    }
                    100% {
                        bottom: 110%;
                        opacity: 0;
                        transform: scale(1.2) translateX(${Math.random() * 100 - 50}px);
                    }
                }
                .animate-float-up {
                    animation: float-up linear forwards;
                }
            `}</style>
        </div>
    );
};

export default DrawAnimation;
