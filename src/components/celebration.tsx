"use client";
import { useEffect, useRef } from "react";
import { StarIcon, RefreshIcon } from "./icons";

// Hoisted constants — module level (rendering-hoist-jsx)
const CONFETTI_COLORS = [
  "#FF8A80", "#FFCC80", "#FFF176", "#81C784",
  "#B39DDB", "#4FC3F7", "#FF4081", "#FFB74D",
  "#AED581", "#CE93D8", "#FFD54F", "#4DD0E1",
];

const SHAPES = ["square", "star", "circle", "wave"] as const;
const COUNT = 80;

interface CelebrationProps {
  errorCount: number;
  correctCount?: number;
  onPlayAgain: () => void;
}

export function Celebration({ errorCount, correctCount, onPlayAgain }: CelebrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";
    const frag = document.createDocumentFragment();

    for (let i = 0; i < COUNT; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";

      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      if (shape !== "square") piece.classList.add(shape);

      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];

      piece.style.left = Math.random() * 100 + "%";
      piece.style.backgroundColor = color;
      piece.style.animationDuration = Math.random() * 2.5 + 2 + "s";
      piece.style.animationDelay = Math.random() * 2 + "s";
      piece.style.width = Math.random() * 12 + 8 + "px";
      piece.style.height = shape === "circle" || shape === "star"
        ? piece.style.width
        : Math.random() * 12 + 8 + "px";

      frag.appendChild(piece);
    }

    container.appendChild(frag);

    const timer = setTimeout(() => {
      container.innerHTML = "";
    }, 6500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div className="celebration-overlay">
        <div className="celebration-box">
          <div className="emoji"><StarIcon size={72} /></div>
          <h2>太棒了！全部正确！</h2>
          <p className="errors">
            {correctCount !== undefined
              ? `✅ ${correctCount} 对 · ❌ ${errorCount} 次`
              : errorCount === 0
                ? "✨ 零失误，完美！"
                : `共错 ${errorCount} 次，继续加油哦～`}
          </p>
          <button className="btn-play-again" onClick={onPlayAgain}>
            <RefreshIcon size={18} /> 再来一局
          </button>
        </div>
      </div>
      <div className="confetti-container" ref={containerRef} />
    </>
  );
}
