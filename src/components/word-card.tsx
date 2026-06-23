"use client";
import { useRef } from "react";

interface WordCardProps {
  word: string;
  slot: number;
  isSelected: boolean;
  isMatched: boolean;
  isWrong: boolean;
  audioOn: boolean;
  onClick: (slot: number) => void;
}

const THROTTLE_MS = 300;
const COLORS = 6;

export function WordCard({
  word, slot, isSelected, isMatched, isWrong, audioOn, onClick,
}: WordCardProps) {
  const lastClick = useRef(0);

  const cls = [
    "card", "word-card", "entering",
    `card-color-${slot % COLORS}`,
    isSelected && "selected",
    isMatched && "matched",
    isWrong && "wrong",
  ].filter(Boolean).join(" ");

  const handleClick = () => {
    if (isMatched) return;
    const now = Date.now();
    if (now - lastClick.current < THROTTLE_MS) return;
    lastClick.current = now;
    if (audioOn && !isSelected && navigator.vibrate) navigator.vibrate(10);
    onClick(slot);
  };

  return (
    <div className={cls} style={{ animationDelay: `${50 + slot * 100}ms` }} onClick={handleClick}>
      {word.toLowerCase()}
      {isMatched ? <span className="match-check">✓</span> : null}
    </div>
  );
}
