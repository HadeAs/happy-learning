"use client";
import { useEffect, useRef } from "react";

// Static confetti colors — hoisted to module level (rendering-hoist-jsx)
const CONFETTI_COLORS = [
  "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
  "#FF8C00", "#E040FB", "#00BCD4", "#FF4081",
];

const CONFETTI_COUNT = 60;

interface CelebrationProps {
  errorCount: number;
  onPlayAgain: () => void;
}

export function Celebration({ errorCount, onPlayAgain }: CelebrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const frag = document.createDocumentFragment();

    for (let i = 0; i < CONFETTI_COUNT; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.backgroundColor =
        CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      confetti.style.animationDuration = Math.random() * 2 + 2.5 + "s";
      confetti.style.animationDelay = Math.random() * 1.5 + "s";
      confetti.style.width = Math.random() * 10 + 8 + "px";
      confetti.style.height = Math.random() * 10 + 8 + "px";
      frag.appendChild(confetti);
    }

    container.appendChild(frag);

    // Cleanup after animation completes
    const timer = setTimeout(() => {
      container.innerHTML = "";
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="celebration-overlay">
        <div className="celebration-box">
          <div className="emoji">🎉</div>
          <h2>太棒了！全部正确！</h2>
          <p className="errors">
            {errorCount === 0
              ? "零失误，完美！⭐"
              : `共错 ${errorCount} 次，继续加油哦～`}
          </p>
          <button className="btn-play-again" onClick={onPlayAgain}>
            🔄 再来一局
          </button>
        </div>
      </div>
      <div className="confetti-container" ref={containerRef} />
    </>
  );
}
