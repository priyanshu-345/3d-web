import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const StickyText = ({ children, className = '', duration = '100%' }) => {
    const containerRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const text = textRef.current;
        if (!container || !text) return;

        ScrollTrigger.create({
            trigger: container,
            start: 'top top',
            end: `+=${duration}`,
            pin: text,
            pinSpacing: false,
            markers: false,
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [duration]);

    return (
        <div ref={containerRef} className="relative min-h-screen">
            <div ref={textRef} className={`sticky top-1/2 -translate-y-1/2 ${className}`}>
                {children}
            </div>
        </div>
    );
};

export default StickyText;
