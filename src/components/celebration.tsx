"use client";
import { useEffect, useRef } from "react";
import { RefreshIcon } from "./icons";

interface CelebrationProps {
  errorCount: number;
  correctCount: number;
  onPlayAgain: () => void;
}

const COLORS = ["#FF5252","#FF9100","#FFD600","#4CAF50","#448AFF","#AB47BC","#EF5350","#FF7043"];

export function Celebration({ errorCount, correctCount, onPlayAgain }: CelebrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const frag = document.createDocumentFragment();
    // 4 颗星飞向中心
    for (let i = 0; i < 4; i++) {
      const star = document.createElement("div");
      star.className = "confetti star";
      star.style.left = `${25 + i * 18}%`;
      star.style.top = "-60px";
      star.style.width = `${14 + Math.random() * 16}px`;
      star.style.height = star.style.width;
      star.style.background = COLORS[i % COLORS.length];
      star.style.animationDuration = `${2.2 + Math.random() * 1.2}s`;
      star.style.animationDelay = `${i * 0.15}s`;
      frag.appendChild(star);
    }
    // 额外撒花
    for (let i = 0; i < 36; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.style.left = `${Math.random() * 100}%`;
      c.style.top = `-${20 + Math.random() * 60}px`;
      c.style.width = `${8 + Math.random() * 10}px`;
      c.style.height = `${8 + Math.random() * 10}px`;
      c.style.background = COLORS[i % COLORS.length];
      c.style.animationDuration = `${2.5 + Math.random() * 1.8}s`;
      c.style.animationDelay = `${0.3 + Math.random() * 0.6}s`;
      frag.appendChild(c);
    }
    el.appendChild(frag);
  }, []);

  const isPerfect = errorCount === 0;
  const msg = isPerfect ? "完美！全部答对！🌟" :
    errorCount <= 2 ? `错了 ${errorCount} 次，还是很棒！` :
    `错了 ${errorCount} 次，继续加油哦～`;

  return (
    <>
      <div className="celebration-overlay" onClick={onPlayAgain}>
        <div className="celebration-box">
          <div className="celebration-icon">👍</div>
          <h2>太棒了！</h2>
          <p className="errors">{msg}</p>
          <button className="btn-play-again" onClick={onPlayAgain}>
            <RefreshIcon size={20} /> 再玩！
          </button>
        </div>
      </div>
      <div className="confetti-container" ref={containerRef} />
    </>
  );
}
