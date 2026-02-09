import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollReveal = (options = {}) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const {
            delay = 0,
            duration = 1.2,
            y = 60,
            opacity = 0,
            ease = 'power3.out',
            start = 'top 85%',
            end = 'top 20%',
            scrub = false,
            markers = false,
        } = options;

        gsap.fromTo(
            element,
            {
                opacity,
                y,
                filter: 'blur(10px)',
            },
            {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration,
                delay,
                ease,
                scrollTrigger: {
                    trigger: element,
                    start,
                    end,
                    scrub,
                    markers,
                    toggleActions: 'play none none reverse',
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [options]);

    return elementRef;
};

export const useCharacterReveal = (options = {}) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const text = element.textContent;
        element.innerHTML = '';

        const chars = text.split('').map((char) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            element.appendChild(span);
            return span;
        });

        const {
            delay = 0,
            stagger = 0.03,
            duration = 0.6,
            ease = 'power2.out',
        } = options;

        gsap.to(chars, {
            opacity: 1,
            y: 0,
            duration,
            delay,
            stagger,
            ease,
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [options]);

    return elementRef;
};

export const useParallaxText = (speed = 0.5) => {
    const elementRef = useRef(null);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        gsap.to(element, {
            y: () => window.innerHeight * speed,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [speed]);

    return elementRef;
};
