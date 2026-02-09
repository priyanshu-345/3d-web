import { useRef, useEffect, useState } from 'react';

const AnimatedText3D = ({
    children,
    className = '',
    delay = 0,
    animationType = 'flip' // 'flip' | 'fade-up' | 'blur'
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        setIsVisible(true);
                    }, delay);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [delay]);

    const getAnimationClass = () => {
        switch (animationType) {
            case 'flip':
                // Uses the 3D rotation classes we added to index.css
                return isVisible
                    ? 'rotate-x-0 opacity-100 translate-y-0 filter-none'
                    : 'rotate-x-90 opacity-0 translate-y-10 blur-sm';
            default:
                return isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';
        }
    };

    return (
        <div
            ref={elementRef}
            className={`perspective-1000 ${className}`}
            style={{ display: 'block' }} // Ensure block or inline-block for transform
        >
            <div
                className={`transform-style-3d transition-all duration-1000 ease-out origin-center ${getAnimationClass()}`}
                style={{ backfaceVisibility: 'hidden' }}
            >
                {children}
            </div>
        </div>
    );
};

export default AnimatedText3D;
