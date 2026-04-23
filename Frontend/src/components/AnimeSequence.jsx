import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

const AnimeSequence = ({ text, className = "" }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Split text into individual spans for letters
    const element = containerRef.current;
    if (!element) return;

    // We replace the text content with individual letter spans
    const letters = text.split("");
    element.innerHTML = letters
      .map((letter) => `<span class="anime-letter" style="opacity: 0; display: inline-block; transform: translateY(20px);">${letter === " " ? "&nbsp;" : letter}</span>`)
      .join("");

    animate('.anime-letter', {
      translateY: [20, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 1200,
      delay: stagger(30, { start: 300 })
    });
  }, [text]);

  return (
    <div ref={containerRef} className={className}>
      {text}
    </div>
  );
};

export default AnimeSequence;
