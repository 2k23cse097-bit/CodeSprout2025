import React from 'react';

const CONFETTI_COUNT = 150;

const Confetti: React.FC = () => {
  const confetti = Array.from({ length: CONFETTI_COUNT }).map((_, i) => {
    // FIX: The default React.CSSProperties type does not include custom properties (CSS variables).
    // Casting the style object allows the use of `--rotate-start` and `--rotate-end` without compiler errors.
    const style = {
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${3 + Math.random() * 2}s`,
      '--rotate-start': `${Math.random() * 360}deg`,
      '--rotate-end': `${Math.random() * 360 + 360}deg`,
    } as React.CSSProperties;
    const colors = ['bg-teal-400', 'bg-cyan-400', 'bg-emerald-400', 'bg-sky-400'];
    const colorClass = colors[i % colors.length];

    return <div key={i} className={`confetti-piece ${colorClass}`} style={style} />;
  });

  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden" aria-hidden="true">
        {confetti}
      </div>
      <style>{`
        @keyframes fall {
          0% {
            transform: translateY(-10vh) rotate(var(--rotate-start));
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(var(--rotate-end));
            opacity: 0;
          }
        }
        .confetti-piece {
          position: absolute;
          top: 0;
          width: 8px;
          height: 16px;
          border-radius: 4px;
          animation: fall linear infinite;
        }
      `}</style>
    </>
  );
};

export default Confetti;
