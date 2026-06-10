"use client";
import { memo } from "react";

interface WordCardProps {
  word: string;
  slot: number;
  isSelected: boolean;
  isMatched: boolean;
  isWrong: boolean;
  onClick: (slot: number) => void;
}

export const WordCard = memo(function WordCard({
  word,
  slot,
  isSelected,
  isMatched,
  isWrong,
  onClick,
}: WordCardProps) {
  const cls = [
    "card",
    "word-card",
    isSelected && "selected",
    isMatched && "matched",
    isWrong && "wrong",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cls} onClick={() => onClick(slot)}>
      {word}
      {isMatched ? <span style={{ color: "var(--green)" }}> ✓</span> : null}
    </div>
  );
});
