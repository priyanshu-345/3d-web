import { useEffect, useState } from 'react';

const TextMorph = ({ words, className = '', interval = 3000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (!words || words.length === 0) return;

        const timer = setInterval(() => {
            setIsAnimating(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % words.length);
                setIsAnimating(false);
            }, 500);
        }, interval);

        return () => clearInterval(timer);
    }, [words, interval]);

    return (
        <span className={`${className} inline-grid grid-cols-1 grid-rows-1 perspective-1000`}>
            {words.map((word, index) => (
                <span
                    key={index}
                    className={`col-start-1 row-start-1 transition-all duration-700 cubic-bezier(0.68, -0.55, 0.265, 1.55) transform-style-3d backface-hidden ${index === currentIndex
                            ? 'opacity-100 rotate-x-0 translate-y-0 blur-0'
                            : index < currentIndex
                                ? 'opacity-0 -rotate-x-90 -translate-y-10 blur-sm'
                                : 'opacity-0 rotate-x-90 translate-y-10 blur-sm'
                        }`}
                >
                    {word}
                </span>
            ))}
        </span>
    );
};

export default TextMorph;

