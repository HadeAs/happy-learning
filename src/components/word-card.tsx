"use client";
import { useRef } from "react";
import { speak } from "@/lib/speech";

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

export function WordCard({
  word,
  slot,
  isSelected,
  isMatched,
  isWrong,
  audioOn,
  onClick,
}: WordCardProps) {
  const lastClick = useRef(0);

  const cls = [
    "card",
    "word-card",
    "entering",
    isSelected && "selected",
    isMatched && "matched",
    isWrong && "wrong",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = () => {
    if (isMatched) return;
    const now = Date.now();
    if (now - lastClick.current < THROTTLE_MS) return;
    lastClick.current = now;

    if (audioOn && !isSelected) speak(word);
    onClick(slot);
  };

  return (
    <div
      className={cls}
      style={{ animationDelay: `${50 + slot * 90}ms` }}
      onClick={handleClick}
    >
      {word.toLowerCase()}
      {isMatched ? <span className="match-check">✓</span> : null}
    </div>
  );
}
